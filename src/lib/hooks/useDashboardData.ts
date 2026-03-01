import { useState, useEffect } from 'react';
import { subscribeToRequests } from '@/lib/services/requestService';
import { ToolRequest, RequestStatus, RequestCategory } from '@/lib/types';
import { DashboardAggregate } from '@/lib/types/dashboard';
import { differenceInDays, subDays } from 'date-fns';

export function useDashboardData(
    selectedStatuses: RequestStatus[],
    selectedCategories: RequestCategory[],
    searchQuery: string
) {
    const [data, setData] = useState<DashboardAggregate>({
        summary: { totalRequests: 0, todayNew: 0, completedTotal: 0, avgDevDays: 0 },
        departmentDistribution: [],
        categoryVsStatus: [],
        momentum: [],
        mostActiveDepartment: "",
        isLoading: true,
        error: null,
    });

    useEffect(() => {
        const unsubscribe = subscribeToRequests({}, (requests: ToolRequest[]) => {
            // Helper function to safely extract dates
            const getDateSafely = (val: unknown) => {
                if (!val) return null;
                if (typeof val === 'object' && val !== null && 'toDate' in val && typeof (val as { toDate: () => Date }).toDate === 'function') {
                    return (val as { toDate: () => Date }).toDate();
                }
                if (val instanceof Date) return val;
                if (typeof val === 'string' || typeof val === 'number') return new Date(val);
                return null;
            };

            // 1. Filter data based on hoisted parent state
            const filteredRequests = requests.filter(r => {
                const rStatus = r.status;
                const rCategory = r.category || 'other';

                const matchStatus = selectedStatuses.length === 0 || selectedStatuses.includes(rStatus);
                const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(rCategory);

                const searchLower = searchQuery.toLowerCase();
                const matchSearch =
                    r.ticketNo.toLowerCase().includes(searchLower) ||
                    r.toolName.toLowerCase().includes(searchLower) ||
                    (r.applicantName || "").toLowerCase().includes(searchLower) ||
                    (r.adminHandler?.displayName || "").toLowerCase().includes(searchLower) ||
                    (r.supervisorHandler?.displayName || "").toLowerCase().includes(searchLower);

                return matchStatus && matchCategory && matchSearch;
            });

            // 2. Calculate Dashboard Summary
            const totalRequests = filteredRequests.length;

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayNew = filteredRequests.filter(r => {
                const createdAt = getDateSafely(r.createdAt);
                return createdAt && createdAt >= today;
            }).length;

            const completedRequests = filteredRequests.filter(r => r.status === 'done');
            const completedTotal = completedRequests.length;

            // Calculate avg dev days (from createdAt to updatedAt for 'done' requests)
            let totalDevDays = 0;
            let devDaysCount = 0;
            completedRequests.forEach(r => {
                const created = getDateSafely(r.createdAt);
                const updated = getDateSafely(r.updatedAt);
                if (created && updated) {
                    totalDevDays += Math.max(1, differenceInDays(updated, created));
                    devDaysCount++;
                }
            });
            const avgDevDays = devDaysCount > 0 ? Math.round((totalDevDays / devDaysCount) * 10) / 10 : 0;

            // 3. Department Distribution
            const deptMap: Record<string, number> = {};
            filteredRequests.forEach(r => {
                const dept = r.department || '未分類';
                deptMap[dept] = (deptMap[dept] || 0) + 1;
            });

            const colors = ['#a855f7', '#3b82f6', '#ec4899', '#f97316', '#22c55e', '#64748b'];
            const departmentDistribution = Object.entries(deptMap)
                .map(([department, count], index) => ({
                    department,
                    count,
                    fill: colors[index % colors.length]
                }))
                .sort((a, b) => b.count - a.count);

            const mostActiveDepartment = departmentDistribution.length > 0 ? departmentDistribution[0].department : '無';

            // 4. Category vs Status
            const catStatMap: Record<string, { category: string; black: number; gray: number; red: number; orange: number; green: number }> = {
                'design': { category: '設計', black: 0, gray: 0, red: 0, orange: 0, green: 0 },
                'programming': { category: '程式', black: 0, gray: 0, red: 0, orange: 0, green: 0 },
                'other': { category: '其他', black: 0, gray: 0, red: 0, orange: 0, green: 0 }
            };

            filteredRequests.forEach(r => {
                const cat = r.category || 'other';
                const stat = r.status;
                if (catStatMap[cat]) {
                    if (stat === 'pending') catStatMap[cat].black++;
                    if (stat === 'cancelled') catStatMap[cat].gray++;
                    if (stat === 'discussing') catStatMap[cat].red++;
                    if (stat === 'developing') catStatMap[cat].orange++;
                    if (stat === 'done') catStatMap[cat].green++;
                }
            });
            const categoryVsStatus = Object.values(catStatMap);

            // 5. Momentum Trend (Last 30 Days)
            const momentumMap: Record<string, number> = {};
            for (let i = 29; i >= 0; i--) {
                const d = subDays(new Date(), i);
                momentumMap[`${d.getMonth() + 1}/${d.getDate()}`] = 0;
            }

            filteredRequests.forEach(r => {
                const createdAt = getDateSafely(r.createdAt);
                if (createdAt) {
                    const diff = differenceInDays(new Date(), createdAt);
                    if (diff < 30) {
                        const dateStr = `${createdAt.getMonth() + 1}/${createdAt.getDate()}`;
                        if (momentumMap[dateStr] !== undefined) {
                            momentumMap[dateStr]++;
                        }
                    }
                }
            });
            const momentum = Object.entries(momentumMap).map(([date, count]) => ({ date, count }));

            setData({
                summary: { totalRequests, todayNew, completedTotal, avgDevDays },
                departmentDistribution,
                categoryVsStatus,
                momentum,
                mostActiveDepartment,
                isLoading: false,
                error: null,
            });
        });

        return () => unsubscribe();
    }, [selectedStatuses, selectedCategories, searchQuery]);

    return data;
}
