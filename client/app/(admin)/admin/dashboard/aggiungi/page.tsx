



import { AddVeicoliForm } from "@/components/form-add-veicoli";





export default async function AggiungiPage() {

   

    return (  

        <div className="h-auto px-2 py-2 md:px-6 md:py-4 lg:px-10 lg:py-5  xl:px-20 xl:py-10">    
            <h1 className="text-3xl font-bold uppercase text-center my-2 md:my-4">Aggiungi Veicolo</h1>             

            <AddVeicoliForm />

        </div> 
   )
}


//solo brand: SELECT DISTINCT brand FROM veicoli;
//modelliassociati ai brand: SELECT DISTINCT modello FROM veicoli WHERE brand = 'NomeDelBrand';
