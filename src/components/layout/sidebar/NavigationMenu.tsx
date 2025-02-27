
import { Link, useLocation } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { getBaseMenuItems } from "./constants";

interface NavigationMenuProps {
  additionalItems?: Array<{
    title: string;
    icon: React.ComponentType;
    path: string;
  }>;
  unreadCount: number;
  onChatClick: () => void;
}

export function NavigationMenu({ additionalItems = [], unreadCount, onChatClick }: NavigationMenuProps) {
  const menuItems = [...getBaseMenuItems(), ...additionalItems];
  const location = useLocation();

  return (
    <SidebarMenu>
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild isActive={location.pathname === item.path}>
            <Link to={item.path} className="flex items-center gap-3">
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}

      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={location.pathname.includes("/application-control/communications")}>
          <Link 
            to="/application-control/communications" 
            className="flex items-center gap-3 relative"
            onClick={onChatClick}
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
  );
}
