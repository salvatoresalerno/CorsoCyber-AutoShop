'use client'

 
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuItem } from "./ui/dropdown-menu";
import { logoutUserAction } from "@/app/(user)/action";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { User } from "@/lib/types";
import { useState } from "react";

type UserMenuProps = {
    user: User;
}


const UserMenu = ({user}: UserMenuProps) => {
  /*
  da usare se non si usa il comp. Avatar. si chiama l'api route 'get-avatar' che recupera il blob dell'immagine 
  e lo passa al FileReader che lo rende disponibile come file immagine 
  const [avatarDataUrl, setAvatarDataUrl] = useState<string | null>(null);

   useEffect(()=> {
    const fetchAvatar = async () => {
      try {
        const response = await fetch('/api/get-avatar');
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setAvatarDataUrl(reader.result);
          }
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('Errore durante il fetch dell\'avatar:', error);
      }
    };
    fetchAvatar();
  },[]) */

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const router = useRouter();

    const logout = async () => {
      await logoutUserAction(user.id);  //non gestisco i messaggi di logout
      
      router.refresh();
    };    

    const handleClose = () => {
      setIsOpen(false);
    };
       
 
    return (<div className="flex items-center gap-4">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger className=" select-none outline-none rounded-full data-[state=open]:ring-4 data-[state=open]:ring-blueShop">                
                {/* {avatarDataUrl && (
                    <Image 
                    src={avatarDataUrl}
                    alt="Avatar generato"
                    width={50}
                    height={50}
                    priority 
                    />
                )} */}
                <Avatar className="hover:ring-4 hover:ring-blueShop  ">
                  <AvatarImage src="https://thispersondoesnotexist.com" />
                  <AvatarFallback>A</AvatarFallback>
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
