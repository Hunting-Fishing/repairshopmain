
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
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { NavigationMenu } from "./sidebar/NavigationMenu";
import { MarketingCarousel } from "./sidebar/MarketingCarousel";

export function AppSidebar() {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['current-user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, role')
        .eq('id', user.id)
        .single();
        
      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }
      
      return data;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

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
