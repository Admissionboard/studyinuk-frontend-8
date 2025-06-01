import { QueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase"; // ✅ Make sure this path is correct

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`${res.status}: ${errorText}`);
  }
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  // ✅ Get the current session from Supabase
  const { data, error } = await supabase.auth.getSession();
  const token = data?.session?.access_token;

  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiRequest(
  url: string,
  options: RequestInit = {}
): Promise<any> {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const fullUrl = `${apiUrl.replace(/\/+$/, '')}/${url.replace(/^\/+/, '')}`;

  // 🚨 Add this check to catch invalid usage
  if (url.toUpperCase() === "GET") {
    console.error("🚨 Bad API request made to 'GET'. This usually means a query or mutation is calling apiRequest('GET') by mistake.");
    console.trace(); // 🔍 Shows exactly where the error originated
    throw new Error("Invalid API request: 'GET' is not a valid path.");
  }

  const authHeaders = await getAuthHeaders();

  const response = await fetch(fullUrl, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...options.headers,
    },
  });

  await throwIfResNotOk(response);

  if (response.headers.get("content-type")?.includes("application/json")) {
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
