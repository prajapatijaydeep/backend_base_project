import * as admin from "firebase-admin";

export const deleteFirebaseUser = async ({ userId }: { userId: string }) => {
  try {
    await admin.auth().deleteUser(userId);
  } catch (error) {
    throw error;
  }
};
