"use client"

import { BadgeCheck, BarChart, BookOpenTextIcon, ChevronsUpDown, Home, List, LogOut, Search, Settings, Sparkles } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from 'better-auth/types';
import { redirect } from 'next/navigation';
import { authClient } from "@/lib/auth-client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const guestRoutes = [
  {
      href: "/user",
      label: "Dashboard",
      icon: Home,
  },
  {
      href: "/search",
      label: "Search",
      icon: Search,
  },
]
const teacherRoutes = [
  {
      href: "/teacher/courses",
      label: "Courses",
      icon: List,
  },
  {
      href: "/teacher/analytics",
      label: "Analytics",
      icon: BarChart,
  }
]

export function DashboardSidebar({
  user,
}: {
  user: User;
}) {

  const onLogout = () => {
    authClient.signOut();
    redirect("/login");
  }

  const pathname = usePathname();
  
  const isTeacherPage = pathname?.includes('/teacher');

  const Routes = isTeacherPage ? teacherRoutes : guestRoutes;

  const defaultPicUrl = "https://public.kelastech.com/default.png";

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          {/* TODO: Add logo */}
          <SidebarGroupLabel className="text-2xl font-bold">Kelas Tech</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {Routes.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild size={"lg"}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={user?.image || defaultPicUrl}
                      alt={user?.name}
                    />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {/* {capitalizeFirstLetter(user?.name)} */}
                    </span>
                    <span className="truncate text-xs">
                      {user?.email}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={user?.image || defaultPicUrl}
                        alt={user?.name}
                      />
                      <AvatarFallback className="rounded-lg">
                        CN
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      {/* <span className="truncate font-semibold">
                      </span> */}
                      <span className="truncate text-xs">
                        {user?.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Sparkles />
                    Upgrade to Pro
                  </DropdownMenuItem>
                    <Link href={isTeacherPage ? "/user" : "/teacher/courses"}>
                      <DropdownMenuItem >
                        <BookOpenTextIcon />
                        {isTeacherPage ? "Change To Student Mode" : "Change To Teacher Mode"}
                      </DropdownMenuItem>
                    </Link>

                </DropdownMenuGroup>
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => redirect("/settings")}>
                    <BadgeCheck />
                    Account
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
