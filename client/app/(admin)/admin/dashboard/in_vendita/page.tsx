 
import { getVeicoliStato } from "@/app/action";
import AdminSearchBar from "@/components/admin-SearchBar";
import { FiltriProvider } from "@/components/context/filtriContext";
import VeicoliTable from "@/components/veicoliTable";
import { Stato } from "@/lib/types";

 



export default async function InVendita() {

 
  const { data } = await getVeicoliStato(Stato.VENDESI);   

   

   
    return (
      <div className="h-auto">
        <h1 className="text-3xl font-bold uppercase text-center my-4">Veicoli in vendita</h1>
        <FiltriProvider> 
            <AdminSearchBar veicoli={data ? data : []}/>
            <hr className="my-5"/>
            <VeicoliTable 
                className="px-10 pb-10"
                veicoli={data}
                stato={Stato.VENDESI}
            />

        </FiltriProvider>  
      </div>
    );
}