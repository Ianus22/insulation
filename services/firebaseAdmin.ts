import admin from 'firebase-admin';
import 'server-only';

const firebaseAdmin =
  admin.apps.length > 0
    ? admin.apps[0]!
    : admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: (process.env.FIREBASE_PRIVATE_KEY as string).replaceAll('\\n', '\n')
        }),
        projectId: process.env.FIREBASE_PROJECT_ID,
        databaseURL: 'https://insulation-4b1dd-default-rtdb.europe-west1.firebasedatabase.app'
      });

const authAdmin = firebaseAdmin.auth();

const databaseAdmin = firebaseAdmin.database();

export { firebaseAdmin, authAdmin, databaseAdmin };

