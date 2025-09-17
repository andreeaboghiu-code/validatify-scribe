import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  Shield,
  Settings,
  Sparkles,
  Bell,
  Database
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigation = [
  { title: "Overview", url: "/", icon: BarChart3 },
  { title: "Data Validation", url: "/validation", icon: Shield },
  { title: "Transformation Rules", url: "/transformation", icon: Settings },
  { title: "Generate Content", url: "/content", icon: Sparkles },
  { title: "Logs & Alerts", url: "/logs", icon: Bell },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  const getNavClassName = (url: string) => {
    const isActive = location.pathname === url;
    return isActive 
      ? "bg-primary text-primary-foreground font-medium" 
      : "hover:bg-accent hover:text-accent-foreground";
  };

  return (
    <Sidebar 
      className={collapsed ? "w-14" : "w-64"} 
      collapsible="icon"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            {!collapsed && <span>Data Pipeline</span>}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClassName(item.url)}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}