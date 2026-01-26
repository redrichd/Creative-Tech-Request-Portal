import { ToolRequest } from "@/lib/types";
import { Card } from "../ui/Card";
import { StatusBadge } from "../ui/StatusBadge";
import { CategoryBadge } from "../ui/CategoryBadge";
import { Calendar, User, CalendarClock, MessageCircle } from "lucide-react";

import { formatFirestoreTimestamp } from "@/lib/utils";

interface RequestCardProps {
    request: ToolRequest;
    onClick: () => void;
}

export function RequestCard({ request, onClick }: RequestCardProps) {
    return (
        <Card
            onClick={onClick}
            hoverEffect
            className="cursor-pointer bg-white/5 border-white/10 p-5 flex flex-col h-full gap-4"
        >
            <div className="flex justify-between items-start">
                <div className="space-y-1 w-full">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="text-xs text-white/40 font-mono">{request.ticketNo}</div>
                            <StatusBadge status={request.status} />
                            <CategoryBadge category={request.category || 'other'} />
                        </div>
                    </div>

                    <h3 className="font-semibold text-white/90 truncate pr-2 pt-1">{request.toolName}</h3>
                </div>
            </div>

            <p className="text-sm text-white/60 line-clamp-2 min-h-[40px]">
                {request.description}
            </p>

            <div className="flex items-center justify-between text-xs text-white/40 pt-2 border-t border-white/5 mt-auto">
                <div className="flex items-center space-x-2">
                    <User className="w-3 h-3" />
                    <span>{request.applicantName.split(' ')[0]}</span>
                </div>

                {/* Handlers (Admin & Supervisor) */}
                <div className="flex items-center space-x-3">
                    {/* Admin Handler */}
                    {request.adminHandler && (
                        <div className="flex items-center space-x-2" title={`Last updated by ${request.adminHandler.displayName || 'Admin'}`}>
                            {request.adminHandler.photoURL ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={request.adminHandler.photoURL} alt="Admin" className="w-4 h-4 rounded-full border border-white/20" />
                            ) : (
                                <div className="w-4 h-4 rounded-full bg-indigo-500/20 flex items-center justify-center text-[8px] text-indigo-300 font-bold">
                                    A
                                </div>
                            )}
                            <span className="hidden sm:inline text-white/30">
                                {request.adminHandler.displayName?.split(' ')[0]}
                            </span>
                        </div>
                    )}

                    {/* Supervisor Handler */}
                    {(request.supervisorHandler || request.managerResponder || request.managerApproval) && (
                        <div className="flex items-center space-x-2" title="Supervisor Approved">
                            {request.supervisorHandler?.photoURL ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={request.supervisorHandler.photoURL} alt="Supervisor" className="w-4 h-4 rounded-full border border-indigo-300/30" />
                            ) : (
                                <div className="w-4 h-4 rounded-full bg-purple-500/20 flex items-center justify-center text-[8px] text-purple-300 font-bold">
                                    {request.supervisorHandler?.displayName?.[0] || request.managerResponder?.displayName?.[0] || "S"}
                                </div>
                            )}
                            <span className="hidden sm:inline text-white/30">
                                {request.supervisorHandler?.displayName?.split(' ')[0] || request.managerResponder?.displayName?.split(' ')[0] || "主管"}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex items-center space-x-4">
                    {request.estimatedDate && (
                        <div className="flex items-center space-x-2 text-blue-300/80" title="預計完成日期">
                            <CalendarClock className="w-3 h-3" />
                            <span>
                                {formatFirestoreTimestamp(request.estimatedDate)}
                            </span>
                        </div>
                    )}
                    <div className="flex items-center space-x-2" title="申請日期">
                        <Calendar className="w-3 h-3" />
                        <span>
                            {formatFirestoreTimestamp(request.createdAt) || 'Just now'}
                        </span>
                    </div>
                </div>
            </div>
        </Card>
    );
}
