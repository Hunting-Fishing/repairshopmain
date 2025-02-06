
import { createContext, useContext, ReactNode } from "react";
import { RoomType } from "../types";

interface ChatRoomFormState {
  name: string;
  setName: (value: string) => void;
  type: string;
  setType: (value: string) => void;
  roomType: RoomType;
  setRoomType: (value: RoomType) => void;
  description: string;
  setDescription: (value: string) => void;
  isPrivate: boolean;
  setIsPrivate: (value: boolean) => void;
  enableNotifications: boolean;
  setEnableNotifications: (value: boolean) => void;
  maxParticipants: string;
  setMaxParticipants: (value: string) => void;
  selectedStaffIds: string[];
  setSelectedStaffIds: (value: string[]) => void;
  workOrderId: string;
  setWorkOrderId: (value: string) => void;
  isLoading: boolean;
}

const ChatRoomFormContext = createContext<ChatRoomFormState | undefined>(undefined);

export function useChatRoomForm() {
  const context = useContext(ChatRoomFormContext);
  if (!context) {
    throw new Error("useChatRoomForm must be used within a ChatRoomFormProvider");
  }
  return context;
}

interface ChatRoomFormProviderProps {
  children: ReactNode;
  value: ChatRoomFormState;
}

export function ChatRoomFormProvider({ children, value }: ChatRoomFormProviderProps) {
  return (
    <ChatRoomFormContext.Provider value={value}>
      {children}
    </ChatRoomFormContext.Provider>
  );
}
