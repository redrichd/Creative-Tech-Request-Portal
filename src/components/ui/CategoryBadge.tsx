import { RequestCategory } from "@/lib/types";
import { cn } from "@/lib/utils"; // Assuming utils exists, otherwise I'll need to check or implement. I see cn used in other files usually.
// Wait, I haven't checked utils. I'll assume standard class merging.
// Actually, looking at RequestCard uses className string, let's verify if cn exists.
// I'll stick to standard tailwind classes for now to be safe, or check imports.
// RequestCard uses regular strings.
// Let's create it without external util dependency first.

interface CategoryBadgeProps {
    category?: RequestCategory;
    className?: string;
}

export const CATEGORY_CONFIG: Record<RequestCategory, { label: string; colorClass: string; textColor: string }> = {
    design: {
        label: "設計",
        colorClass: "bg-purple-500/20 border-purple-500/30",
        textColor: "text-purple-300"
    },
    programming: {
        label: "程式",
        colorClass: "bg-orange-500/20 border-orange-500/30",
        textColor: "text-orange-300"
    },
    other: {
        label: "其他",
        colorClass: "bg-gray-500/20 border-gray-500/30",
        textColor: "text-gray-300"
    }
};

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
    // Default to 'other' if undefined
    const validCategory = category || 'other';
    const config = CATEGORY_CONFIG[validCategory];

    return (
        <span className={`inline-flex items-center justify-center px-3 py-[2px] rounded-full text-[10px] font-medium leading-none border ${config.colorClass} ${config.textColor} ${className || ''}`}>
            <span className="translate-y-[0.5px]">{config.label}</span>
        </span>
    );
}
