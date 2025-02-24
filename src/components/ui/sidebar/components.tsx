
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { type SidebarProps, type SidebarMenuButtonProps } from "./types";
import { sidebarMenuButtonVariants } from "./variants";
import { useSidebar } from "./context";

export function Sidebar({ 
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}: SidebarProps) {
  const { state } = useSidebar();

  return (
    <div
      className={cn(
        "group peer hidden md:block text-sidebar-foreground",
        className
      )}
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      {...props}
    >
      {children}
    </div>
  );
}

export function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props}
    />
  );
}

export function SidebarMenuButton({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  isActive = false,
  tooltip,
  ...props
}: SidebarMenuButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export function SidebarHeader({ 
  className, 
  ...props 
}: React.ComponentProps<"div">) {
  return (
    <div 
      className={cn("flex h-14 items-center px-4", className)} 
      {...props} 
    />
  );
}

export function SidebarContent({ 
  className, 
  ...props 
}: React.ComponentProps<"div">) {
  return (
    <div 
      className={cn("flex flex-1 flex-col gap-4 px-2", className)} 
      {...props} 
    />
  );
}

export function SidebarFooter({ 
  className, 
  ...props 
}: React.ComponentProps<"div">) {
  return (
    <div 
      className={cn("mt-auto px-4 py-4", className)} 
      {...props} 
    />
  );
}
