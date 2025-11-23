import { Search, Bell, Settings } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function ERPHeader() {
  return (
    <header className="h-16 bg-white border-b border-border/50 px-6 flex items-center justify-between">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#717182]" />
          <Input
            type="search"
            placeholder="Search batches, samples, records..."
            className="pl-10 bg-[#F5F5F5] border-0 focus-visible:ring-1 focus-visible:ring-[#4CAF50]"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative hover:bg-[#F3FFF4]">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#d4183d] rounded-full" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-4">
              <h4 className="mb-3">Notifications</h4>
              <div className="space-y-3">
                <div className="p-3 bg-[#F3FFF4] rounded-lg">
                  <p className="text-sm">Batch B-2024-001 contamination detected</p>
                  <p className="text-xs text-[#717182] mt-1">2 hours ago</p>
                </div>
                <div className="p-3 bg-[#F3FFF4] rounded-lg">
                  <p className="text-sm">Incubation period completed for 5 batches</p>
                  <p className="text-xs text-[#717182] mt-1">5 hours ago</p>
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Settings */}
        <Button variant="ghost" size="sm" className="hover:bg-[#F3FFF4]">
          <Settings className="w-5 h-5" />
        </Button>

        {/* User Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="hover:bg-[#F3FFF4] gap-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-br from-[#4CAF50] to-[#66BB6A] text-white">
                  AD
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
