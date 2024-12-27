"use client";


import { Button } from "./ui/button";
import { Spinner } from "./spinner";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Alimentazione, Ruolo, TipoVeicolo } from "@/lib/types";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { Euro, UploadIcon } from "./icone_mie";
import { cn } from "@/lib/utils";
import { ErrorValidationComponent } from "./ErrorValidationComponent";
/* type FormLoginProps = {
  ruolo: string;
} */

/* const signinSchema = z.object({   //schema validazione campi form   
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

export type SigninFormInputs = z.infer<typeof signinSchema>;  */

const addFormSchema = z.object({   //schema validazione campi form   
  tipo: z
    .nativeEnum(TipoVeicolo)
    .optional()
    .refine((value) => value !== undefined, {
      message: "Il campo Tipo è obbligatorio.",
    }),
  brand: z
    .string()
    .trim()
    .nonempty("Il campo Brand è obbligatorio.")
    .max(20, { message: "Brand deve essere max 20 caratteri" }),
  modello: z
    .string()
    .trim()
    .nonempty("Il campo Modello è obbligatorio")
    .max(20, { message: "Modello deve essere max 20 caratteri" }),
  alimentazione: z    
    .nativeEnum(Alimentazione)
    .optional()    
    .refine((val) => val !== undefined, {
      message: "Il campo Alimentazione è obbligatorio",
    }),    
  anno: z
    .string()
    .nonempty("Il campo Anno è obbligatorio")
    .refine((val) => {
      const year = parseInt(val);
      return year >= 1900 && year <= new Date().getFullYear();
    }, { message: `L'Anno deve essere compreso tra 1900 e ${new Date().getFullYear()}` }),     
  km: z    
    .string()
    .nonempty("Il campo Km è obbligatorio")
    .refine((val) => {
      const km = parseInt(val);
      return km >= 0 && km <= 400000;
    }, { message: 'I Km devono essere compresi tra 0 e 400000' }), 
  prezzo: z    
  .string()
  .nonempty("Il campo Prezzo è obbligatorio")
  .refine((val) => {
    const km = parseInt(val);
    return km >= 0 && km <= 100000;
  }, { message: 'Il Prezzo deve essere compres0 tra 0 e 100000' }),
  

  
});

export type AddFormInputs = z.infer<typeof addFormSchema>;


