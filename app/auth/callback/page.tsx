"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSession } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      router.push("/login?error=auth_failed");
      return;
    }

    // Set token in localStorage and AuthContext
    const fetchSession = async () => {
      try {
        // Temporarily set the token in localStorage so apiClient can use it
        localStorage.setItem("alumnia_token", token);
        const user = await apiClient.auth.me();
        
        setSession({ user, token });
        router.push("/home");
      } catch (err) {
        console.error("Auth callback error:", err);
        localStorage.removeItem("alumnia_token");
        router.push("/login?error=auth_failed");
      }
    };

    fetchSession();
  }, [router, searchParams, setSession]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Authenticating...</p>
      </div>
    </div>
  );
}
