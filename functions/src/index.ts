import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";

admin.initializeApp();

/**
 * 1. 自動同步：當 Auth 產生新用戶時，在 Firestore 建立對應的 users 文件
 * 觸發條件：Authentication 有新帳號加入
 */
export const syncUserToFirestore = functions.auth.user().onCreate(async (user: any) => {
    const db = admin.firestore();
    const userData = {
        uid: user.uid,
        email: user.email || "",
        // 如果 Google 帳號沒設名字，預設顯示「新用戶」，方便後續手動改名
        displayName: user.displayName || "新用戶",
        role: "users", // 預設角色統一為複數，與您目前的資料庫對齊
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    try {
        await db.collection("users").doc(user.uid).set(userData, { merge: true });
        console.log("新用戶同步成功:", user.uid);
    } catch (error) {
        console.error("新用戶同步失敗:", error);
    }
});

/**
 * 2. 姓名連動：當 users 集合中的 displayName 變更時，自動更新 requests 集合中的所有相關卡片
 * 觸發條件：Firestore users/{userId} 文件更新
 */
export const onUserDisplayNameUpdate = functions.firestore
    .document("users/{userId}")
    .onUpdate(async (change: any, context: any) => {
        const newValue = change.after.data();
        const previousValue = change.before.data();

        // 檢查名字是否有變更，避免無謂的 API 呼叫
        if (newValue.displayName !== previousValue.displayName) {
            const userId = context.params.userId;
            const db = admin.firestore();

            console.log(`偵測到姓名變更：${previousValue.displayName} -> ${newValue.displayName}`);

            // 根據您的資料結構，對應欄位為 applicantUid
            const requestsRef = db.collection("requests");
            const snapshot = await requestsRef.where("applicantUid", "==", userId).get();

            if (snapshot.empty) {
                console.log("該用戶目前沒有建立過任何需求單，無需更新。");
                return;
            }

            // 使用 Batch 批次更新，效率更高且節省寫入成本
            const batch = db.batch();
            snapshot.docs.forEach((doc) => {
                batch.update(doc.ref, {
                    applicantName: newValue.displayName // 更新為新的名字
                });
            });

            await batch.commit();
            console.log(`成功同步更新 ${snapshot.size} 筆需求單的申請人姓名。`);
        }
    });