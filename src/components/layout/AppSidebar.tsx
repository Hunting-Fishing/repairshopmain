
import { Settings2 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { NavigationMenu } from "./sidebar/NavigationMenu";
import { MarketingCarousel } from "./sidebar/MarketingCarousel";
import { useProfile } from "@/hooks/useProfile";

export function AppSidebar() {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfile(user?.id);

  useEffect(() => {
    const channel = supabase
      .channel('chat_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
        },
        (payload) => {
          if (payload.new && payload.new.sender_id !== user?.id) {
            setUnreadCount(prev => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const additionalMenuItems = profile?.role === 'owner' || profile?.role === 'management' 
    ? [{ title: "Application Control", icon: Settings2, path: "/application-control" }] 
    : [];

  return (
    <Sidebar>
      <SidebarHeader profile={profile} isLoading={isLoading} />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <NavigationMenu 
              additionalItems={additionalMenuItems}
              unreadCount={unreadCount}
              onChatClick={() => setUnreadCount(0)}
            />
          </SidebarGroupContent>
        </SidebarGroup>
        <MarketingCarousel />
      </SidebarContent>
    </Sidebar>
  );
}

