'use client';

import { ToolData, ToolDataContext, TransferredChat } from './toolData';
import { HiOutlineChatBubbleBottomCenterText } from 'react-icons/hi2';
import { APIDeleteThread, APIListThreads } from '@/frontend-api/thread';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import MyNavbar from '@/components/myNavbar';
import Footer from '@/components/myFooter';
import { auth } from '@/services/firebase';
import Spinner from '@/components/ui/Spinner';
import { getAuth } from 'firebase/auth';

import { useLocalization } from '@/lang/language';
import { APIGetSubscriptionStatus } from '@/frontend-api/stripe';

const chatNameToNumber = (name: string) => {
  const [_, year, month, day, __, extra] = name.match(/(\d+)-(\d+)-(\d+)( \((\d+)\))?/)!;

  // prettier-ignore
  return (
    parseInt(year) * 1000 * 31 * 12 +
    parseInt(month) * 1000 * 31 +
    parseInt(day) * 1000 +
    parseInt(extra ?? '0')
  );
};

export default function Layout({ children }: React.PropsWithChildren) {
  const loc = useLocalization();

  const router = useRouter();
  const params = useParams();

  const [transferredChat, setTransferredChat] = useState<TransferredChat | null>(null);
  const [chats, setChats] = useState<Record<string, string>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pageSpinner, setPageSpinner] = useState(true);
  const [historySpinner, setHistorySpinner] = useState(true);
  const [deleteSpinners, setDelelteSpinners] = useState<string[]>([]);
  const [canDelete, setCanDelete] = useState<boolean>(false);

  const toolData = useMemo<ToolData>(
    () => ({
      addChat: ({ id, name }) =>
        setChats(chats => ({
          ...chats,
          [id]: name
        })),
      isSidebarOpen,
      setTransferredChat,
      transferredChat
    }),
    [isSidebarOpen, transferredChat]
  );

  useEffect(() => {
    setPageSpinner(true);
    auth
      .authStateReady()
      .then(async () => {
        if (auth.currentUser == null) {
          router.push('/sign-in');
          return;
        }
        setPageSpinner(false);

        setHistorySpinner(true);

        APIGetSubscriptionStatus(auth.currentUser!).then(x => {
          if (x == null) setCanDelete(false);
          else setCanDelete(true);
        });

        setChats(await APIListThreads(auth.currentUser));
        setHistorySpinner(false);
      })
      .catch(error => {
        router.back();
      });
  }, []);

  const chatNames = useMemo(
    () =>
      Object.entries(chats)
        .map(([id, name]) => [id, chatNameToNumber(name)] as const)
        .sort(([_, a], [__, b]) => b - a)
        .map(([id]) => id),
    [chats]
  );

  const onChatDeleate = async (chatId: string) => {
    setDelelteSpinners(deleteSpinners => [...deleteSpinners, chatId]);

    const user = getAuth().currentUser!;
    await APIDeleteThread(user, chatId);
    router.push('/tool');
    setChats(await APIListThreads(user));

    setDelelteSpinners(deleteSpinners => deleteSpinners.filter(id => id != chatId));
  };

  return (
    <>
      <MyNavbar />
      <div className='relative flex flex-col items-center justify-center h-1/2'>
        {pageSpinner ? (
          <div className='w-screen h-screen grid place-items-center'>
            <Spinner />
          </div>
        ) : (
          <>
            <div className='absolute top-4 left-4'>
              <button onClick={() => setIsSidebarOpen(true)} className='text-gray-700 focus:outline-none'>
                <HiOutlineChatBubbleBottomCenterText className='text-5xl text-[#c5ece0]' />
              </button>
            </div>
            <div className='flex w-full my-20'>
              <div
                className={`absolute top-0 left-0 h-full bg-gray-100 p-4 transition-transform transform border border-[#c5ece0] rounded-lg ${
                  isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } z-20`}
                style={{ width: '250px' }}
              >
                <button
                  className='absolute top-2 right-4 hover:bg-green-200 bg-[#c5ece0] text-black p-2 border-2 border-gray-400 rounded-lg'
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Close
                </button>
                <h2 className='text-xl font-semibold mb-4'>Chats</h2>

                {historySpinner ? (
                  <Spinner />
                ) : (
                  <>
                    <button
                      className='w-full mt-4 py-2 px-4 hover:bg-green-200 bg-[#c5ece0] text-black p-2 border-2 border-gray-400 rounded-lg'
                      onClick={() => router.push('/tool')}
                    >
                      New Chat
                    </button>
                    <ul>
                      {chatNames.map(chatId => (
                        <div key={chatId} className='flex justify-even border-2 border-gray-400 rounded-lg mt-4'>
                          <button
                            className={`${
                              canDelete ? 'w-8/12 mr-5' : 'w-full mr-1'
                            } my-1 ml-1 rounded-lg hover:bg-green-200 bg-gray-${
                              chatId === params.id ? 200 : 100
                            } text-black p-2 `}
                            onClick={() => router.push(`/tool/${chatId}`)}
                          >
                            {chats[chatId]}
                          </button>
                          {canDelete ? (
                            <>
                              {deleteSpinners.indexOf(chatId) != -1 ? (
                                <Spinner />
                              ) : (
                                <button
                                  className='w-3/12 my-1 mr-1 bg-red-500 rounded-lg'
                                  onClick={() => onChatDeleate(chatId)}
                                >
                                  Del
                                </button>
                              )}
                            </>
                          ) : (
                            <></>
                          )}
                        </div>
                      ))}
                    </ul>
                  </>
                )}
              </div>
              <ToolDataContext.Provider value={toolData}>{children}</ToolDataContext.Provider>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}

