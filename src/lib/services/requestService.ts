import { db } from "../firebase";
import {
    collection,
    runTransaction,
    serverTimestamp,
    doc,
    query,
    orderBy,
    onSnapshot,
    updateDoc,
    deleteField
} from "firebase/firestore";
import { ToolRequest, RequestStatus, RequestCategory } from "../types";
import { saveUserDepartment } from "./userService";
import { cleanObject } from "../utils";

interface SubmitRequestParams {
    toolName: string;
    description: string;
    criteria: string;
    department: string;
    category?: RequestCategory;
    user: {
        uid: string;
        displayName: string | null;
        email: string | null;
    };
}

export async function createRequest(params: SubmitRequestParams): Promise<string> {
    const { toolName, description, criteria, department, category, user } = params;

    // 1. Save Department Preference
    await saveUserDepartment(user.uid, department);

    // 2. Transaction for Ticket ID
    return await runTransaction(db, async (transaction) => {
        // Generate shard key for today: requests_20260116
        const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // 20260116
        const counterRef = doc(db, "counters", `requests_${todayStr}`);

        // Read counter
        const counterSnap = await transaction.get(counterRef);
        let currentCount = 0;

        if (counterSnap.exists()) {
            currentCount = counterSnap.data().count || 0;
        }

        const nextCount = currentCount + 1;
        const ticketNo = `REQ-${todayStr}-${String(nextCount).padStart(3, "0")}`;

        // Create Request Document Reference
        const requestRef = doc(collection(db, "requests"));

        // Set Counter (inc)
        transaction.set(counterRef, { count: nextCount }, { merge: true });

        // Set Request
        const newRequest: Partial<ToolRequest> = {
            ticketNo,
            applicantUid: user.uid,
            applicantName: user.displayName || user.email || "Unknown",
            department,
            toolName,
            category: category || "other",
            description,
            criteria,
            status: "pending",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        transaction.set(requestRef, newRequest);

        return requestRef.id;
    });
}

export function subscribeToRequests(
    filterParams: { status?: RequestStatus; search?: string },
    callback: (requests: ToolRequest[]) => void
) {
    const q = query(
        collection(db, "requests"),
        orderBy("createdAt", "desc")
    );

    // Real-time listener
    return onSnapshot(q, (snapshot) => {
        let requests = snapshot.docs.map(d => ({ doc_id: d.id, ...d.data() } as ToolRequest));

        if (filterParams.status) {
            requests = requests.filter(r => r.status === filterParams.status);
        }

        if (filterParams.search) {
            const lower = filterParams.search.toLowerCase();
            requests = requests.filter(r =>
                r.toolName.toLowerCase().includes(lower) ||
                r.applicantName.toLowerCase().includes(lower) ||
                r.ticketNo.toLowerCase().includes(lower)
            );
        }

        callback(requests);
        // Callback for error?
    }, (error) => {
        console.error("Error subscribing to requests:", error);
    });
}

export async function updateRequestAdmin(
    docId: string,
    data: {
        status?: RequestStatus;
        adminNote?: string;
        managerApproval?: string;
        estimatedDate?: Date | null;
        category?: RequestCategory;
        adminHandler?: {
            uid: string;
            displayName: string | null;
            photoURL: string | null;
        } | null;
        managerResponder?: {
            uid: string;
            displayName: string | null;
            photoURL: string | null;
        } | null; // Allow null to clear
    }
) {
    const ref = doc(db, "requests", docId);
    await runTransaction(db, async (transaction) => {
        // If adminNote is explicitly cleared, clear adminHandler too
        let adminHandler = data.adminHandler;
        if (data.adminNote !== undefined && !data.adminNote.trim()) {
            adminHandler = deleteField() as any;
        }

        // Only update allowed fields, remove undefined
        const updates = cleanObject({
            ...data,
            adminHandler,
            updatedAt: serverTimestamp()
        });
        transaction.update(ref, updates);
    });
}

export async function updateRequestSupervisor(
    docId: string,
    supervisorData: {
        content: string;
        displayName: string | null;
        photoURL: string | null;
        uid: string;
    } | null
) {
    const ref = doc(db, "requests", docId);
    // If supervisorData is null or content is empty, clear the field
    if (!supervisorData || !supervisorData.content.trim()) {
        await updateDoc(ref, {
            supervisorHandler: deleteField(),
            updatedAt: serverTimestamp()
        });
        return;
    }

    await updateDoc(ref, {
        "supervisorHandler": {
            ...supervisorData,
            updatedAt: serverTimestamp()
        }
    });
}


export async function deleteRequest(docId: string) {
    const ref = doc(db, "requests", docId);
    await runTransaction(db, async (transaction) => {
        transaction.delete(ref);
    });
}
