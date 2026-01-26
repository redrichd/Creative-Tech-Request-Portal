import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

import { Timestamp } from "firebase/firestore";

// Helper to remove undefined keys
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cleanObject(obj: any) {
    return Object.fromEntries(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Object.entries(obj).filter(([_, v]) => v !== undefined)
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatFirestoreTimestamp(timestamp: any): string {
    if (!timestamp) return "";
    // Check if it has toDate method (Timestamp-like)
    if (typeof timestamp === 'object' && timestamp !== null && 'toDate' in timestamp && typeof timestamp.toDate === 'function') {
        return timestamp.toDate().toLocaleDateString();
    }
    // Handle Date object
    if (timestamp instanceof Date) {
        return timestamp.toLocaleDateString();
    }
    // Try explicit conversion
    try {
        return new Date(timestamp).toLocaleDateString();
    } catch {
        return "";
    }
}
