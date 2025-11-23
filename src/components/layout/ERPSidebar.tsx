import { ChevronLeft, ChevronRight, Layers, Sprout, TestTube, Flame, Microscope, FlaskConical, TreePine, Droplets, MapPin, User } from "lucide-react";
import { Button } from "../ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface ERPSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function ERPSidebar({ isCollapsed, onToggle }: ERPSidebarProps) {
  const [indoorOpen, setIndoorOpen] = useState(true);
  const [outdoorOpen, setOutdoorOpen] = useState(true);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const indoorLinks = [
    { path: "/indoor/media-preparation", label: "Media Preparation", icon: FlaskConical },
    { path: "/indoor/subculturing", label: "Subculturing", icon: Microscope },
    { path: "/indoor/incubation", label: "Incubation", icon: Flame },
    { path: "/indoor/sampling", label: "Sampling", icon: TestTube },
  ];

  const outdoorLinks = [
    { path: "/outdoor/primary-hardening", label: "Primary Hardening", icon: Sprout },
    { path: "/outdoor/secondary-hardening", label: "Secondary Hardening", icon: TreePine },
    { path: "/outdoor/mortality", label: "Mortality", icon: Droplets },
    { path: "/outdoor/holding-area", label: "Holding Area", icon: MapPin },
    { path: "/outdoor/sampling", label: "Sampling", icon: TestTube },
  ];

  return (
    <aside className={`bg-white border-r border-border/50 flex flex-col transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"}`}>
      {/* Logo Section */}
      <div className="p-6 border-b border-border/50 flex items-center justify-between">
        {!isCollapsed && (
          <div>
            <h2 className="text-[#4CAF50] text-[18px] font-semibold">Seema Biotech</h2>
            <p className="text-[14px] text-[#717182]">ERP System</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="hover:bg-[#E8F5E9] hover:text-[#2E7D32]"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {/* Indoor Module */}
        <Collapsible open={indoorOpen} onOpenChange={setIndoorOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={`w-full justify-start hover:bg-[#E8F5E9] hover:text-[#2E7D32] ${isCollapsed ? "px-3" : ""}`}
            >
              <Layers className={`w-5 h-5 text-[#4CAF50] ${isCollapsed ? "" : "mr-3"}`} />
              {!isCollapsed && <span className="text-[15px]">Indoor Module</span>}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="ml-2 mt-1 space-y-1">
            {indoorLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.path} to={link.path}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${isActive(link.path) ? "bg-[#E8F5E9] text-[#2E7D32]" : "hover:bg-[#E8F5E9] hover:text-[#2E7D32]"} ${isCollapsed ? "px-3" : ""}`}
                  >
                    <Icon className={`w-4 h-4 ${isActive(link.path) ? "text-[#4CAF50]" : ""} ${isCollapsed ? "" : "mr-3"}`} />
                    {!isCollapsed && <span className="text-[15px]">{link.label}</span>}
                  </Button>
                </Link>
              );
            })}
          </CollapsibleContent>
        </Collapsible>

        {/* Outdoor Module */}
        <Collapsible open={outdoorOpen} onOpenChange={setOutdoorOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={`w-full justify-start hover:bg-[#E8F5E9] hover:text-[#2E7D32] ${isCollapsed ? "px-3" : ""}`}
            >
              <Sprout className={`w-5 h-5 text-[#4CAF50] ${isCollapsed ? "" : "mr-3"}`} />
              {!isCollapsed && <span className="text-[15px]">Outdoor Module</span>}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="ml-2 mt-1 space-y-1">
            {outdoorLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.path} to={link.path}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${isActive(link.path) ? "bg-[#E8F5E9] text-[#2E7D32]" : "hover:bg-[#E8F5E9] hover:text-[#2E7D32]"} ${isCollapsed ? "px-3" : ""}`}
                  >
                    <Icon className={`w-4 h-4 ${isActive(link.path) ? "text-[#4CAF50]" : ""} ${isCollapsed ? "" : "mr-3"}`} />
                    {!isCollapsed && <span className="text-[15px]">{link.label}</span>}
                  </Button>
                </Link>
              );
            })}
          </CollapsibleContent>
        </Collapsible>
      </nav>

      {/* User Profile */}
      {!isCollapsed && (
        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4CAF50] to-[#66BB6A] flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[15px] font-medium">Admin User</p>
              <p className="text-[13px] text-[#717182]">admin@seema.bio</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
