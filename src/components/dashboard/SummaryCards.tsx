import { DashboardSummary } from "@/lib/types/dashboard";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Zap, CheckCircle2, Clock } from "lucide-react";

interface SummaryCardsProps {
    summary: DashboardSummary;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
    const cards = [
        {
            title: "總需求數",
            value: summary.totalRequests,
            icon: <Layers className="w-5 h-5 text-purple-400" />,
            glow: "shadow-[0_0_15px_rgba(168,85,247,0.3)]",
            border: "border-purple-500/30",
        },
        {
            title: "今日新增",
            value: summary.todayNew,
            icon: <Zap className="w-5 h-5 text-yellow-400" />,
            glow: "shadow-[0_0_15px_rgba(250,204,21,0.3)]",
            border: "border-yellow-500/30",
        },
        {
            title: "已完成",
            value: summary.completedTotal,
            icon: <CheckCircle2 className="w-5 h-5 text-green-400" />,
            glow: "shadow-[0_0_15px_rgba(74,222,128,0.3)]",
            border: "border-green-500/30",
        },
        {
            title: "整體完成率",
            value: summary.totalRequests > 0 ? Math.round((summary.completedTotal / summary.totalRequests) * 100) : 0,
            icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
            glow: "shadow-[0_0_15px_rgba(52,211,153,0.3)]",
            border: "border-emerald-500/30",
            suffix: "%"
        },
        {
            title: "平均開發天數",
            value: summary.avgDevDays,
            icon: <Clock className="w-5 h-5 text-blue-400" />,
            glow: "shadow-[0_0_15px_rgba(96,165,250,0.3)]",
            border: "border-blue-500/30",
            suffix: "天"
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {cards.map((card, idx) => (
                <div
                    key={idx}
                    className={`flex flex-col p-5 bg-black/20 backdrop-blur-md rounded-2xl border ${card.border} ${card.glow} transition-all duration-300 hover:bg-white/5`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-white/70 text-sm font-medium">{card.title}</span>
                        <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                            {card.icon}
                        </div>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <AnimatePresence mode="popLayout">
                            <motion.span
                                key={card.value}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-green-500 font-mono tracking-tight drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]"
                            >
                                {card.value}
                            </motion.span>
                        </AnimatePresence>
                        {card.suffix && <span className="text-white/50 text-sm ml-1">{card.suffix}</span>}
                    </div>
                </div>
            ))}
        </div>
    );
}
