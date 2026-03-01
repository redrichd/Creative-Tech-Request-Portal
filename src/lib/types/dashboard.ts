export interface DashboardSummary {
    totalRequests: number;
    todayNew: number;
    completedTotal: number;
    avgDevDays: number;
}

export interface DepartmentDistribution {
    department: string;
    count: number;
    fill: string;
}

export interface CategoryVsStatus {
    category: string;
    black: number;
    gray: number;
    red: number;
    orange: number;
    green: number;
}

export interface MomentumTrend {
    date: string;
    count: number;
}

export interface DashboardAggregate {
    summary: DashboardSummary;
    departmentDistribution: DepartmentDistribution[];
    categoryVsStatus: CategoryVsStatus[];
    momentum: MomentumTrend[];
    mostActiveDepartment: string;
    isLoading: boolean;
    error: Error | null;
}
