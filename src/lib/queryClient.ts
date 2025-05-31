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
    console.log("🔍 queryKey received:", queryKey); // 👈 Add this line

    try {
      const url = Array.isArray(queryKey) ? queryKey.join("/") : String(queryKey);
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
