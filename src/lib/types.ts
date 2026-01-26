import { Timestamp, FieldValue } from "firebase/firestore";

export type RequestStatus = "pending" | "discussing" | "developing" | "done" | "cancelled";
export type RequestCategory = "design" | "programming" | "other";

export interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    department?: string;
    updatedAt: Timestamp | FieldValue;
    role: "user" | "admin" | "supervisor" | "super_admin" | "pending";
}

export interface ToolRequest {
    doc_id: string;
    ticketNo: string; // REQ-YYYYMMDD-###
    applicantUid: string;
    applicantName: string;
    department: string;
    toolName: string;
    category?: RequestCategory; // Optional for backward compatibility
    description: string;
    criteria: string;
    status: RequestStatus;
    adminNote?: string;
    managerApproval?: string;
    estimatedDate?: Timestamp | FieldValue;
    adminHandler?: {
        uid: string;
        displayName: string | null;
        photoURL: string | null;
    };
    managerResponder?: {
        uid: string;
        displayName: string | null;
        photoURL: string | null;
    };
    supervisorHandler?: {
        content: string;
        displayName: string | null;
        photoURL: string | null;
        uid: string;
        updatedAt: Timestamp | FieldValue;
    };
    createdAt: Timestamp | FieldValue;
    updatedAt: Timestamp | FieldValue;
}

export interface SystemConfig {
    doc_id: string; // 'system'
    logoUrl: string;
    updatedAt: Timestamp;
}

export interface AdminUser {
    uid: string;
    addedBy: string;
    addedAt: Timestamp;
}
