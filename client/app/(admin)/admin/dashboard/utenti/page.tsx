import ErrorComponent from "@/components/errorComponent";
import { loadUserList } from "../../action";
import UserTable from "@/components/userTable";
import { Ruolo, User } from "@/lib/types";
import { headers } from "next/headers";





export default async function GestioneUtenti() {

    //recupero User esistente in headers
    const currentHeaders = headers();
    const currentAdminHeader = currentHeaders.get('X-Current-User');
    const currentAdmin: User = currentAdminHeader ? JSON.parse(currentAdminHeader) : null;

    const { data, error } = await loadUserList();

    console.log('Lista Utenti: ', data)




    if (error) {
        return (<ErrorComponent/>);
    }

    return ( 
        <div className="h-auto">
            <h1 className="text-3xl font-bold uppercase text-center my-4">Gestione Utenti</h1>
            <hr className="my-5"/>
            <p className="px-10">Utenti Ruolo <span className="font-medium">ADMIN</span></p>
            <div>
                <UserTable
                    className="px-10 pb-10"
                    utenti={data}
                    ruolo={Ruolo.ADMIN}
                    currentAdminRole={currentAdmin.role}  //ruolo dell'utente connesso (ADMIN o SUPERADMIN)
                />
            </div>
            <hr className="my-5"/>
            <p className="px-10">Utenti Ruolo <span className="font-medium">USER</span></p>
            <div>
                <UserTable
                    className="px-10 pb-10"
                    utenti={data}
                    ruolo={Ruolo.USER}    
                    currentAdminRole={currentAdmin.role}  //ruolo dell'utente connesso (ADMIN o SUPERADMIN)                
                />
            </div>
        </div>
        
    )
}


/*
<button onClick={handleAddIntervento} className='flex items-center justify-center self-end w-8 h-8 p-2 rounded-full bg-[--ss--principal] hover:bg-[#00a1ff80]'>
                <span><LiaPlusSolid className='w-5 h-5'/></span>                  
              </button>
*/