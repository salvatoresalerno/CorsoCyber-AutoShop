

'use client'


import { FaPowerOff } from 'react-icons/fa';
import { SidebarMenuButton } from './ui/sidebar';
import { logoutAdminAction } from '@/app/(admin)/admin/action';

export default function SidebarLogoutButton() {
  
    const handleLogout = async () => {
    await logoutAdminAction();
  };  

  return (
    <SidebarMenuButton asChild >
        <div className="flex items-center justify-between px-5 hover:cursor-pointer"   onClick={handleLogout}  >
            LogOut
            <FaPowerOff />
        </div>    
    </SidebarMenuButton>
  )
}