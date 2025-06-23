import { QueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase"; // ✅ Ensure this is correct

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`${res.status}: ${errorText}`);
  }
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  // ✅ Get the current session from Supabase
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  const userId = data?.session?.user?.id;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (userId) {
    headers["x-user-id"] = userId;
  }

  return headers;
}

export async function apiRequest(
  url: string,
  options: RequestInit = {}
): Promise<any> {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const fullUrl = `${apiUrl.replace(/\/+$/, "")}/${url.replace(/^\/+/, "")}`;

  // 🚨 Prevent incorrect usage
  if (url.toUpperCase() === "GET") {
    console.error("🚨 Bad API request made to 'GET'. This usually means a query or mutation is calling apiRequest('GET') by mistake.");
    console.trace();
    throw new Error("Invalid API request: 'GET' is not a valid path.");
  }

  const authHeaders = await getAuthHeaders();

  const response = await fetch(fullUrl, {
    ...options,
    headers: {
      ...authHeaders,
      ...(options.headers || {}),
    },
  });

  await throwIfResNotOk(response);

  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

type UnauthorizedBehavior = "returnNull" | "throw";

export const getQueryFn = (options: {
  on401: UnauthorizedBehavior;
}) => {
  return async ({ queryKey }: { queryKey: readonly unknown[] }) => {
    console.log("🔍 queryKey received:", queryKey);

    const url = Array.isArray(queryKey)
      ? queryKey.filter((v) => typeof v === "string").join("/")
      : String(queryKey);

    if (!url || url.toUpperCase() === "GET" || url.toUpperCase() === "UNDEFINED") {
      console.error("🚨 Bad or missing queryKey!", queryKey);
      console.trace();
      throw new Error(`⚠️ Invalid query key: ${JSON.stringify(queryKey)}`);
    }

    try {
      return await apiRequest(url);
    } catch (error: any) {
      if (error.message?.includes("401") && options.on401 === "returnNull") {
        return null;
      }
      throw error;
    }
  };
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});
