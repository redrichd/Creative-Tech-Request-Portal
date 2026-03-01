import { cn } from "@/lib/utils";
import { LayoutGrid, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

export type ViewMode = "list" | "dashboard";

interface ViewSwitcherProps {
    view: ViewMode;
    onChange: (view: ViewMode) => void;
}

export function ViewSwitcher({ view, onChange }: ViewSwitcherProps) {
    return (
        <div className="relative flex items-center p-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-full w-[120px] shadow-inner h-[40px]">
            <div
                className={cn(
                    "absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-gradient-to-r from-blue-500/80 to-purple-500/80 shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-transform duration-300 ease-in-out",
                    view === "list" ? "translate-x-0" : "translate-x-full"
                )}
            />
            <button
                onClick={() => onChange("list")}
                className={cn(
                    "relative z-10 flex flex-1 items-center justify-center h-full rounded-full transition-colors duration-200",
                    view === "list" ? "text-white" : "text-white/60 hover:text-white"
                )}
                title="卡片列表 (List View)"
            >
                <LayoutGrid className="w-4 h-4" />
            </button>
            <button
                onClick={() => onChange("dashboard")}
                className={cn(
                    "relative z-10 flex flex-1 items-center justify-center h-full rounded-full transition-colors duration-200",
                    view === "dashboard" ? "text-white" : "text-white/60 hover:text-white"
                )}
                title="即時看板 (Dashboard View)"
            >
                <BarChart3 className="w-4 h-4" />
            </button>
        </div>
    );
}
