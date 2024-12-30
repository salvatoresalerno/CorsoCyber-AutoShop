//'use client'

import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import InputAdd from "@/components/inputAdd";
import { getBrand, getBrandAndModel, pippo } from "../../action";
import { getCurrentUser } from "@/app/(user)/action";
import AutocompleteInput from "@/components/autocompleteInput";
import { AddVeicoliForm } from "@/components/form-add-veicoli";
import { Ruolo } from "@/lib/types";





export default async function AggiungiPage() {

    //const [selectedBrand, setSelectedBrand] = useState<string>("");
    //const brands = ['bmw', "citroen", 'audi', 'rover']


    //const {data, error} = await getBrand()
    const {data, error} = await getBrandAndModel()
    //console.log('data in page: ', data)
   // console.log('error in page: ', error)

   console.log('ricarico pagina')

    return ( <>

        <div className="h-auto px-20 py-10">    
            <h1 className="text-3xl font-bold uppercase text-center my-4">Veicoli in vendita</h1>
            {/* <AutocompleteInput 
                brand=""
            /> */}

            <AddVeicoliForm 
                //ruolo={Ruolo.ADMIN}
            />

        </div>




        {/* <InputAdd
            placeholder="Nuovo Brand"
            //route={'/getBrand'}
            //action={getBrand}
        />  */}
















       {/* <p>Aggiungi</p>
        <div className="w-1/5">
         <InputAdd
            placeholder="Nuovo Brand"
            //route={'/getBrand'}
            //action={getBrand}
        />   
         <Select onValueChange={setSelectedBrand} value={selectedBrand} defaultValue="">
            <SelectTrigger className="text-base">
                <SelectValue placeholder="Brand" />
            </SelectTrigger>
            <SelectContent sideOffset={15}>
                <SelectGroup>
                    <SelectLabel>Marca</SelectLabel>
                    {brands.map((brand)=>(
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))} 
                </SelectGroup>
            </SelectContent>
        </Select>   
        </div>*/}
        
    </>)
}


//solo brand: SELECT DISTINCT brand FROM veicoli;
//modelliassociati ai brand: SELECT DISTINCT modello FROM veicoli WHERE brand = 'NomeDelBrand';
