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
import { uploadImage, uploadImageWithData } from "@/app/(admin)/admin/action";
import Image from "next/image";
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
  image: z
    .instanceof(File, { message: 'Il file deve essere un\'immagine' })  
    .refine((file) => file.type.startsWith('image/'), {
      message: 'Il file deve essere un\'immagine',
    })
    .refine((file) => file.size <= 5 * 1024 * 1024, { // 5MB
      message: 'Il file deve essere più piccolo di 5MB',
    })
    .optional(),

  
});

export type AddFormInputs = z.infer<typeof addFormSchema>;


export const AddVeicoliForm = (/* {ruolo}: FormLoginProps */) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [preview, setPreview] = useState<string | undefined>(undefined);

  
  

  const {register, control,  handleSubmit, reset, formState: { errors }, watch } = useForm<AddFormInputs>({
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
      image: undefined
    }
  });  

  const selectedFile = watch("image");

  //creo array per anni da 1900 ad oggi:
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => 1900 + i); // Da 1900 all'anno corrente

 
  const ttt = watch("tipo");
   console.log('tipo: ', ttt)

  const onSubmit = async (formData: AddFormInputs) => {
     
    setLoading(true);

    const data = new FormData();
    data.append('tipo', formData.tipo);
    data.append('brand', formData.brand);
    data.append('model', formData.modello);
    data.append('alim', formData.alimentazione);
    data.append('anno', formData.anno);
    data.append('km', formData.km);
    data.append('prezzo', formData.prezzo);
    data.append('image', formData.image ? formData.image : '');  

    const { message, error} = await uploadImageWithData(data); 

       
      
    if (message) {
      //alert(message)
      setSuccessMessage(message);
    } else {
      // Gestisci l'errore
      //alert(`Errore durante l\'upload: ${error}`);
      setErrorMessage(error);
    }
    reset()
    setLoading(false);
    setTimeout(() => {  //--> dopo 5 sec. resetto error e succ e preview (aternativa al banner di notifica che scompare!)
      setErrorMessage("");   
      setSuccessMessage("")    
      setPreview(undefined);   
  }, 5000); 
  }

  const handlePreview = (file: File | undefined) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(undefined);
    }
  };

  

  return (<div className="flex flex-col sm:flex-row sm:justify-around"> 
    <form className="space-y-3 w-full h-full sm:w-1/2 lg:w-1/3 select-none" onSubmit={handleSubmit(onSubmit)}>

        <div className="relative w-full mb-4  ">
          <Controller
            name="tipo"
            control={control}
            render={({ field }) => (
              <RadioGroup key={field.value || 'reset'} className="flex gap-4 text-base md:justify-end lg:justify-start" value={field.value} onValueChange={field.onChange}>
                  <div className="flex items-center space-x-2">
                      <RadioGroupItem className="focus-visible:ring-0 focus:border-indigo-500" value={TipoVeicolo.AUTO} id="auto" />
                      <label htmlFor="auto">Auto</label>
                  </div>
                  <div className="flex items-center space-x-2">
                      <RadioGroupItem className="focus-visible:ring-0 focus:border-indigo-500" value={TipoVeicolo.MOTO} id="moto" />
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
                className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus-visible:ring-0 focus:border-indigo-500"
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
                className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus-visible:ring-0 focus:border-indigo-500"
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
                    <SelectTrigger className={cn("text-base md:text-sm border-gray-300 focus:outline-none focus:ring-0 focus:border-indigo-500"  , !field.value && "text-muted-foreground"  )} >
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
                    <SelectTrigger    className={cn("text-base md:text-sm border-gray-300 focus:outline-none focus:ring-0 focus:border-indigo-500", !field.value && "text-muted-foreground")}   >
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
                className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus-visible:ring-0   focus:border-indigo-500"
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
                 className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus-visible:ring-0  focus:border-indigo-500"
                placeholder="Inserisci prezzo"
                {...register("prezzo")}
            />
            <ErrorValidationComponent error={errors.prezzo?.message} />
          </div> 
        </div>
        <div className="relative mb-4 w-full items-center"  /* className="grid w-full lg:max-w-sm items-center gap-1.5"*/>
          <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
              Immagine
          </label>
          <div className="relative">
            <Controller
              name="image"
              control={control}              
              render={({ field }) => (<>
                <Input                 
                  type="file"
                  id="image"
                  accept=".jpeg,.jpg,.png,.webp"
                  className={cn("shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-indigo-500  hover:cursor-pointer", !selectedFile && "text-muted-foreground")}
                  onChange={(event) => {
                    field.onChange(event.target.files?.[0]);
                    handlePreview(event.target.files?.[0]);
                  }}                   
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <UploadIcon className={cn("h-5 w-5", !selectedFile && "text-muted-foreground")} />
                </div> 
              </>)}
            /> 
          </div>             
          <ErrorValidationComponent error={errors.image?.message} />  
        </div>

        <div className="flex items-center py-2 gap-2">
          <Button type="submit" className={`px-3 bg-orange-400 hover:bg-orange-400/80  ${Object.keys(errors).length > 0 ? 'cursor-not-allowed' : ''}`}>
            Aggiungi            
          </Button>  
          {loading && <Spinner />}   
          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
          {successMessage && <span className="text-green-500 text-balance mt-2 ">{successMessage}</span>}
        </div>    
    </form> 

    <div className="w-full sm:w-1/3  flex flex-col">
        <h3 className="font-medium text-center">Anteprima immagine...</h3>
        <div className="flex flex-1 justify-center items-center">
          {preview && <div className="relative w-64 h-64 sm:w-80 sm:h-80 border border-gray-300 rounded overflow-hidden">
            <Image
              src={preview}
              alt="Anteprima"             
              className="object-contain"
              fill
            />
          </div>}
        </div>
    </div>
  </div>)
}






