"use client";


import { Button } from "./ui/button";
import { Spinner } from "./spinner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Profilo } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { CiEdit } from "react-icons/ci";
import { useRef } from "react";
import { ErrorValidationComponent } from "./ErrorValidationComponent";
import { setProfilo } from "@/app/(user)/action";
import { decodeEscapedHtml } from "@/lib/utils";

type ProfileComponentProps = {
  profiloData: Profilo;
}

const profileSchema = z.object({   //schema validazione campi form   
  id: z
    .string()
    .uuid(),
  cognome: z
    .string()
    .trim()
    .max(50, { message: "Cognome deve essere max 50 caratteri" }),
  nome: z
    .string()
    .trim()
    .max(50, { message: "Nome deve essere max 50 caratteri" }),
  cellulare: z
    .string()
    .trim() 
    .refine(val => val === "" || /^\d{1,3}(\/?\d{1,11})?$/.test(val), {
      message: "Il numero deve contenere al massimo un '/' come separatore e deve avere da 10 a 14 cifre",
    }),
  telefono: z
    .string()
    .trim()
    .refine(val => val === "" || /^\d{1,3}(\/?\d{1,11})?$/.test(val), {
      message: "Il numero deve contenere al massimo un '/' come separatore e deve avere da 10 a 14 cifre",
    }),
  citta: z
    .string()
    .trim()
    .max(50, { message: "Città deve essere max 50 caratteri" }),
  via: z
    .string()
    .trim()
    .max(100, { message: "Via deve essere max 100 caratteri" }),
  cap: z
    .string()
    .trim()
    .regex(
      /^(\d{5})?$/,
      "Il numero deve contenere al massimo un '/' come separatore e deve avere da 10 a 14 cifre"
    ),
  provincia: z    
    .string()
    .trim()
    .max(3, { message: "Provincia deve essere max 3 caratteri" }),
});

export type ProfileFormInputs = z.infer<typeof profileSchema>; 


