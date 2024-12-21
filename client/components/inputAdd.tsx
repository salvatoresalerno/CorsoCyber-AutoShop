'use client'

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input"
import { NextResponse } from "next/server";
import { getBrand, getPippo, getPluto, pippo } from "@/app/(admin)/admin/action";

type InputAddprops = {
    placeholder?: string;
    route?: string;
    //action: ()=>Promise<Response>
}

//#F0C42F


//export default  function InputAdd({placeholder, onAction}: InputAddprops) {
const InputAdd =  ({placeholder, route, action}: InputAddprops) => {
    const [inputValue, setInputValue] = useState("");


    const [count, setCount] = useState();

    const handleClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

         //const result = await getPippo()
         const {data, error} = await getBrand()


         console.log('Risultato getPluto: ', data)


         //const {data, error} = await getPluto()
         //const result = await getPluto()
        //const pp = await resul
         //console.log('risposta nel CliComp: ', result)
         //const {data, error} = await getPluto()

        //setInputValue(result.data.length) 

        //console.log('premuto button')

//console.log('riss: ', res)

        //await action()
       //await getBrand() 
        /* try {
            const res = await fetch(`/api${route}`, {
                method: 'GET',
            });

            if (!res.ok) {
                throw new Error('Errore nella chiamata API');
            }

            const data = await res.json();
            console.log('Risposta da add: ----> ', data);
        } catch (err) {
            console.log(err instanceof Error ? err.message : 'Errore sconosciuto');
        } */
    };

    return (<>
        <div className=" border-red-500 border relative">
            <Input 
                className="border-lime-500 border  pr-12"
                type="text"
                placeholder={placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
            <Button 
                type="button"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 py-0.5 px-1 h-auto bg-[#F0C42F] hover:bg-[#F0C42F]/80 "
                onClick={handleClick}
            >
                add
            </Button>
        </div>
    </>)

}

export default InputAdd