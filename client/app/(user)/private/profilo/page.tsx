import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/types";
import { headers } from "next/headers";

 


export default async function ProfiloPage() {

   const currentHeaders = headers();
   const currentUserHeader = currentHeaders.get('X-Current-User');
   const currentUser = currentUserHeader ? JSON.parse(currentUserHeader) as User : null;


 
    return (
        <div className="container mx-auto p-10">
            <div className="flex justify-center">
                <Avatar className="w-28 h-28 ring-8 ring-[#f5f7f8] ">
                    <AvatarImage src="https://thispersondoesnotexist.com" />
                    <AvatarFallback>A</AvatarFallback>
                </Avatar>
            </div>
            <div className="bg-white  w-1/2 mx-auto rounded-xl -mt-12 pt-16 px-4 pb-4">
                <h2 className="text-3xl font-bold text-center">{currentUser?.username}</h2>
                <p className="text-xl font-medium">Ruolo utente: <span className="font-bold">{currentUser?.role}</span></p>                
                <p className="mt-10">{"... altri dati relativi all'utente ..."}</p>
                <div className="text-end">
                    <Button className="space-x-2 bg-orange-400 hover:bg-orange-400/80  ">
                        <span>Edit Profile</span>
                    </Button>   
                </div>
                
            </div>
            
        </div>
    )
}