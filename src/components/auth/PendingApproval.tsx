"use client";

import { motion } from "framer-motion";
import { Lock, Clock, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth_context";

export function PendingApproval() {
    const { logout } = useAuth();

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 backdrop-blur-xl max-w-md w-full shadow-2xl"
            >
                <div className="bg-yellow-500/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-yellow-500/20">
                    <Clock className="w-10 h-10 text-yellow-500 animate-pulse" />
                </div>

                <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">
                    帳號審核中
                </h1>

                <p className="text-zinc-400 mb-8 leading-relaxed">
                    您的帳號已成功建立，目前正在等待管理員審核。
                    審核完成後，您將可以存取系統內容。
                </p>

                <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 text-sm text-zinc-500 bg-zinc-800/50 py-3 rounded-xl border border-zinc-700/50">
                        <Lock className="w-4 h-4" />
                        <span>受限制的訪問權限</span>
                    </div>

                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white transition-all font-medium border border-zinc-700"
                    >
                        <LogOut className="w-4 h-4" />
                        登出帳號
                    </button>
                </div>
            </motion.div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 text-zinc-600 text-sm"
            >
                如有急需，請聯繫系統管理員
            </motion.p>
        </div>
    );
}
