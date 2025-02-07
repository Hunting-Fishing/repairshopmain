
import { SidebarHeader as Header } from "@/components/ui/sidebar";

interface SidebarHeaderProps {
  profile: {
    first_name?: string;
    last_name?: string;
    role?: string;
  } | null;
  isLoading: boolean;
}

export function SidebarHeader({ profile, isLoading }: SidebarHeaderProps) {
  const formatRole = (role: string) => {
    return role?.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Header className="h-[60px] px-6 flex flex-col justify-center border-b">
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
    </Header>
  );
}
