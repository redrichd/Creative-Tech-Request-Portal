import { DashboardAggregate } from "@/lib/types/dashboard";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { DepartmentChart } from "@/components/dashboard/DepartmentChart";
import { CategoryChart } from "@/components/dashboard/CategoryChart";
import { MomentumChart } from "@/components/dashboard/MomentumChart";

interface DashboardViewProps {
    data: DashboardAggregate;
}

export function DashboardView({ data }: DashboardViewProps) {
    if (data.isLoading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center bg-[#1a0b2e]/50 backdrop-blur-md rounded-2xl border border-purple-500/20 shadow-[0_0_30px_rgba(88,28,135,0.4)]">
                <div className="w-8 h-8 rounded-full border-t-2 border-r-2 border-purple-400 animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 p-6 min-h-[600px] bg-[#1a0b2e]/60 backdrop-blur-xl rounded-2xl border border-purple-500/40 shadow-[0_0_40px_rgba(88,28,135,0.3)]">
            <SummaryCards summary={data.summary} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DepartmentChart data={data.departmentDistribution} mostActiveDepartment={data.mostActiveDepartment} />
                <CategoryChart data={data.categoryVsStatus} />
            </div>
            <MomentumChart data={data.momentum} />
        </div>
    );
}
