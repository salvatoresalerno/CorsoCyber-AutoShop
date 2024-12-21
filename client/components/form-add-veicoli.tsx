"use client";


import { Button } from "./ui/button";
import { Spinner } from "./spinner";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Alimentazione, Ruolo, TipoVeicolo } from "@/lib/types";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { Euro } from "./icone_mie";

/* type FormLoginProps = {
  ruolo: string;
} */

const signinSchema = z.object({   //schema validazione campi form   
  email: z.string()
    .trim()
    .email("Formato email non valido.")
    .max(255, {message: "la mail deve essere massimo 255 caratteri"}), 
  password: z
    .string()
    .trim()
    .min(8, "La password deve essere minimo 8 caratteri")
    .regex(/[A-Z]/, "La password deve contenere almeno una lettera maiuscola")
    .regex(/\d/, "La password deve contenere almeno un numero")
    .regex(/[$!%&=[\]#\-.\(\)]/, "La password deve contenere almeno un carattere speciale tra !$%&=[]#-.( )"),  
});

export type SigninFormInputs = z.infer<typeof signinSchema>; 


export const AddVeicoliForm = (/* {ruolo}: FormLoginProps */) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  /* const {register, handleSubmit, reset, formState: { errors } } = useForm<SigninFormInputs>({
    resolver: zodResolver(signinSchema),
    mode: "onChange",
  }); */

  //creo array per anni da 1900 ad oggi:
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => 1900 + i); // Da 1900 all'anno corrente



   

  const onSubmit = async (formData: SigninFormInputs) => {
    setLoading(true);        
    setErrorMessage("");

    
    
  }

  return (
    <form className="space-y-3 w-1/3"  /* onSubmit={handleSubmit(onSubmit)} */  >

        <div className="mb-4 w-1/2">
          <RadioGroup className="flex gap-4 text-base md:justify-end lg:justify-start"  /* value={selectedTipo} onValueChange={onSelectedTipo} */>
              <div className="flex items-center space-x-2">
                  <RadioGroupItem value={TipoVeicolo.AUTO} id="AUTO" />
                  <label htmlFor="auto">Auto</label>
              </div>
              <div className="flex items-center space-x-2">
                  <RadioGroupItem value={TipoVeicolo.MOTO} id="moto" />
                  <label htmlFor="moto">Moto</label>
              </div>
          </RadioGroup> 
        </div>
        <div className="flex gap-3 "> 
          <div className="mb-4 w-1/2">
            <label
                htmlFor="brand"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
                Brand
            </label>
            <Input
                type="text"
                id="brand"
                className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Inserisci Brand"
                //{...register("brand")}
            />
          </div>
          <div className="mb-4 w-1/2">
            <label
                htmlFor="modello"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
                Modello
            </label>
            <Input
                type="text"
                id="modello"
                className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Inserisci Modello"
                //{...register("modello")}
            />
          </div>
        </div>
        <div className="flex gap-3 ">
          <div className="mb-4 w-1/2">
            <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
                Alimentazione
            </label>
            <Select /* onValueChange={setSelectedAlimentazione} defaultValue=""  value={selectedAlimentazione} */>
                <SelectTrigger className="text-base">
                    <SelectValue placeholder="Alimentazione" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Alimentazione</SelectLabel>
                        <SelectItem value={'tutti'}>{'-- TUTTI --'}</SelectItem>
                        {Object.values(Alimentazione).map((alimentazione) => (
                            <SelectItem key={alimentazione} value={alimentazione}>
                                {alimentazione}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
          </div>
          <div className="mb-4 w-1/2">
            <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
                Anno Immatricolazione
            </label>
            <Select /* onValueChange={setSelectedAlimentazione} defaultValue=""  value={selectedAlimentazione} */>
                <SelectTrigger className="text-base">
                    <SelectValue placeholder="Anno Immatricolazione" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Anno Immatricolazione</SelectLabel>
                        <SelectItem value={'tutti'}>{'-- TUTTI --'}</SelectItem>
                        {/*Object.values(Alimentazione).map((alimentazione) => (
                            <SelectItem key={alimentazione} value={alimentazione}>
                                {alimentazione}
                            </SelectItem>
                        ))*/}
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-3 "> 
          <div className="mb-4 w-1/2">
            <label
                htmlFor="km"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
                Km
            </label>
            <Input
                type="text"
                id="km"
                className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Inserisci km"
                //{...register("km")}
            />
          </div>
          <div className="mb-4 w-1/2">
            <label
                htmlFor="prezzo"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
                Prezzo €
            </label>
            <Input
                type="text"
                id="prezzo"
                className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Inserisci prezzo"
                //{...register("prezzo")}
            />
          </div> 
        </div>


        
        <div className="flex items-center py-2 gap-2">
          {/* <Button type="submit" className={`px-3 bg-orange-400 hover:bg-orange-400/80  ${Object.keys(errors).length > 0 ? 'cursor-not-allowed' : ''}`}>
            Login            
          </Button> */}
          {loading && <Spinner />}   
          {errorMessage && <span className="text-red-500">{errorMessage}</span>} 
        </div>    
    </form> 
  )
}
