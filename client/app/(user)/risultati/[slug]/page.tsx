import { FilterParams, VeicoliSuggeriti, VeicoloWithImg } from "@/lib/types";
import { filtraVeicoli, getCurrentUser, getFilteredVeicoli } from "@/app/(user)/action";
import { isVeicoliSuggeriti } from "@/lib/utils";
import ErrorComponent from "@/components/errorComponent";
import CardComponent_V2 from "@/components/cardComponent_V2";





export default async function RisultatiPage({ params }: { params: { slug: string } }) {

    
    //let filtro:FilterParams;
    //let result: VeicoloWithImg[] | VeicoliSuggeriti = [];
    let titolo: string = '';

    //NB questa pagina è normalmente pubblica, ma se loggato posso acquistare i veicoli, quindi saranno visibili i pulsanti 

    const filtri: FilterParams = JSON.parse(decodeURIComponent(params.slug));

    const { user } = await getCurrentUser(); //controllo esistenza user autenticato

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
                                        user={user}
                                    />
                                )
                            })}                 
                        </div> 
                    </div> 
                </div>           
            </div> 
           
    )
}

