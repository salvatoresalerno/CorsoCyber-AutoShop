import { FilterParams } from "@/lib/types";
import { getFilteredVeicoli } from "@/app/(user)/action";
import ErrorComponent from "@/components/errorComponent";
import CardComponent_V2 from "@/components/cardComponent_V2";
import { headers } from "next/headers";





export default async function RisultatiPage({ params }: { params: { slug: string } }) {

    //recupero User eventualmente esistente in headers
    const currentHeaders = headers();
    const currentUserHeader = currentHeaders.get('X-Current-User');
    const currentUser = currentUserHeader ? JSON.parse(currentUserHeader) : null;
    
    console.log('utente in risultati: ', currentUser)
     
    let titolo: string = '';

    //NB questa pagina è normalmente pubblica, ma se loggato posso acquistare i veicoli, quindi saranno visibili i pulsanti 

    const filtri: FilterParams = JSON.parse(decodeURIComponent(params.slug));
 
    const {data, suggerito, error} = await getFilteredVeicoli(filtri);

    if (suggerito) {
        titolo = 'La tua ricerca non ha prodotto risultati, ecco dei suggerimenti per te...';
    } else {
        titolo = 'Risultato ricerca...'
    }

    if (error) {
        return (<ErrorComponent/>);
    }
     
    /* try {            
        filtro = JSON.parse(decodeURIComponent(params.slug));
        result = await filtraVeicoli(filtro)
        if (isVeicoliSuggeriti(result)) {
            result = result.veicoli
            titolo = 'La tua ricerca non ha prodotto risultati, ecco dei suggerimenti per te...'
        } else {
            titolo = 'Risultato ricerca...'
        }
        console.log('veicoli plus: ', result)
    } catch (err) {
        console.error('Errore nel parsing dei filtri:', err);
        return (<ErrorComponent/>);
    } */
   
    //result = []
   
    return ( 
         
            <div>
                <h2 className="text-2xl text-center font-semibold my-10">{titolo}</h2>
                <div className="bg-[#FFEFE5]">                    
                    <div className="container mx-auto p-5">
                        <h1 className="text-2xl text-left font-semibold my-5  pl-2">{`Hai cercato: ${filtri.brand} - ${filtri.model}`}</h1>
                        <div className="grid grid-cols-1 justify-items-center sm:grid-cols-2 xl:grid-cols-3 gap-4 p-2 sm:p-4">
                            {data && data.map((veicolo, index) => {
                                return ( 
                                    <CardComponent_V2
                                        key={index} 
                                        veicolo={veicolo}
                                        user={currentUser}
                                    />
                                )
                            })}                 
                        </div> 
                    </div> 
                </div>           
            </div> 
           
    )
}

