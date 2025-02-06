
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useMessageActions() {
  const [newMessage, setNewMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (e: React.FormEvent, roomId: string) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to send messages",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("chat_messages")
        .insert([
          {
            room_id: roomId,
            sender_id: user.id,
            content: newMessage,
            content_type: "text",
          },
        ]);

      if (error) throw error;
      setNewMessage("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, roomId: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to upload files",
          variant: "destructive",
        });
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${roomId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('chat-attachments')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('chat-attachments')
        .getPublicUrl(filePath);

      const { error: messageError } = await supabase
        .from("chat_messages")
        .insert([
          {
            room_id: roomId,
            sender_id: user.id,
            content: file.name,
            content_type: "file",
            metadata: { url: publicUrl, type: file.type },
          },
        ]);

      if (messageError) throw messageError;

      toast({
        title: "Success",
        description: "File uploaded successfully",
      });

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  return {
    newMessage,
    setNewMessage,
    isUploading,
    handleSendMessage,
    handleFileUpload
  };
}
