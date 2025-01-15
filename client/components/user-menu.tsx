'use client'

 
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuItem } from "./ui/dropdown-menu";
import { logoutUserAction } from "@/app/(user)/action";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { User } from "@/lib/types";
import { useEffect, useState } from "react";

type UserMenuProps = {
    user: User;
    avatar: string | null;
}


const UserMenu = ({user, avatar}: UserMenuProps) => {  

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [avatarImage, setAvatarImage] = useState<string | undefined>(undefined);

    const router = useRouter();

    useEffect(()=>{

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';  
      setAvatarImage(`${baseUrl}/uploads/${avatar}`);

    },[avatar]);

    const logout = async () => {
      await logoutUserAction(user.id);  //non gestisco i messaggi di logout
      
      router.refresh();
    };    

    const handleClose = () => {
      setIsOpen(false);
    };
       
 
    return (
      <div className="flex items-center gap-4">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger className=" select-none outline-none rounded-full data-[state=open]:ring-4 data-[state=open]:ring-blueShop">  
                <Avatar className="hover:ring-4 hover:ring-blueShop  ">
                  <AvatarImage 
                    src={avatarImage}
                  />
                  <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>{user.username}</DropdownMenuLabel>
                <DropdownMenuItem >
                  <Link className="w-full" href={'/private/profilo'} onClick={handleClose}>Profilo</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />                
                <DropdownMenuItem className="cursor-pointer" onClick={logout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        {user && <span className="font-medium md:hidden">{user.username}</span>}

      </div>)
}


export default UserMenu;
