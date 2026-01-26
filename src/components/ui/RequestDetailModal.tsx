import { ToolRequest, RequestStatus, RequestCategory, UserProfile } from "@/lib/types";
import { useAuth } from "@/lib/auth_context";
import { StatusBadge, statusConfig } from "../ui/StatusBadge";
import { CategoryBadge } from "../ui/CategoryBadge";
import { X, Calendar, User, AlignLeft, CheckCircle, Save, Trash2, Edit2 } from "lucide-react";
import { Button } from "../ui/Button";
import { useState, useEffect } from "react";
import { updateRequestAdmin, updateRequestSupervisor, deleteRequest } from "@/lib/services/requestService";
import { toast } from "sonner";
import { formatFirestoreTimestamp } from "@/lib/utils";

interface RequestDetailModalProps {
    request: ToolRequest | null;
    isOpen: boolean;
    onClose: () => void;
    isAdmin?: boolean;
    onEdit?: () => void;
}

const STATUS_OPTIONS: RequestStatus[] = ["pending", "discussing", "developing", "done", "cancelled"];

export function RequestDetailModal({ request, isOpen, onClose, isAdmin }: RequestDetailModalProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<{ status: RequestStatus; adminNote: string; estimatedDate: string; category: RequestCategory }>({
        status: "pending",
        adminNote: "",
        estimatedDate: "",
        category: "other"
    });
    const [supervisorContent, setSupervisorContent] = useState("");
    const [showSupervisorInput, setShowSupervisorInput] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (request && isOpen) {
            let dateStr = "";
            if (request.estimatedDate) {
                // Use helper to try and get a date object, then format for input
                // But input type="date" needs YYYY-MM-DD
                let d: Date | null = null;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const rd = request.estimatedDate as any;
                if (rd?.toDate) d = rd.toDate();
                else if (rd instanceof Date) d = rd;
                else d = new Date(rd);

                if (d && !isNaN(d.getTime())) {
                    dateStr = d.toISOString().split('T')[0];
                }
            }

            setEditData({
                status: request.status,
                adminNote: request.adminNote || "",
                estimatedDate: dateStr,
                category: request.category || "other"
            });
            setSupervisorContent(request.supervisorHandler?.content || "");
            setIsEditing(false); // Reset edit mode on open
            setShowSupervisorInput(false);
        }
    }, [request, isOpen]);

    if (!isOpen || !request) return null;

    const { user } = useAuth(); // Import useAuth to get current admin info

    // Strict segregation requested: "When role is supervisor...".
    const currentUser = user as unknown as UserProfile;
    const canSeeAdminActions = currentUser?.role === 'admin' || currentUser?.role === 'super_admin';
    const canSeeSupervisorActions = currentUser?.role === 'supervisor' || currentUser?.role === 'super_admin';

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateRequestAdmin(request.doc_id, {
                status: editData.status,
                adminNote: editData.adminNote,
                estimatedDate: editData.estimatedDate ? new Date(editData.estimatedDate) : null,
                category: editData.category,
                adminHandler: user ? {
                    uid: user.uid,
                    displayName: user.displayName,
                    photoURL: user.photoURL
                } : undefined
            });
            toast.success("Request updated");
            setIsEditing(false);
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update");
        } finally {
            setSaving(false);
        }
    };

    const handleSupervisorSave = async () => {
        if (!user) return;
        setSaving(true);
        try {
            await updateRequestSupervisor(request.doc_id, {
                content: supervisorContent,
                displayName: user.displayName,
                photoURL: user.photoURL,
                uid: user.uid
            });
            toast.success("Supervisor approval saved");
            setShowSupervisorInput(false);
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Failed to save approval");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this request?")) return;
        try {
            await deleteRequest(request.doc_id);
            toast.success("Request deleted");
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Panel */}
            <div
                className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-[#0f0c29]/90 border border-white/10 shadow-2xl transition-all p-6 text-left align-middle"
                style={{
                    background: 'linear-gradient(135deg, rgba(30, 30, 50, 0.95), rgba(15, 12, 41, 0.95))'
                }}
            >
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div className="space-y-1">
                        <div className="flex items-center space-x-3">
                            <span className="text-xs text-white/40 font-mono tracking-wider">{request.ticketNo}</span>
                            {isEditing ? (
                                <select
                                    value={editData.status}
                                    onChange={(e) => setEditData(prev => ({ ...prev, status: e.target.value as RequestStatus }))}
                                    className="bg-white/10 border border-white/20 text-white text-xs rounded px-2 py-1"
                                >
                                    {STATUS_OPTIONS.map(s => (
                                        <option key={s} value={s} className="text-black">
                                            {statusConfig[s].label}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <StatusBadge status={request.status} />
                            )}
                        </div>
                        <h2 className="text-xl font-bold text-white leading-tight">{request.toolName}</h2>
                    </div>

                    <div className="flex items-center space-x-2">
                        {canSeeAdminActions && !isEditing && (
                            <Button variant="ghost" onClick={() => setIsEditing(true)} className="p-2 h-auto text-white/50 hover:text-white" title="Edit Admin">
                                <Edit2 className="w-4 h-4" />
                            </Button>
                        )}
                        {canSeeSupervisorActions && !showSupervisorInput && (
                            <Button variant="ghost" onClick={() => setShowSupervisorInput(true)} className="p-2 h-auto text-indigo-400 hover:text-indigo-300" title="Supervisor Approval">
                                <Edit2 className="w-4 h-4" />
                            </Button>
                        )}
                        <Button variant="ghost" onClick={onClose} className="p-2 h-auto text-white/50 hover:text-white">
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                <div className="py-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {/* Meta */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                            <span className="text-white/40 text-xs uppercase">申請人</span>
                            <div className="flex items-center space-x-2 text-white/90">
                                <User className="w-4 h-4 text-purple-400" />
                                <span>{request.applicantName}</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-white/40 text-xs uppercase">部門</span>
                            <div className="text-white/90">{request.department}</div>
                        </div>

                        {/* Category Section */}
                        <div className="space-y-1">
                            <span className="text-white/40 text-xs uppercase">類別</span>
                            {isEditing ? (
                                <select
                                    value={editData.category || 'other'}
                                    onChange={(e) => setEditData(prev => ({ ...prev, category: e.target.value as any }))}
                                    className="bg-white/10 border border-white/20 text-white text-sm rounded px-2 py-1 w-full"
                                >
                                    <option value="other" className="text-black">其他</option>
                                    <option value="design" className="text-black">設計</option>
                                    <option value="programming" className="text-black">程式</option>
                                </select>
                            ) : (
                                <div>
                                    <CategoryBadge category={request.category} />
                                </div>
                            )}
                        </div>

                        {/* Estimated Date Section */}
                        <div className="space-y-1">
                            <span className="text-white/40 text-xs uppercase flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> 預計完成日期
                            </span>
                            {isEditing ? (
                                <input
                                    type="date"
                                    value={editData.estimatedDate}
                                    onChange={(e) => setEditData(prev => ({ ...prev, estimatedDate: e.target.value }))}
                                    className="bg-white/10 border border-white/20 text-white text-sm rounded px-2 py-1 w-full"
                                />
                            ) : (
                                <div className="text-white/90 font-mono">
                                    {request.estimatedDate ? formatFirestoreTimestamp(request.estimatedDate) : (
                                        <span className="text-white/30 italic">尚未排程</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-white/60 flex items-center gap-2">
                            <AlignLeft className="w-4 h-4" /> 需求描述
                        </h3>
                        <div className="p-4 rounded-lg bg-white/5 border border-white/5 text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
                            {request.description}
                        </div>
                    </div>

                    {/* Criteria */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-white/60 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" /> 驗收標準
                        </h3>
                        <div className="p-4 rounded-lg bg-white/5 border border-white/5 text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
                            {request.criteria}
                        </div>
                    </div>

                    {(request.adminNote || isEditing) && (
                        <div className="space-y-2 pt-4 border-t border-white/10">
                            <h3 className="text-sm font-semibold text-white/60 flex items-center gap-2">
                                管理員註記
                            </h3>
                            {isEditing ? (
                                <textarea
                                    value={editData.adminNote}
                                    onChange={(e) => setEditData(prev => ({ ...prev, adminNote: e.target.value }))}
                                    className="w-full h-20 bg-white/10 border border-white/20 rounded p-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/30"
                                    placeholder="新增內部註記..."
                                />
                            ) : (
                                <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-100 text-sm whitespace-pre-wrap">
                                    {request.adminNote}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Supervisor Approval Section */}
                    {(request.supervisorHandler || showSupervisorInput) && (
                        <div className="space-y-2 pt-4 border-t border-white/10">
                            <h3 className="text-sm font-semibold text-white/60 flex items-center gap-2">
                                權責主管批示
                            </h3>
                            {showSupervisorInput ? (
                                <div className="space-y-3">
                                    <textarea
                                        value={supervisorContent}
                                        onChange={(e) => setSupervisorContent(e.target.value)}
                                        className="w-full h-24 bg-white/10 border border-white/20 rounded p-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                                        placeholder="輸入主管批示..."
                                    />
                                    <div className="flex justify-end gap-2">
                                        <Button onClick={() => setShowSupervisorInput(false)} variant="ghost" size="sm">取消</Button>
                                        <Button onClick={handleSupervisorSave} isLoading={saving} size="sm">
                                            <Save className="w-3 h-3 mr-2" /> 儲存批示
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                request.supervisorHandler && (
                                    <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-100 text-sm">
                                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-indigo-500/10">
                                            {request.supervisorHandler.photoURL ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={request.supervisorHandler.photoURL} alt="Supervisor" className="w-5 h-5 rounded-full" />
                                            ) : (
                                                <div className="w-5 h-5 rounded-full bg-indigo-400 flex items-center justify-center text-[10px] text-white font-bold">
                                                    {request.supervisorHandler.displayName?.[0] || "S"}
                                                </div>
                                            )}
                                            <span className="font-semibold opacity-90">{request.supervisorHandler.displayName}</span>
                                        </div>
                                        <div className="whitespace-pre-wrap opacity-90">
                                            {request.supervisorHandler.content}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}

                    {/* Old Manager Approval (Legacy display if exists but no supervisor handler) */}
                    {(!request.supervisorHandler && (request.managerApproval)) && (
                        <div className="space-y-2 pt-4 border-t border-white/10 opacity-50">
                            <h3 className="text-sm font-semibold text-white/60 flex items-center gap-2">
                                主管批示 (Legacy)
                            </h3>
                            <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-white/70 text-sm whitespace-pre-wrap">
                                {request.managerApproval}
                            </div>
                        </div>
                    )}

                    {/* Admin Actions */}
                    {isEditing && (
                        <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                            <Button onClick={handleDelete} variant="danger" className="text-xs">
                                <Trash2 className="w-4 h-4 mr-2" /> 刪除需求
                            </Button>

                            <div className="space-x-2">
                                <Button onClick={() => setIsEditing(false)} variant="ghost">取消</Button>
                                <Button onClick={handleSave} isLoading={saving}>
                                    <Save className="w-4 h-4 mr-2" /> 儲存變更
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
