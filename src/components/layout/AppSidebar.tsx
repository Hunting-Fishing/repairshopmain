
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
import { useAuth } from "@/contexts/AuthContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const marketingItems = [
  {
    title: "NHTSA Integration",
    description: "Access vehicle data instantly",
    color: "bg-blue-500",
    path: "/application-control/integrations"
  },
  {
    title: "Amazon Associates",
    description: "Boost your parts revenue",
    color: "bg-orange-500",
    path: "/application-control/integrations"
  },
  {
    title: "Coming Soon",
    description: "New integrations monthly",
    color: "bg-purple-500",
    path: "/application-control/integrations"
  }
];

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
  const { user } = useAuth();

  // Profile query with proper caching configuration
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
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
  });

  // Real-time chat subscription
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

  // Format the role for display
  const formatRole = (role: string) => {
    return role?.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Get menu items based on user role - moved after profile query
  const menuItems = [
    ...getBaseMenuItems(),
    ...(profile?.role === 'owner' || profile?.role === 'management' 
      ? [{ title: "Application Control", icon: Settings2, path: "/application-control" }] 
      : [])
  ];

  return (
    <Sidebar>
      <SidebarHeader className="h-[60px] px-6 flex flex-col justify-center border-b">
        <span className="font-bold text-lg">RepairShop Manager</span>
        {isLoading ? (
          <span className="text-sm text-muted-foreground">Loading...</span>
        ) : profile ? (
          <span className="text-sm text-muted-foreground">
            Welcome! {profile.first_name} {profile.last_name}{' '}
            {profile.role && `: ${formatRole(profile.role)}`}
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">Welcome!</span>
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

        {/* Marketing Carousel */}
        <div className="mt-auto px-4 py-6">
          <Carousel className="w-full" opts={{ loop: true }}>
            <CarouselContent>
              {marketingItems.map((item, index) => (
                <CarouselItem key={index}>
                  <Link to={item.path}>
                    <Card className={`${item.color} text-white hover:opacity-90 transition-opacity`}>
                      <CardContent className="p-4">
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm opacity-90">{item.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="h-6 w-6" />
            <CarouselNext className="h-6 w-6" />
          </Carousel>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

