"use client";

import { useAuth } from "@/lib/auth_context";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { PendingApproval } from "@/components/auth/PendingApproval";

export function AuthWrapper({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="min-h-screen bg-black" />;
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    if (user?.isPending) {
        return <PendingApproval />;
    }

    return (
        <>
            <Navbar />
            <main className="pt-16 min-h-screen">
                {children}
            </main>
        </>
    );
}
