import { databaseAdmin } from '@/services/firebaseAdmin';
import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/services/auth';
import { beginThread } from '@/services/llm/thread';
import { checkSubscription, getCustomerIdFromUserId } from '@/services/stripeAdmin';

async function getChatName(userId: string) {
  const date = new Date();

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  let name = `${year}-${month}-${day}`;

  const chats: Record<string, string> = (await databaseAdmin.ref(`/Users/${userId}/Chats`).get()).val() ?? {};

  const chatNames = Object.values(chats);

  while (chatNames.includes(name)) {
    if (!name.includes('(')) name = name + ' (1)';
    else name = name.replace(/\((\d+)\)/, (_, n) => `(${parseInt(n) + 1})`);
  }

  return name;
}

export async function POST(req: NextRequest) {
  let formData: FormData | null = null;
  try {
    formData = await req.formData();
  } catch {}

  if (formData == null) return new NextResponse('Invalid body.', { status: 400 });

  const userId = await getUserIdFromRequest(req);

  if (userId == null) return new Response('Unauthorized', { status: 401 });

  let image: File | undefined;
  try {
    image = formData.get('image') as File | undefined;
  } catch (e) {
    return new NextResponse('File is too large', { status: 413 });
  }
  if (image == null) return new NextResponse('No files received.', { status: 400 });

  const prompt = (formData.get('prompt') as string | undefined) ?? '';

  const customerId = await getCustomerIdFromUserId(userId);
  const subscription = await checkSubscription(customerId);
  if (subscription == null) {
    const chatsSnapshot = await databaseAdmin.ref(`/Users/${userId}/Chats`).get();
    const chatIds = Object.keys((await chatsSnapshot.val()) ?? {});
    if (chatIds.length >= 3)
      return new NextResponse('You cannot have more than 3 chats without a subscription!', { status: 401 });
  }

  const threadId = await beginThread(image, prompt);

  const chatName = await getChatName(userId);

  databaseAdmin.ref(`/Users/${userId}/Chats/${threadId}`).set(chatName);

  return NextResponse.json({
    name: chatName,
    id: threadId
  });
}
