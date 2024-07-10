import { createContext } from 'react';

interface TransferredChat {
  id: string;
  imagePreviewUrl: string;
  prompt: string;
  response: string;
  isDone: boolean;
}

interface ToolData {
  isSidebarOpen: boolean;
  addChat: (chat: { id: string; name: string }) => void;
  setTransferredChat: (chat: TransferredChat) => void;
  transferredChat: TransferredChat | null;
}

const ToolDataContext = createContext<ToolData>(null as any);

export type { ToolData, TransferredChat };
export { ToolDataContext };

