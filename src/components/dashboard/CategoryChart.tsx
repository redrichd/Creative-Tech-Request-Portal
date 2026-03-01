import { CategoryVsStatus } from "@/lib/types/dashboard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface CategoryChartProps {
    data: CategoryVsStatus[];
}

export function CategoryChart({ data }: CategoryChartProps) {
    return (
        <div className="flex flex-col p-6 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.3)] h-[350px]">
            <h3 className="text-white font-medium mb-4">分類進度狀態</h3>
            {data.length === 0 ? (
                <div className="flex-1 flex justify-center items-center text-white/30 text-sm">無資料</div>
            ) : (
                <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{ top: 20, right: 30, left: -20, bottom: 5 }}
                        >
                            <XAxis dataKey="category" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                            />
                            <Legend wrapperStyle={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }} />
                            <Bar dataKey="black" stackId="a" fill="#1e293b" name="待辦" radius={[0, 0, 4, 4]} />
                            <Bar dataKey="red" stackId="a" fill="#ef4444" name="討論中" />
                            <Bar dataKey="orange" stackId="a" fill="#f97316" name="開發中" />
                            <Bar dataKey="green" stackId="a" fill="#22c55e" name="已完成" />
                            <Bar dataKey="gray" stackId="a" fill="#64748b" name="已取消" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
