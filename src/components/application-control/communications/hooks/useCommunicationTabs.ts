
import { useState } from "react";
import { ChatRoom } from "../types";

export function useCommunicationTabs() {
  const [selectedRoomId, setSelectedRoomId] = useState<string>();
  const [showSettings, setShowSettings] = useState(false);

  return {
    selectedRoomId,
    setSelectedRoomId,
    showSettings,
    setShowSettings
  };
}
