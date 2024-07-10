import { authAdmin } from './firebaseAdmin';

async function getUserIdFromRequest(request: Request) {
  const authHeader = request.headers.get('Authorization');
  const stringToken = (authHeader ?? '').split(' ')[1] ?? '';

  try {
    return (await authAdmin.verifyIdToken(stringToken, true)).uid;
  } catch {
    return null;
  }
}

export { getUserIdFromRequest };

