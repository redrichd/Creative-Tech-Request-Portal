import { DepartmentDistribution } from "@/lib/types/dashboard";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface DepartmentChartProps {
    data: DepartmentDistribution[];
    mostActiveDepartment: string;
}

export function DepartmentChart({ data, mostActiveDepartment }: DepartmentChartProps) {
    return (
        <div className="flex flex-col p-6 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.3)] h-[350px]">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-medium">部門需求分佈</h3>
                <span className="text-xs text-white/50 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                    活躍: <span className="text-purple-400 font-bold">{mostActiveDepartment}</span>
                </span>
            </div>

            {data.length === 0 ? (
                <div className="flex-1 flex justify-center items-center text-white/30 text-sm">無資料</div>
            ) : (
                <div className="flex-1 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={5}
                                dataKey="count"
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} className="drop-shadow-[0_0_5px_rgba(255,255,255,0.2)] hover:opacity-80 transition-opacity" />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                        <span className="text-sm font-semibold text-white/50">分佈</span>
                    </div>
                </div>
            )}
        </div>
    );
}
