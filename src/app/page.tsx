"use client";

import { useAuth } from "@/lib/auth_context";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useEffect, useState } from "react";
import { subscribeToRequests } from "@/lib/services/requestService";
import { RequestStatus, ToolRequest, RequestCategory } from "@/lib/types";
import { RequestList } from "@/components/ui/RequestList";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Plus, Loader2 } from "lucide-react";
import { RequestDetailModal } from "@/components/ui/RequestDetailModal";
import { statusConfig } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";

const STATUS_FILTERS: RequestStatus[] = ["pending", "discussing", "developing", "done", "cancelled"];

const CATEGORY_FILTERS: { value: RequestCategory; label: string; colorClass: string; activeClass: string }[] = [
  { value: "design", label: "設計", colorClass: "bg-purple-500/10 text-purple-200 border-purple-500/20", activeClass: "bg-purple-500 text-white border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]" },
  { value: "programming", label: "程式", colorClass: "bg-orange-500/10 text-orange-200 border-orange-500/20", activeClass: "bg-orange-500 text-white border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.5)]" },
  { value: "other", label: "其他", colorClass: "bg-zinc-500/10 text-zinc-200 border-zinc-500/20", activeClass: "bg-zinc-500 text-white border-zinc-400 shadow-[0_0_15px_rgba(113,113,122,0.5)]" },
];

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [allRequests, setAllRequests] = useState<ToolRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Multi-select states
  const [selectedStatuses, setSelectedStatuses] = useState<RequestStatus[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<RequestCategory[]>([]);

  const [selectedRequest, setSelectedRequest] = useState<ToolRequest | null>(null);
  const isAdmin = user?.isAdmin || false;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    // 只有當審核通過且已掛載才訂閱資料
    if (mounted && user && !user.isPending) {
      const unsubscribe = subscribeToRequests({}, (data: ToolRequest[]) => {
        setAllRequests(data);
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [mounted, user]);

  const toggleStatus = (status: RequestStatus) => {
    setSelectedStatuses(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const toggleCategory = (category: RequestCategory) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const requests = allRequests.filter(r => {
    const rStatus = r.status;
    const rCategory = r.category || 'other';

    const matchStatus = selectedStatuses.length === 0 || selectedStatuses.includes(rStatus);
    const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(rCategory);

    const searchLower = search.toLowerCase();
    const matchSearch =
      r.ticketNo.toLowerCase().includes(searchLower) ||
      r.toolName.toLowerCase().includes(searchLower) ||
      (r.applicantName || "").toLowerCase().includes(searchLower) ||
      (r.adminHandler?.displayName || "").toLowerCase().includes(searchLower) ||
      (r.supervisorHandler?.displayName || "").toLowerCase().includes(searchLower);

    return matchStatus && matchCategory && matchSearch;
  });

  // 處理「載入中」
  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f111a]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // 如果角色是 pending，顯示待審核頁面
  if (user?.isPending) {
    return (
      <div className="min-h-screen bg-[#0f111a] flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-[#1a1d2d] p-8 rounded-2xl border border-blue-500/30 max-w-md shadow-2xl">
          <div className="text-6xl mb-6">⏳</div>
          <h1 className="text-2xl font-bold text-white mb-4">帳號審核中</h1>
          <p className="text-gray-400 mb-6 leading-relaxed">
            親愛的 {user.displayName} 您好：<br />
            您的帳號目前權限為預設訪客，請聯繫管理員開通權限後即可開始使用平台。
          </p>
          <div className="text-xs text-blue-400/60 font-mono">UID: {user.uid}</div>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-black/20 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white">
                創研需求管理平台
              </h1>
              <p className="text-white/60">驅動企業創新，打造數位資產的實踐基地</p>
            </div>

            <div className="flex items-center gap-4">
              {/* Category Filters (Top Right) */}
              <div className="flex gap-2">
                {CATEGORY_FILTERS.map(cat => {
                  const isActive = selectedCategories.includes(cat.value);
                  return (
                    <button
                      key={cat.value}
                      onClick={() => toggleCategory(cat.value)}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium border transition-all duration-300",
                        isActive ? cat.activeClass : `${cat.colorClass} opacity-60 hover:opacity-100`
                      )}
                    >
                      {cat.label}
                    </button>
                  )
                })}
              </div>

              <Link href="/request">
                <Button className="w-full md:w-auto shadow-lg shadow-blue-500/20">
                  <Plus className="w-4 h-4 mr-2" /> 新增需求
                </Button>
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 bg-white/5 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
            <div className="flex-1">
              <Input
                placeholder="搜尋單號、工具名稱、申請人..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-black/20"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedStatuses.length === 0 ? "primary" : "ghost"}
                onClick={() => setSelectedStatuses([])}
                className="text-xs h-9 rounded-full"
              >
                全部
              </Button>
              {STATUS_FILTERS.map(s => {
                const isActive = selectedStatuses.includes(s);
                return (
                  <Button
                    key={s}
                    variant="ghost"
                    onClick={() => toggleStatus(s)}
                    className={cn(
                      "text-xs h-9 capitalize rounded-full border transition-all duration-200",
                      isActive
                        ? `bg-${statusConfig[s].color.replace('text-', '')}-500/20 border-${statusConfig[s].color.replace('text-', '')}-500 text-white shadow-[0_0_10px_rgba(255,255,255,0.2)]`
                        : "border-transparent text-white/60 hover:text-white hover:bg-white/5"
                    )}
                    style={isActive ? { borderColor: 'currentColor' } : {}}
                  >
                    {statusConfig[s].label}
                  </Button>
                )
              })}
            </div>
          </div>

          {/* List */}
          <RequestList
            requests={requests}
            loading={loading}
            onSelect={setSelectedRequest}
          />
        </div>


        {/* Modal */}
        <RequestDetailModal
          request={selectedRequest}
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          isAdmin={isAdmin}
          onEdit={() => { }}
        />
      </div>
    </AuthGuard>
  );
}