export const AddVeicoliForm = (/* {ruolo}: FormLoginProps */) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  

    const {register, control,  handleSubmit, reset, formState: { errors } } = useForm<AddFormInputs>({
      resolver: zodResolver(addFormSchema),
      mode: "onChange",
      defaultValues: {
        tipo: undefined,
        brand: "",
        modello: "",
        alimentazione: undefined,
        anno: "",
        km: undefined,
        prezzo: undefined,        
      }
    });  

  //creo array per anni da 1900 ad oggi:
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => 1900 + i); // Da 1900 all'anno corrente



   

  const onSubmit = async (formData: AddFormInputs) => {
    setLoading(true);        
    setErrorMessage("");

    console.log('ricevuto: ',formData  )
    
  }

  return (
    <form className="space-y-3 w-1/3"    onSubmit={handleSubmit(onSubmit)}    >

        <div className="relative mb-4 w-1/2">
          <Controller
            name="tipo"
            control={control}
            render={({ field }) => (
              <RadioGroup className="flex gap-4 text-base md:justify-end lg:justify-start" value={field.value} onValueChange={field.onChange}>
                  <div className="flex items-center space-x-2">
                      <RadioGroupItem value={TipoVeicolo.AUTO} id="AUTO" />
                      <label htmlFor="auto">Auto</label>
                  </div>
                  <div className="flex items-center space-x-2">
                      <RadioGroupItem value={TipoVeicolo.MOTO} id="moto" />
                      <label htmlFor="moto">Moto</label>
                  </div>
              </RadioGroup> 
            )}
          />
          <ErrorValidationComponent error={errors.tipo?.message} />
        </div>
        <div className="flex gap-3 "> 
          <div className="relative mb-4 w-1/2">
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
                {...register("brand")}
            />
            <ErrorValidationComponent error={errors.brand?.message} />
          </div>
          <div className="relative mb-4 w-1/2">
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
                {...register("modello")}
            />
            <ErrorValidationComponent error={errors.modello?.message} />
          </div>
        </div>
        <div className="flex gap-3 ">
          <div className="mb-4 w-1/2">
            <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
                Alimentazione
            </label>
            <Controller
              name="alimentazione"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className={cn("text-base md:text-sm"  , !field.value && "text-muted-foreground"  )} >
                        <SelectValue placeholder="Alimentazione" /* className="placeholder:text-muted-foreground" */   />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Alimentazione</SelectLabel>
                            {Object.values(Alimentazione).map((alimentazione) => (
                                <SelectItem key={alimentazione} value={alimentazione}>
                                    {alimentazione}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
              )}
            />
            <ErrorValidationComponent error={errors.alimentazione?.message} />
          </div>
          <div className="relative mb-4 w-1/2">
            <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
                Anno Immatricolazione
            </label>
            <Controller
              name="anno"
              control={control}              
              render={({ field }) => (
                <Select  onValueChange={field.onChange} value={field.value} >
                    <SelectTrigger    className={cn("text-base md:text-sm", !field.value && "text-muted-foreground")}   >
                          <SelectValue placeholder="Anno Immatricolazione" /> 
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Anno Immatricolazione</SelectLabel>                        
                            {years.map((year) => (
                              <SelectItem key={year} value={year.toString()} className="placeholder:text-red-500">
                                {year}
                              </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
              )}
            />
            <ErrorValidationComponent error={errors.anno?.message} />
          </div>
        </div>
        <div className="flex gap-3 "> 
          <div className="relative mb-4 w-1/2">
            <label
                htmlFor="km"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
                Km
            </label>
            <Input
                type="number"
                id="km"
                className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Inserisci km"
                {...register("km")}
            />
            <ErrorValidationComponent error={errors.km?.message} />
          </div>
          <div className="relative mb-4 w-1/2">
            <label
                htmlFor="prezzo"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
                Prezzo €
            </label>
            <Input
                type="number"
                id="prezzo"
                className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Inserisci prezzo"
                {...register("prezzo")}
            />
            <ErrorValidationComponent error={errors.prezzo?.message} />
          </div> 
        </div>
        <div /* className="relative mb-4 w-1/2" */ className="grid w-full lg:max-w-sm items-center gap-1.5">
          <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
              Immagine
          </label>
          <Input
                type="file"
                id="image"
                className="w-full shadow-sm rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none focus:border-indigo-500  focus:ring-indigo-500 "
          
                //className="file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 flex-1"
                //className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                //placeholder="Seleziona un'immagine..."
                /* {...register("prezzo")} */
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <UploadIcon className="h-5 w-5 text-muted-foreground" />
            </div>
            {/* <ErrorValidationComponent error={errors.prezzo?.message} /> */}
        </div>

        <div className="flex items-center py-2 gap-2">
           <Button type="submit" className={`px-3 bg-orange-400 hover:bg-orange-400/80  ${Object.keys(errors).length > 0 ? 'cursor-not-allowed' : ''}`}>
            Login            
          </Button>  
          {loading && <Spinner />}   
          {errorMessage && <span className="text-red-500">{errorMessage}</span>} 
        </div>    
    </form> 
  )
}






/* import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function Component() {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="file-upload" className="flex items-center gap-2">
        <CloudUploadIcon className="h-5 w-5 text-muted-foreground" />
        <span>Drag and drop a file or click to browse</span>
      </Label>
      <div className="relative">
        <Input
          id="file-upload"
          type="file"
          className="w-full rounded-md border border-muted bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Drag and drop a file or click to browse"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <CloudUploadIcon className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
    </div>
  )
}

function CloudUploadIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M12 12v9" />
      <path d="m16 16-4-4-4 4" />
    </svg>
  )
} */
