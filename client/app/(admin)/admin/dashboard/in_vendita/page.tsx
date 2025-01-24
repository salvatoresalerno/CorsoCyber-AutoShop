 
import { getVeicoliStato } from "@/app/action";
import AdminSearchBar from "@/components/admin-SearchBar";
import { FiltriProvider } from "@/components/context/filtriContext";
import ErrorComponent from "@/components/errorComponent";
import VeicoliTable from "@/components/veicoliTable";
import { Stato, Veicolo } from "@/lib/types";
import { decodeEscapedHtml } from "@/lib/utils";


export default async function InVendita() {
 
  const { data, error } = await getVeicoliStato(Stato.VENDESI);   

  const veicoliDataEscaped: Veicolo[] | null = data ? 
  data.map((item) => ({
      id: item.id,  
      brand: decodeEscapedHtml(item.brand),
      modello: decodeEscapedHtml(item.modello),
      tipo: item.tipo,
      anno: item.anno,
      kilometri: item.kilometri,
      alimentazione: item.alimentazione,
      prezzo: item.prezzo,
      stato: item.stato,  
      image: decodeEscapedHtml(item.image ? item.image : '')  
    })) : null;

    if (error) {
      return (<ErrorComponent/>);
    }
   
    return (
      <div className="h-auto">
        <h1 className="text-3xl font-bold uppercase text-center my-4">Veicoli in vendita</h1>
        <FiltriProvider> 
            <AdminSearchBar veicoli={veicoliDataEscaped ? veicoliDataEscaped : []}/>
            <hr className="my-5"/>
            <VeicoliTable 
                className="px-10 pb-10 select-none"
                veicoli={veicoliDataEscaped}
                stato={Stato.VENDESI}
            />
        </FiltriProvider>  
      </div>
    );
}