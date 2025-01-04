



import { AddVeicoliForm } from "@/components/form-add-veicoli";
import { loadVeicoloById } from "../../../action";
import { z } from "zod";
import { redirect } from "next/navigation";


type PageProps = {
    params: {
      id?: string[];
    };
};

const uuidSchema = z.string().uuid().optional();


export default async function AggiungiPage({ params }: PageProps) {

    //const { id } = params;
    const id = params?.id?.[0] ?? undefined;

    const validateID = uuidSchema.safeParse(id);  //valido ID

    if (!validateID.success) {
        redirect('/admin/dashboard/in_vendita'); 
    }

    const { data, error } = id  ? await loadVeicoloById(id) : { data: null, error: null };

    if (JSON.stringify(data) === JSON.stringify({}) || error) {  //oggetto vuoto o ricevuti errori
        redirect('/admin/dashboard/in_vendita')
    } 

    

    
   

    return (  

        <div className="h-auto px-2 py-2 md:px-6 md:py-4 lg:px-10 lg:py-5  xl:px-20 xl:py-10">    
            <h1 className="text-3xl font-bold uppercase text-center my-2 md:my-4">{data ? "Modifica Veicolo" : "Aggiungi Veicolo"}</h1>             

            <AddVeicoliForm 
                data={data}
            />

        </div> 
   )
}


//solo brand: SELECT DISTINCT brand FROM veicoli;
//modelliassociati ai brand: SELECT DISTINCT modello FROM veicoli WHERE brand = 'NomeDelBrand';
