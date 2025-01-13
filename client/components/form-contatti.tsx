'use client'

import { useState } from "react";
import { Spinner } from "./spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorValidationComponent } from "./ErrorValidationComponent";
import { useForm } from "react-hook-form";
import { z } from "zod";



const contattiSchema = z.object({   //schema validazione campi form
    nome: z    
        .string()
        .trim() 
        .regex(/^[a-zA-Z0-9\s]+$/, { message: "Nome può contenere solo lettere e numeri" })
        .min(3, { message: "Nome deve essere da 3 a 30 caratteri" })
        .max(30, { message: "Nome deve essere da 3 a 30 caratteri" }),       
    email: z
        .string()
        .trim()
        .email("Formato email non valido.")
        .max(255, {message: "la mail deve essere massimo 255 caratteri"}),
    telefono: z
        .string()
        .trim()
        .refine(val => val === "" || /^\d{1,3}(\/?\d{1,11})?$/.test(val), {
          message: "Il numero deve contenere al massimo un '/' come separatore e deve avere da 10 a 14 cifre",
        }),
    messaggio: z    
        .string()
        .trim() 
        //.regex(/^[a-zA-Z0-9]+$/, { message: "Nome può contenere solo lettere e numeri" })
        .regex(/^[a-zA-Z0-9\s.,!?'"()-]+$/, { message: "Il campo può contenere solo lettere, numeri, spazi e punteggiatura" })

        .min(1, { message: "Messaggio non può essere vuoto" })
        .max(30, { message: "Messaggio deve essere max 500 caratteri" }),
});  

export type ContattiFormInputs = z.infer<typeof contattiSchema>; 


export default function ContattiForm() {

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const {register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ContattiFormInputs>({
            resolver: zodResolver(contattiSchema),
            mode: "onChange",
            defaultValues: {
                nome: "",
                email: "",
                telefono: "",
                messaggio: "",             
              }
        });

      

    /* const submitForm = (event: React.FormEvent) => {
        event.preventDefault();   

        const form = event.currentTarget as HTMLFormElement;
        const formData = new FormData(form);
        
        handlerInviaMail(formData);

        form.reset();
        
        setTimeout(() => {  //--> dopo 10 sec. resetto error e succ (aternativa al banner di notifica che scompare!)
            setSuccess(null);  //messo 10 sec. perchè il timeout parte appena invio il form, cosi includo anche il tempo 
            setError(null)   //di invio mail e il messaggio rimane visibile per un tempo ragionevole
        }, 10000);
    } */

    const onSubmit = async (data: ContattiFormInputs) => {
        handlerInviaMail(data);

        reset();
        setTimeout(() => {  //--> dopo 10 sec. resetto error e succ (aternativa al banner di notifica che scompare!)
            setSuccess(null);  //messo 10 sec. perchè il timeout parte appena invio il form, cosi includo anche il tempo 
            setError(null)   //di invio mail e il messaggio rimane visibile per un tempo ragionevole
        }, 10000);
    }

    const handlerInviaMail = async (formData: ContattiFormInputs) => {
        setLoading(true);

        const nome = formData.nome; //formData.get("nome")?.toString().trim();
        const email = formData.email;   //formData.get("email")?.toString().trim();
        const telefono = formData.telefono;     //formData.get("telefono")?.toString().trim();
        const messaggio = formData.messaggio;   //formData.get("messaggio")?.toString().trim();

        try {
            const response = await fetch('/api/sendInfo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({                    
                    text: `
                           <p>Il sig. <strong>${nome}</strong> ha richiesto informazioni.</p>
                           <br />
                           <p ><strong>Contatti:</strong></p>
                           <ul>
                            <li><strong>Email:</strong> <a href="mailto:${email}">${email}</a></li>
                            <li><strong>Telefono:</strong> ${telefono}</li>
                           </ul> 
                           <br />
                           <p><strong>Messaggio</strong></p>
                           <p>${messaggio}</p>`
                }),
            })
            if (response.ok) {
                setSuccess('Messaggio inviato con successo!');
            } else {
                setError("Errore durante l'invio del messaggio.");
            }
            
        } catch (error) {
            console.log(error);
            setError('Errore sconisciuto.');
        } finally {
            setLoading(false);
        }
    }    

    return (<>     
        <h2 className="font-semibold text-3xl text-center my-5">Richiedi Info</h2>   
        <form onSubmit={handleSubmit(onSubmit)}  className='flex flex-col  gap-2 w-full p-2 md:py-10'>
            <div className='flex flex-col gap-2 xl:flex-row xl:gap-4  w-full'>
                <div className="w-1/3">
                    <input                   
                        className="h-10 px-3 py-[6px] rounded-[4px] outline-none w-full text-[15px] text-[#555555] bg-white shadow-form border border-[#ccc] xl:text-lg" 
                        placeholder='Il tuo nome'     
                        {...register("nome")}              
                    />
                    <ErrorValidationComponent error={errors.nome?.message} />  
                </div>  
                <div className="w-1/3">             
                    <input 
                        className="h-10 px-3 py-[6px] rounded-[4px] outline-none w-full text-[15px] text-[#555555] bg-white shadow-form border border-[#ccc] xl:text-lg" 
                        placeholder='Email'
                        type="text"
                        {...register("email")}
                    />
                    <ErrorValidationComponent error={errors.email?.message} /> 
                </div>
                <div className="w-1/3">
                    <input 
                        className="h-10 px-3 py-[6px] rounded-[4px] outline-none w-full text-[15px] text-[#555555] bg-white shadow-form border border-[#ccc] xl:text-lg" 
                        placeholder='Telefono'
                        {...register("telefono")}
                    />
                    <ErrorValidationComponent error={errors.telefono?.message} /> 
                </div>
            </div>
            <div className='w-full'>
                <textarea 
                    className="px-3 py-[6px] rounded-[4px] outline-none w-full text-[15px] text-[#555555] bg-white shadow-form border border-[#ccc] xl:text-lg" 
                    rows={5}
                    placeholder='Il tuo messaggio...'
                    {...register("messaggio")} 
                />
                <ErrorValidationComponent error={errors.messaggio?.message} /> 
            </div>
            <div className="flex items-center justify-end gap-4">
                {loading ? <Spinner /> : '' } 
                {error && <p className="text-red-500 ">{error}</p>}
                {success && <span className="text-green-500   ">{success}</span>}
                <button type="submit" className='bg-[#51b200] text-white  font-normal  rounded-[4px] py-[4px] px-5 lg:text-[20px]'>
                    Invia
                </button>
            </div>                       
        </form>
    </>)
}





