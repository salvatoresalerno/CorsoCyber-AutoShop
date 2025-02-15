
import { getVeicoliStato } from "@/app/action";
import AdminSearchBar from "@/components/admin-SearchBar";
import { FiltriProvider } from "@/components/context/filtriContext";
import ErrorComponent from "@/components/errorComponent";
import VeicoliTable from "@/components/veicoliTable";
import { Stato, Veicolo } from "@/lib/types";
import { decodeEscapedHtml } from "@/lib/utils";


export default async function InVendita() {
   
  const { data: veicoli, error } = await getVeicoliStato(Stato.VENDUTO);

  if (error) {
    return (<ErrorComponent/>);
  }

  const data: Veicolo[] | null = veicoli ? 
      veicoli.map((item) => ({
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

   
  return (
    <div className="h-auto">
      <h1 className="text-3xl font-bold uppercase text-center my-4">Veicoli venduti</h1>
      <FiltriProvider>
          <AdminSearchBar veicoli={data ? data : []}/>
          <hr className="my-5"/>
          <VeicoliTable 
              className="px-10 pb-10 select-none"
              veicoli={data}
              stato={Stato.VENDUTO}
          />
      </FiltriProvider>
    </div>
  );
}