export const ProfileComponent = ( {profiloData}: ProfileComponentProps ) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [editProfile, setEditProfile] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const {register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ProfileFormInputs>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      id: "",
      cognome: "",
      nome: "",
      via: "",
      citta: "",
      cap: "",
      provincia: "",
      telefono: "",
      cellulare: "",
    }
  });

   

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(()=>{
    if(editProfile) {
      setValue("id", profiloData.id);
      setValue("nome", profiloData.nome);
      setValue("cognome", profiloData.cognome);
      setValue("via", profiloData.via);
      setValue("citta", profiloData.citta);
      setValue("cap", profiloData.cap);
      setValue("provincia", profiloData.provincia);
      setValue("telefono", profiloData.telefono);
      setValue("cellulare", profiloData.cellulare);
      setUsername(profiloData.username);
      setEmail(profiloData.email);
    } else {
      reset();
      setUsername('');
      setEmail('');
    }
  }, [editProfile]);

  const onSubmit = async (formData: ProfileFormInputs) => {
    setLoading(true);        
    setErrorMessage("");

    const {message, error} = await setProfilo(formData);

    if (message) {
      setSuccessMessage(message);
    } else {
      setErrorMessage(error);
    }

      
    setLoading(false);

    setTimeout(() => {  //--> dopo 5 sec. resetto error e succ  (aternativa al banner di notifica che scompare!)
      setErrorMessage("");   
      setSuccessMessage("");   
    }, 5000);
     

    
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click();  
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("File selezionato:", file);
      // Puoi aggiungere qui il codice per gestire il caricamento del file
    }
  };

  

  return (
    <div className="flex justify-center gap-4 mt-14 p-10">
      {editProfile && <div className="w-1/3 bg-white p-4 rounded-xl">
        <h2 className="font-light mb-2">Il mio profilo</h2>
        <form  onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-3"> 
            <div className="relative mb-4 w-1/2">
              <label 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                  Username
              </label>
              <input
                  type="text"
                  className="text-gray-500 shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus-visible:ring-0 focus:border-indigo-500"
                  placeholder="Username"
                  value={username}
                  disabled
              />
            </div>
            <div className="relative mb-4 w-1/2">
              <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                  Email
              </label>
              <input
                  type="text"
                  className="text-gray-500 shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus-visible:ring-0 focus:border-indigo-500"
                  placeholder="Email"
                  value={email}
                  disabled
              /> 
            </div>
          </div>
          <div className="flex gap-3 "> 
            <div className="relative mb-4 w-1/2">
              <label 
                htmlFor="nome"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                  Nome
              </label>
              <input
                  type="text"
                  id="nome"
                  className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus-visible:ring-0 focus:border-indigo-500"
                  placeholder="Nome"
                  {...register("nome")}
              />              
              <ErrorValidationComponent error={errors.nome?.message} />
            </div>
            <div className="relative mb-4 w-1/2">
              <label 
                htmlFor="cognome"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                  Cognome
              </label>
              <input
                  type="text"
                  id="cognome"
                  className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus-visible:ring-0 focus:border-indigo-500"
                  placeholder="Cognome"
                  {...register("cognome")}
              />              
              <ErrorValidationComponent error={errors.cognome?.message} />
            </div>       
          </div>      
          <div className="flex gap-3 "> 
            <div className="relative mb-4 w-full">
              <label 
                htmlFor="indirizzo"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                  Indirizzo
              </label>
              <input
                  type="text"
                  id="indirizzo"
                  className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus-visible:ring-0 focus:border-indigo-500"
                  placeholder="Indirizzo"
                  {...register("via")}
              />
            </div>            
            <ErrorValidationComponent error={errors.via?.message} />
          </div>
          <div className="flex gap-3 "> 
            <div className="relative mb-4 w-[60%]">
              <label 
                htmlFor="citta"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                  Città
              </label>
              <input
                  type="text"
                  id="citta"
                  className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus-visible:ring-0 focus:border-indigo-500"
                  placeholder="Citta"
                  {...register("citta")}
              />              
              <ErrorValidationComponent error={errors.citta?.message} />
            </div>
            <div className="relative mb-4 w-[20%]">
              <label 
                htmlFor="cap"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                  CAP
              </label>
              <input
                  type="text"
                  id="cap"
                  className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus-visible:ring-0 focus:border-indigo-500"
                  placeholder="CAP"
                  {...register("cap")}
              />              
              <ErrorValidationComponent error={errors.cap?.message} />
            </div>            
            <div className="relative mb-4 w-[20%]">
              <label 
                htmlFor="provincia"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                  Provincia
              </label>
              <input
                  type="text"
                  id="provincia"
                  className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus-visible:ring-0 focus:border-indigo-500"
                  placeholder="Prov."
                  {...register("provincia")}
              />              
              <ErrorValidationComponent error={errors.provincia?.message} />
            </div>
          </div>
          <div className="flex gap-3 "> 
            <div className="relative mb-4 w-1/2">
              <label 
                htmlFor="telefono"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                  Telefono
              </label>
              <input
                  type="tel"
                  id="telefono"
                  className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus-visible:ring-0 focus:border-indigo-500"
                  placeholder="Telefono"
                  {...register("telefono")}
              />              
              <ErrorValidationComponent error={errors.telefono?.message} />
            </div>
            <div className="relative mb-4 w-1/2">
              <label 
                htmlFor="cellulare"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                  Cellulare
              </label>
              <input
                  type="text"
                  id="cellulare"
                  className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus-visible:ring-0 focus:border-indigo-500"
                  placeholder="Cellulare"
                  {...register("cellulare")}
              />              
              <ErrorValidationComponent error={errors.cellulare?.message} />
            </div>       
          </div>          
          <div className="flex justify-between items-center py-2 gap-2">
            <Button type="submit" className={`px-3 bg-orange-400 hover:bg-orange-400/80  ${Object.keys(errors).length > 0 ? 'cursor-not-allowed' : ''}`}>
              Salva            
            </Button>
            <Button type="button" variant="outline" className={'px-3 text-orange-400 border-orange-400 hover:bg-orange-400/80 hover:text-white'} onClick={()=>setEditProfile(false)}>
              Annulla            
            </Button>
            {loading && <Spinner />}   
            {errorMessage && <span className="text-red-500">{errorMessage}</span>} 
            {successMessage && <span className="text-green-500 text-balance mt-2 ">{successMessage}</span>}
          </div>    
        </form>      
      </div>}  
      <div className="w-1/3 flex justify-center">                
        <div className="relative flex flex-col justify-between bg-white rounded-xl pt-24 p-4">
          <div>
            <div className="absolute flex justify-center rounded-full -top-[72px] left-1/2 transform -translate-x-1/2 hover:cursor-pointer  group">
                <Avatar className="w-36 h-36 ring-8 ring-[#f5f7f8]" onClick={handleAvatarClick}>
                    <AvatarImage src="https://thispersondoesnotexist.com" />
                    <AvatarFallback>A</AvatarFallback>                    
                </Avatar>
                <CiEdit className="absolute h-4 w-4 xl:h-5 xl:w-5  bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".jpeg,.jpg,.png,.webp"
                  className="hidden"  
                />
            </div>
            <h2 className="text-3xl font-bold text-center">{profiloData.username}</h2>
            <p className="text-xl font-medium  text-center">{`${profiloData.nome} ${profiloData.cognome}`}</p>                
            <p className="mt-10 text-xl font-normal text-center">{`${profiloData.via} - ${profiloData.cap} - (${profiloData.provincia})`}</p> 
            <p className="mt-10 text-xl font-normal text-center">{`${profiloData.telefono} - ${profiloData.cellulare}`}</p>
          </div>
          <div className="text-end mt-5">
            <Button className="space-x-2 bg-orange-400 hover:bg-orange-400/80" onClick={()=>setEditProfile(true)}>
                <span>Edit Profile</span>
            </Button>   
          </div>                 
        </div>                     
      </div>
    </div>
             
  )
}
