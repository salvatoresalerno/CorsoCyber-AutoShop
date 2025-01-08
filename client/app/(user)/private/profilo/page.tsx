 
 
import { Profilo, User } from "@/lib/types";
import { headers } from "next/headers";
import { getProfilo } from "../../action";
import { ProfileComponent } from "@/components/profileComponent";
import { decodeEscapedHtml } from "@/lib/utils";
 


export default async function ProfiloPage() {

   const currentHeaders = headers();
   const currentUserHeader = currentHeaders.get('X-Current-User');
   const currentUser = currentUserHeader ? JSON.parse(currentUserHeader) as User : null;

//creare action per recuperare dati del profilo da username di current user.

const {data, error} = await getProfilo(currentUser?.username);
//let profiloDataEscaped: Profilo | null = null;

const profiloDataEscaped: Profilo | null = data ? 
  {
    id: data.id,
    email: data.email,
    username: data.username,
    nome: decodeEscapedHtml(data.nome),
    cognome: decodeEscapedHtml(data.cognome),
    via: decodeEscapedHtml(data.via),
    citta: decodeEscapedHtml(data.citta),
    cap: decodeEscapedHtml(data.cap),
    provincia: decodeEscapedHtml(data.provincia),
    telefono: decodeEscapedHtml(data.telefono),
    cellulare: decodeEscapedHtml(data.cellulare),  
    avatar: data.avatar  
} : null;

console.log('profilo, error: ', data, error)
 
    return (
        <div className="container  mx-auto  select-none font-openSans">
            {profiloDataEscaped && <ProfileComponent 
                profiloData={profiloDataEscaped}
            />}
            {/* <div className="w-1/3 bg-white p-4 rounded-xl">
                <h2 className="font-light mb-2">Il mio profilo</h2>
                <ProfileComponent />
            </div>
            <div className="w-1/3" >                
                <div className="relative bg-white  mx-auto rounded-xl pt-24 p-4">
                    <div className="absolute flex justify-center -top-[72px] left-1/2 transform -translate-x-1/2">
                        <Avatar className=" w-36 h-36 ring-8 ring-[#f5f7f8] ">
                            <AvatarImage src="https://thispersondoesnotexist.com" />
                            <AvatarFallback>A</AvatarFallback>
                        </Avatar>
                    </div>
                    <h2 className="text-3xl font-bold text-center">{currentUser?.username}</h2>
                    <p className="text-xl font-medium  text-center">{`${data?.nome} ${data?.cognome}`}</p>                
                    <p className="mt-10 text-xl font-normal text-center">{`${data?.via} - ${data?.cap} - ${data?.citta} (${data?.provincia})`}</p> 
                    <p className="mt-10 text-xl font-normal text-center">{`${data?.telefono} - ${data?.cellulare}`}</p> 

                    <div className="text-end mt-5">
                        <Button className="space-x-2 bg-orange-400 hover:bg-orange-400/80  ">
                            <span>Edit Profile</span>
                        </Button>   
                    </div>                
                </div>            
            </div> */}
        </div>
    )
}


/*

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
*/