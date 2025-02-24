
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { type SidebarProps, type SidebarMenuButtonProps, type SidebarGroupProps } from "./types";
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

export function SidebarHeader({ 
  className, 
  ...props 
}: React.ComponentProps<"div">) {
  return (
    <div 
      className={cn("flex h-14 items-center px-4 border-b", className)} 
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
      className={cn("flex flex-1 flex-col gap-4 px-2 py-2", className)} 
      {...props} 
    />
  );
}

export function SidebarGroup({ 
  label,
  icon: Icon,
  className, 
  children,
  ...props 
}: SidebarGroupProps) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {(label || Icon) && (
        <div className="flex items-center gap-2 px-4 py-1">
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
          {label && (
            <span className="text-xs font-medium text-muted-foreground">
              {label}
            </span>
          )}
        </div>
      )}
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

export function SidebarMenuItem({ 
  className, 
  ...props 
}: React.ComponentProps<"li">) {
  return (
    <li
      className={cn("px-2", className)}
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

export function SidebarFooter({ 
  className, 
  ...props 
}: React.ComponentProps<"div">) {
  return (
    <div 
      className={cn("mt-auto px-4 py-4 border-t", className)} 
      {...props} 
    />
  );
}
