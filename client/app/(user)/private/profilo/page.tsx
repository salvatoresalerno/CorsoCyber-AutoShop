 
 
import { Profilo, User } from "@/lib/types";
import { headers } from "next/headers";
import { getProfilo } from "../../action";
import { ProfileComponent } from "@/components/profileComponent";
import { decodeEscapedHtml } from "@/lib/utils";
import ErrorComponent from "@/components/errorComponent";
 


export default async function ProfiloPage() {

   const currentHeaders = headers();
   const currentUserHeader = currentHeaders.get('X-Current-User');
   const currentUser = currentUserHeader ? JSON.parse(currentUserHeader) as User : null; 

    const {data, error} = await getProfilo(currentUser?.username);

    const profiloDataEscaped: Profilo | null = data ? 
    {
        id: data.id,
        email: data.email,
        username: data.username,
        nome: decodeEscapedHtml(data.nome ?? ''),
        cognome: decodeEscapedHtml(data.cognome  ?? ''),
        via: decodeEscapedHtml(data.via  ?? ''),
        citta: decodeEscapedHtml(data.citta  ?? ''),
        cap: decodeEscapedHtml(data.cap  ?? ''),
        provincia: decodeEscapedHtml(data.provincia  ?? ''),
        telefono: decodeEscapedHtml(data.telefono  ?? ''),
        cellulare: decodeEscapedHtml(data.cellulare  ?? ''),  
        image: data.image  
    } : null;

    if (error) {
        return (<ErrorComponent/>);
    }
 
    return (
        <div className="container  mx-auto  select-none font-openSans">
            {profiloDataEscaped && <ProfileComponent 
                profiloData={profiloDataEscaped}
            />}            
        </div>
    )
}


