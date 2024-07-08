'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Markdown from 'react-markdown';
import Spinner from '@/components/ui/Spinner';
import MyNavbar from '@/components/myNavbar';
import Footer from '@/components/myFooter';
import { APICreateThread, APIRunThread } from '@/frontend-api/thread';
import { transcribeAudio } from '../api/whisperApi/whisper';
import { getAuth } from 'firebase/auth';
import { getUser, createChat, getChats } from '@/services/database';
import { FaMicrophone } from 'react-icons/fa';
import { HiOutlineChatBubbleBottomCenterText } from 'react-icons/hi2';

const ImageUploadComponent: React.FC = () => {
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isImageValid, setIsImageValid] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [response, setResponse] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [dragOver, setDragOver] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [oldChats, setOldChats] = useState<any[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [showOldChat, setShowOldChat] = useState(false);
  const selectorRef = useRef<HTMLInputElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const placeholder = '/images/placeholder.png';

  let isImageValidFlag = false;
  let textStart: string = '';

  useEffect(() => {
    if (image == null) {
      setImagePreviewUrl(null);
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(image);
    const onImageLoaded = () => setImagePreviewUrl(reader.result as string);
    reader.addEventListener('load', onImageLoaded, { once: true });
    setIsValidating(true);
    const timer = setTimeout(() => {
      setIsValidating(false);
      setIsImageValid(true);
      if (prompt == null || prompt.length == 0)
        setPrompt('What is the best way to insulate and fireproof the area shown in the image given above?');
    }, 500);

    return () => reader.removeEventListener('load', onImageLoaded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image]);

  useEffect(() => {
    const fetchChats = async () => {
      const currUser = getAuth().currentUser;
      if (currUser) {
        const chats = await getChats(currUser.uid);
        setOldChats(chats || []);
      }
    };
    fetchChats();
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImage(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreviewUrl(null);
    setIsImageValid(false);
    setIsValidating(false);
    setErrorMessage('');
  };

  const submit = async () => {
    if (!canClickButton || !image) return;
    setIsGenerating(true);
    setIsImageValid(false);
    setIsValidating(true);

    let threadId: string | null = null;
    const currUser = getAuth().currentUser;
    if (currUser == null) {
      threadId = await APICreateThread(image, prompt);
    } else {
      await getUser(currUser.uid).then(async user => {
        if (user != null) {
          console.log('TODO: Check for max chat capacity');
        }

        threadId = await APICreateThread(image, prompt);
        await createChat(currUser!.uid, threadId!);
      });
    }

    if (threadId == null) {
      setIsGenerating(false);
      return;
    }

    await APIRunThread(threadId, prompt, text => {
      if (textStart.length < 12) {
        textStart += text;
        if (textStart.length >= 12) {
          if (textStart.startsWith('Bad Request:')) {
            setIsImageValid(false);
            setIsValidating(false);
            isImageValidFlag = false;
          } else {
            setIsImageValid(true);
            setIsValidating(false);
            isImageValidFlag = true;
            setResponse(res => res + textStart);
          }
        }
      } else {
        if (isImageValidFlag) setResponse(res => res + text);
        else setErrorMessage(error => error + text);
      }
    });

    setIsGenerating(false);
  };

  const handleAudioStart = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Audio recording is not supported in your browser.');
      return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        audioChunksRef.current = [];
        try {
          setIsValidating(true);
          const transcribedText = await transcribeAudio(audioBlob);
          setPrompt(prev => `${prev} ${transcribedText}`);
          setIsValidating(false);
        } catch (error) {
          if (error instanceof Error) {
            setErrorMessage(error.message);
          } else {
            setErrorMessage('An unknown error occurred');
          }
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    });
  };

  const handleAudioStop = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleAudioButton = () => {
    if (isRecording) handleAudioStop();
    else handleAudioStart();
  };

  const loadChat = async (chatId: string) => {
    // Fetch and display the chat data using the chatId
  };

  const imageBorderColor = useMemo(() => {
    return dragOver
      ? 'border-blue-500'
      : imagePreviewUrl == null || isValidating
      ? 'border-gray-300'
      : isImageValid
      ? 'border-green-300'
      : 'border-red-300';
  }, [imagePreviewUrl, isImageValid, isValidating, dragOver]);

  const canClickButton = useMemo(
    () => image != null && !isGenerating && isImageValid,
    [image, isGenerating, isImageValid]
  );

  return (
    <>
      <MyNavbar />
      <div className='relative flex flex-col items-center justify-center h-1/2'>
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
            <h2 className='text-xl font-semibold mb-4'>Previous Chats</h2>
            <ul>
              {oldChats.map((chat, index) => (
                <li
                  key={index}
                  className={`mb-2 p-2 bg-white rounded shadow cursor-pointer ${
                    selectedChat?.id === chat.id ? 'bg-green-100' : ''
                  }`}
                >
                  <div
                    onClick={() => {
                      setSelectedChat(chat);
                      loadChat(chat.id);
                    }}
                  >
                    {chat.title}
                  </div>
                  <button
                    className='mt-2 py-1 px-3 bg-blue-500 text-white rounded hover:bg-blue-700'
                    onClick={() => loadChat(chat.id)}
                  >
                    Open Chat
                  </button>
                </li>
              ))}
            </ul>
            <button
              className='w-full mt-4 py-2 px-4 hover:bg-green-200 bg-[#c5ece0] text-black p-2 border-2 border-gray-400 rounded-lg'
              onClick={() => setShowOldChat(false)}
            >
              New Chat
            </button>
            <button
              className='w-full mt-4 py-2 px-4 hover:bg-green-200 bg-gray-200 text-black p-2 border-2 border-gray-400 rounded-lg'
              onClick={() => setShowOldChat(true)}
            >
              Old Chat1
            </button>
          </div>
          <div
            className={`flex flex-col items-center ${
              showOldChat
                ? `w-10/12 border border-gray-200 overflow-y-scroll h-[35rem] ${isSidebarOpen ? 'md:ml-64' : ''}`
                : 'w-11/12 max-w-2xl'
            } mx-auto p-8 rounded-lg shadow-md ml-auto  overflow-y-auto`}
          >
            {showOldChat ? (
              <>
                <div className='ml-auto md:ml-auto'>
                  <div className='flex flex-col space-y-4 items-end'>
                    <div className='relative'>
                      <Image
                        src={placeholder}
                        alt='placeholder'
                        width={180}
                        height={150}
                        className='rounded-lg shadow-lg border border-black w-24 md:w-52'
                      />
                    </div>
                    <div className='bg-[#c5ece0] p-2 md:p-4 rounded-md border border-black'>
                      <h1>Chat1-Prompt</h1>
                    </div>
                  </div>
                </div>
                <div className='mr-auto md:mr-auto flex-grow'>
                  <div className='bg-gray-200 p-2 md:p-4 rounded-md border border-black mb-5 mt-4'>
                    <h1>
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque corporis veniam sequi tenetur et
                      cupiditate officiis illo pariatur esse aperiam enim incidunt necessitatibus asperiores ut
                      obcaecati harum porro eius blanditiis, provident, omnis quod sunt accusamus. Rem sequi officia
                      nisi excepturi vero in tenetur amet pariatur corporis provident quasi natus dolore enim
                      voluptatibus reiciendis temporibus dolorem beatae eveniet ad, aliquid facere laborum maiores ullam
                      voluptatum? Quia debitis laboriosam distinctio rerum in error est, aspernatur, omnis quae
                      repudiandae quas, aut iste sed dolorum eos cupiditate dignissimos aliquam sit a! Praesentium
                      cumque quidem odit, vitae unde magnam accusantium vel, cum non id doloribus. Lorem ipsum dolor sit
                      amet consectetur adipisicing elit. Iure natus deleniti dolores repellendus fugiat deserunt, ad
                      quibusdam eos praesentium inventore iusto exercitationem! Enim corrupti mollitia quas ipsam
                      consectetur dignissimos amet praesentium ex. Placeat pariatur iure ratione explicabo ullam maxime
                      molestiae dolores. Itaque a corporis provident tenetur incidunt fugit earum ipsum, cumque ad
                      expedita asperiores quisquam modi voluptatibus fuga nihil. Sunt provident eos, iusto cupiditate
                      suscipit cumque deserunt delectus veniam voluptate tempore ab eius quasi molestiae sed vitae
                      aliquam dolores modi quisquam in praesentium nam voluptatem amet. Deserunt asperiores placeat iure
                      provident amet magnam officia, rerum ipsum possimus iusto animi voluptates distinctio inventore
                      explicabo ab accusantium ex! Architecto inventore quis dolores culpa aperiam delectus enim
                      cupiditate fugiat quia reprehenderit ut perferendis totam, quisquam, eos nesciunt, a tempore!
                      Facere maxime dolor amet quisquam obcaecati aperiam sint corporis mollitia, quia dolore provident
                      corrupti nobis, vero cupiditate et quas possimus laborum. Nisi ea molestiae praesentium et
                      quibusdam, repellat consectetur assumenda maxime minus dolor quasi sapiente esse eveniet odit
                      soluta commodi vitae qui laborum dolores voluptatibus ab atque suscipit iste similique. Saepe vero
                      nihil illo ea tempora quae nostrum, quis quibusdam dolorem voluptatum doloribus quam quidem
                      consequuntur consequatur modi eligendi molestias porro exercitationem minima cum facilis ab harum.
                      Libero, totam delectus? Recusandae soluta explicabo error, esse qui officiis harum molestias
                      beatae vitae itaque facilis consequuntur obcaecati provident dignissimos autem fuga minima porro
                      illum exercitationem eligendi aspernatur nobis velit vel ullam. Doloremque, necessitatibus,
                      voluptates minima delectus aliquam tempore laudantium magni eum magnam possimus iusto impedit
                      architecto esse placeat distinctio enim, rem laboriosam reiciendis? Dolorem, eius sed aliquam
                      aperiam, alias necessitatibus hic, sint nihil optio ad expedita eligendi quam odit? Fugit
                      perferendis adipisci natus pariatur illo consequatur aliquam corrupti excepturi dolorum ipsam
                      quibusdam repellat animi, amet consectetur quia, suscipit architecto facilis temporibus ducimus
                      commodi aut quis ad aliquid. Asperiores aliquid eaque deleniti doloribus in nemo omnis odit
                      quisquam facere veniam fugiat saepe mollitia, numquam deserunt quibusdam exercitationem, quis sit,
                      officia accusantium et magnam esse non id? Quas modi fugiat qui repudiandae, consequatur
                      necessitatibus excepturi nulla labore in maxime a accusamus asperiores eveniet numquam
                      perspiciatis reprehenderit deleniti provident, ipsa nostrum! Architecto vitae pariatur sint facere
                      neque ad facilis nemo autem reiciendis quis eius minima inventore exercitationem totam atque ipsum
                      molestias magni, enim qui quisquam eligendi possimus deleniti repellat vel? Enim delectus cumque
                      pariatur ducimus sed, nihil molestiae obcaecati omnis dolor. Neque alias modi eos! Quas velit
                      minus placeat ullam nam iusto quisquam, reiciendis quia inventore sint maxime sapiente temporibus
                      corrupti. Quae, sequi? Libero excepturi explicabo repellat consequuntur esse sit, doloremque
                      corporis, ducimus qui illum culpa enim! Deserunt distinctio eligendi voluptatibus aperiam
                      reiciendis nobis aspernatur ea iste possimus, fuga in, consectetur corporis illum quidem
                      voluptatum dicta nam accusantium asperiores exercitationem? Nobis voluptate accusantium maxime,
                      numquam quod vero expedita distinctio excepturi at est delectus eius voluptatibus voluptates
                      corrupti. Accusamus dignissimos quisquam temporibus! Eligendi, nisi adipisci esse nesciunt
                      voluptatum, magnam autem quae est harum, accusantium architecto iure ratione repellendus
                      temporibus earum tempora eos reiciendis exercitationem a voluptate enim necessitatibus?
                      Necessitatibus cum dolores molestias accusamus in, impedit dolore assumenda eos sit! Repudiandae,
                      doloribus amet voluptate nisi voluptas inventore sint delectus dolorum optio voluptatum distinctio
                      ipsa officiis a magni iste quos, nihil sapiente laudantium? Possimus fugit a, deleniti beatae
                      quisquam ex consequatur provident eveniet maxime? Et, delectus iusto cupiditate quasi sint
                      dolorum. Quasi, repudiandae at ut quod consectetur maxime mollitia quae, ullam labore distinctio
                      reiciendis tempora praesentium dolor corporis ducimus, cumque vel aut nihil! Harum itaque ut porro
                      provident. Sit, minima recusandae laborum fugit magni nisi voluptates reiciendis quidem
                      repudiandae delectus sunt id, nihil porro nam ratione! Accusamus, asperiores. Similique debitis
                      architecto ullam necessitatibus maiores, libero, deleniti quasi perferendis distinctio mollitia
                      cumque. Id enim quia ratione autem sapiente dolores iste vero minima libero blanditiis est
                      praesentium neque molestias, sequi nobis ullam labore nesciunt consequatur et beatae aliquam magni
                      culpa? Deleniti laboriosam possimus ad nihil harum cum ratione praesentium vitae minus tempore
                      inventore fugiat deserunt magnam vero obcaecati excepturi illum, animi voluptatum ullam
                      repellendus impedit provident! Atque tenetur ea porro voluptate. Cumque similique eius
                      voluptatibus quas nisi omnis atque consectetur possimus laborum, ipsa fuga, quibusdam unde?
                      Tenetur sapiente totam aperiam sunt facere exercitationem nulla adipisci expedita, hic amet, culpa
                      eaque mollitia cupiditate dignissimos velit incidunt ipsum aliquam, soluta vitae ad magnam
                      facilis. Nam facere, perspiciatis dolore aliquam non explicabo, quo omnis distinctio quaerat
                      eveniet quasi tenetur expedita aliquid temporibus unde eius sit, eos nemo. Deleniti ducimus rerum
                      et dolorum minima. Odit, consequuntur quidem esse cupiditate magnam enim eligendi reprehenderit,
                      fuga quia corporis sint. Minus explicabo voluptatem consequatur, dolores error ab odio vero. Quas
                      quibusdam deserunt voluptatum, dolorem cum voluptatibus reiciendis excepturi suscipit quo hic!
                      Distinctio repellendus perferendis maiores veniam inventore repellat illum totam nobis fugit
                      consequatur architecto obcaecati exercitationem quos beatae, repudiandae itaque eos, cupiditate
                      facilis explicabo doloremque ipsum blanditiis. Dolores possimus a eos, fugit, distinctio
                      repudiandae earum dicta aspernatur eius provident nobis autem sit molestiae ullam recusandae iusto
                      cumque. Totam suscipit reprehenderit qui blanditiis! Suscipit dolorem nihil, id accusantium
                      deserunt architecto dolor voluptate magnam quasi, illo repellat pariatur aliquam, deleniti
                      recusandae cumque itaque dolorum laboriosam. Culpa architecto quam quasi. Consequatur harum facere
                      sed? Inventore, officia sed labore soluta corrupti fugit tenetur, ipsum earum repudiandae saepe
                      iure voluptatem, dolorum consectetur dicta nisi. Inventore cupiditate dolorum eos dolor et quis
                      nostrum eaque, quisquam harum doloribus. Tempore, cupiditate quas corrupti qui et culpa id,
                      pariatur ea voluptate magni perspiciatis neque officia assumenda animi, dolores velit amet
                      quisquam laborum suscipit eos quidem necessitatibus ad. Cum voluptatum ab, atque alias deleniti
                      similique perferendis officia libero impedit voluptatibus, ut, laboriosam iure nemo! Ab, neque.
                      Rerum et cum, repellendus illum ipsa atque error. Nihil fuga, aliquam fugiat expedita tempore
                      eligendi at, consequuntur architecto officiis dolorum vel, aliquid ducimus nesciunt repudiandae.
                      Alias illum eius consequuntur corrupti reprehenderit, assumenda pariatur minima doloremque
                      deleniti repellat eligendi quis? Cumque vero, repellendus ea, expedita atque in enim minima, nihil
                      eum iure quia voluptatem sed odio nostrum quam dicta sint. Minus reprehenderit itaque molestiae
                      perspiciatis repellat mollitia vero impedit totam libero. Iusto error expedita culpa inventore?
                    </h1>
                  </div>
                </div>
                <div className='flex mt-auto space-x-2 w-full items-end'>
                  <input
                    type='text'
                    placeholder='Type your message here...'
                    className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none'
                  />
                  <button
                    className='py-2 px-4 bg-[#c5ece0] rounded-lg hover:bg-green-200 text-black'
                    onClick={() => console.log('Submit message')}
                  >
                    Send
                  </button>
                </div>
              </>
            ) : (
              <>
                <input
                  type='file'
                  accept='image/png, image/jpeg'
                  ref={selectorRef}
                  onChange={e => setImage(e.target.files![0])}
                  className='hidden'
                />
                <div
                  className={`w-full p-8 mb-8 border-2 border-dashed ${imageBorderColor} rounded-lg bg-gray-50 flex flex-col items-center justify-center cursor-pointer`}
                  onClick={() => selectorRef.current!.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {imagePreviewUrl == null ? (
                    <Image src='/images/downloadSign.png' alt='download' height={120} width={120} />
                  ) : (
                    <Image src={imagePreviewUrl} alt='Uploaded Image' height={120} width={120} />
                  )}
                  <p className='text-gray-400 mt-4'>Drag and drop or click here to upload image</p>
                  {errorMessage && <div className='mt-4 p-3 bg-red-100 text-red-600 rounded'>{errorMessage}</div>}
                  {image && (
                    <button
                      className='mt-4 py-2 px-4 bg-red-500 text-white rounded hover:bg-red-700'
                      onClick={removeImage}
                    >
                      Remove Image
                    </button>
                  )}
                </div>
                <div className='w-full relative mb-8'>
                  <textarea
                    placeholder='Additional prompt'
                    className='w-full p-4 border border-gray-300 rounded-lg focus:outline-none pr-10'
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                  />
                  <FaMicrophone
                    className='absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer'
                    size={32}
                    onClick={handleAudioButton}
                    style={{ color: isRecording ? '#f01e2c' : '#C5ECE0' }}
                  />
                  {isValidating && (
                    <div className='absolute inset-0 flex items-center justify-center bg-white bg-opacity-75'>
                      <Spinner />
                    </div>
                  )}
                </div>
                <button
                  className={`w-full py-3 mb-8 bg-[#C5ECE0] text-black rounded-lg${
                    canClickButton ? ' hover:bg-green-200 cursor-pointer' : ' hover:bg-[#C5ECE0] cursor-default'
                  }`}
                  onClick={submit}
                >
                  Submit
                </button>
                <div className='w-full p-6 border border-gray-300 rounded-lg bg-gray-50'>
                  <h2 className='text-black text-lg font-semibold mb-4'>Result</h2>
                  <div className='w-full p-4 border border-gray-300 rounded-lg bg-white'>
                    <Markdown className='text-gray-400'>{response === '' ? 'Returned result' : response}</Markdown>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ImageUploadComponent;
