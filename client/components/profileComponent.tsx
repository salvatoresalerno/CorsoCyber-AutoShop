"use client";


import { Button } from "./ui/button";
import { Spinner } from "./spinner";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Profilo } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { CiEdit } from "react-icons/ci";
import { useRef } from "react";
import { ErrorValidationComponent } from "./ErrorValidationComponent";
import { uploadProfilo } from "@/app/(user)/action";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

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
      "Cap deve essere di 5 cifre"
    ),
  provincia: z   
    .string()
    .trim()
    .refine(val => val === "" || /^[A-Za-z]{2,3}$/.test(val), {
      message: "Provincia può contenere solo lettere 2/3",
    }),

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

export type ProfileFormInputs = z.infer<typeof profileSchema>; 


export const ProfileComponent = ( {profiloData}: ProfileComponentProps ) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [editProfile, setEditProfile] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [avatarImage, setAvatarImage] = useState<string | undefined>(undefined);

  const {register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm<ProfileFormInputs>({
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
      image: undefined
    }
  });

  const router = useRouter();
   
  const fileInputRef = useRef<HTMLInputElement | null>(null) as React.MutableRefObject<HTMLInputElement | null>;
  
  useEffect(()=>{
    let avatarUrl;
    if (profiloData.image) { 
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';  
      avatarUrl = `${baseUrl}/uploads/${profiloData.image}`;
    } else {
      avatarUrl = undefined;
    }
    setAvatarImage(avatarUrl);
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
  }, [editProfile, profiloData, setValue, reset]);

  

  const onSubmit = async (formData: ProfileFormInputs) => {
    setLoading(true);        
    setErrorMessage("");

    const data = new FormData();
    data.append('id', formData.id);
    data.append('cognome', formData.cognome);
    data.append('nome', formData.nome);
    data.append('cellulare', formData.cellulare);
    data.append('telefono', formData.telefono);
    data.append('citta', formData.citta);
    data.append('via', formData.via);
    data.append('cap', formData.cap);
    data.append('provincia', formData.provincia);

    if (formData.image){  //immagine selezionata
      data.append('image', formData.image);  
    } else if (!formData.image && avatarImage) {  //avatar non selezionato, già presente 
      data.append('image', profiloData?.image ?? '');
    } else {  //nessun file selezionato, nessun avatar trovato e da salvare
      data.append('image', '');
    }

    const {message, error} = await uploadProfilo(data);

    if (message) {
      setSuccessMessage(message);
    } else {
      setErrorMessage(error);
    }

    //ricaricare pagina per visualizzare nuova img di profilo
    router.refresh();
      
    setLoading(false);

    setTimeout(() => {  //--> dopo 5 sec. resetto error e succ  (aternativa al banner di notifica che scompare!)
      setErrorMessage("");   
      setSuccessMessage("");   
    }, 5000);
  } 

  const handleAvatarClick = () => { 
    if (editProfile) {
      fileInputRef.current?.click();
    }
  };

  const handlePreview = (file: File | undefined) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarImage(undefined);
    }
  };
  

  return (
    <div className="flex flex-col-reverse md:flex-row justify-center gap-4 mt-14 p-10">
      {editProfile && <div className="w-full md:w-1/2 lg:w-1/3 bg-white p-4 rounded-xl">
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
            {loading && <Spinner />}   
            {errorMessage && <span className="text-red-500">{errorMessage}</span>} 
            {successMessage && <span className="text-green-500 text-balance mt-2 ">{successMessage}</span>}
            <Button type="button" variant="outline" className={'px-3 text-orange-400 border-orange-400 hover:bg-orange-400/80 hover:text-white'} onClick={()=>setEditProfile(false)}>
              Annulla            
            </Button>
            
          </div>    
        </form>      
      </div>}  
      <div className="w-full md:w-1/2 lg:w-1/3 flex justify-center ">                
        <div className="relative flex flex-col justify-between bg-white rounded-xl pt-24 p-4 w-full">
          <div>
            <div className={cn(`absolute flex justify-center bg-[#f5f7f8] rounded-full -top-[72px] left-1/2 transform -translate-x-1/2 `, editProfile && "hover:cursor-pointer  group")}>
                <Avatar className="w-36 h-36  ring-8 ring-[#f5f7f8]" onClick={handleAvatarClick}>
                    <AvatarImage 
                      src={avatarImage} 
                    />
                    <AvatarFallback className="bg-[#f5f7f8] border">{profiloData.username[0].toUpperCase()}</AvatarFallback>                    
                </Avatar>
                {editProfile && <CiEdit className="absolute h-4 w-4 xl:h-5 xl:w-5  bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />}
                <Controller
                  name="image"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="file"
                      ref={(e) => {
                        fileInputRef.current = e; // Permette di usare il ref anche per il click
                        field.ref(e);
                      }}
                      onChange={(e) => {
                        field.onChange(e.target.files?.[0]); // Imposta il file su React Hook Form
                        handlePreview(e.target.files?.[0]);
                      }}
                      accept=".jpeg,.jpg,.png,.webp"
                      className="hidden"
                    />
                  )}
                />                
            </div>
            <h2 className="text-3xl font-bold text-center">{profiloData.username}</h2>
            <p className="text-xl font-medium  text-center">{`${profiloData.nome} ${profiloData.cognome}`}</p>                
            <p className="mt-10 text-xl font-normal text-center">{`${profiloData.via}   ${profiloData.cap ? ' - ' + profiloData.cap : ''} ${profiloData.provincia ? '- (' + profiloData.provincia + ')' : ''}`}</p> 
            <p className="mt-10 text-xl font-normal text-center">{`${profiloData.telefono} ${!profiloData.telefono || !profiloData.cellulare ? '' : ' - '} ${profiloData.cellulare}`}</p>
          </div>
          <div className="text-end mt-5">
            {!editProfile && <Button className="space-x-2 bg-orange-400 hover:bg-orange-400/80" onClick={()=>setEditProfile(true)}>
                <span>Edit Profile</span>
            </Button>}   
          </div>                 
        </div>                     
      </div>
    </div>             
  )
}
