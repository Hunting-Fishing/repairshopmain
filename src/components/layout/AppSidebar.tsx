
import { Car, ClipboardList, Home, Users, Settings2, UserCog, Package, MessageSquare } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const getBaseMenuItems = () => [
  { title: "Dashboard", icon: Home, path: "/" },
  { title: "Customers", icon: Users, path: "/customers" },
  { title: "Work Orders", icon: ClipboardList, path: "/work-orders" },
  { title: "Vehicles", icon: Car, path: "/vehicles" },
  { title: "Inventory", icon: Package, path: "/inventory" },
  { title: "Staff", icon: UserCog, path: "/staff" },
];

export function AppSidebar() {
  const [unreadCount, setUnreadCount] = useState(0);

  const { data: userProfile } = useQuery({
    queryKey: ['current-user-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name, role')
        .eq('id', user.id)
        .single();
        
      return profile;
    }
  });

  // Get menu items based on user role
  const menuItems = [
    ...getBaseMenuItems(),
    ...(userProfile?.role === 'owner' || userProfile?.role === 'management' 
      ? [{ title: "Application Control", icon: Settings2, path: "/application-control" }] 
      : [])
  ];

  useEffect(() => {
    // Subscribe to new messages
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
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Format the role for display
  const formatRole = (role: string) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Sidebar>
      <SidebarHeader className="h-[60px] px-6 flex flex-col justify-center border-b">
        <span className="font-bold text-lg">RepairShop Manager</span>
        {userProfile && (
          <span className="text-sm text-muted-foreground">
            Welcome! {userProfile.first_name} {userProfile.last_name} : {formatRole(userProfile.role)}
          </span>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.path} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Chat Button with Notification Badge */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/application-control/communications" 
                    className="flex items-center gap-3 relative"
                    onClick={() => setUnreadCount(0)}
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Chat</span>
                    {unreadCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -right-2 -top-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      >
                        {unreadCount}
                      </Badge>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
