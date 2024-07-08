import { firebaseApp } from './firebase';
import { getDatabase, ref, set, get, update, remove, push } from 'firebase/database';

const database = getDatabase(firebaseApp);

// Using set (overwrites data at the specified location)
export const createChat = async (uId: string, chatName: string, createdAt: string) => {
  const dbRef = ref(database, `Users/${uId}/Chats/${chatName}`);
  await set(dbRef, createdAt);
};

// Using push (generates a unique key for each new item)
/*const createItemWithPush = async (path: string, data: any) => {
  const dbRef = ref(database, path);
  const newItemRef = push(dbRef);
  await set(newItemRef, data);
};*/

export const getUser = async (uId: string): Promise<any> => {
  const dbRef = ref(database, `Users/${uId}`);
  const snapshot = await get(dbRef);
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    return null;
  }
};

export const getChat = async (uId: string, name: string): Promise<{ key: string | null; val: string | null }> => {
  const dbRef = ref(database, `Users/${uId}/Chats/${name}`);
  const snapshot = await get(dbRef);
  if (snapshot.exists()) {
    return { key: snapshot.key, val: snapshot.val() };
  } else {
    return { key: null, val: null };
  }
};

export const getChats = async (uId: string): Promise<Record<string, string> | null> => {
  const dbRef = ref(database, `Users/${uId}/Chats`);
  const snapshot = await get(dbRef);
  if (snapshot.exists()) {
    const data = snapshot.val();
    console.log(data);
    return data;
  } else {
    console.log('User does not have chats');
    return null;
  }
};

/*const updateItem = async (path: string, data: Partial<any>) => {
  const dbRef = ref(database, path);
  await update(dbRef, data);
};*/

const deleteChat = async (uId: string, chatName: string) => {
  const dbRef = ref(database, `Users/${uId}/Chats/${chatName}`);
  await remove(dbRef);
};

const deleteUser = async (uId: string) => {
  const dbRef = ref(database, `Users/${uId}`);
  await remove(dbRef);
};
