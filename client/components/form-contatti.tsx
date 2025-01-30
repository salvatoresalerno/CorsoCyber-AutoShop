'use client'

import { useEffect, useState } from "react";
import { Spinner } from "./spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorValidationComponent } from "./ErrorValidationComponent";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { sendContattiMail } from "@/app/action";
import { useRecaptcha } from "@/hooks/useRecaptcha";



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
        //.regex(/^[a-zA-Z0-9\s.,!?'"()-]+$/, { message: "Il campo può contenere solo lettere, numeri, spazi e punteggiatura" })
        //.regex(/^[a-zA-ZÀ-ÿ0-9\s.,!?:;_'"()-]+$/, { message: "Il campo può contenere solo lettere, numeri, spazi e punteggiatura" })
        .min(1, { message: "Messaggio non può essere vuoto" })
        .max(500, { message: "Messaggio deve essere max 500 caratteri" }),
});  

export type ContattiFormInputs = z.infer<typeof contattiSchema>; 


export default function ContattiForm() {

    useRecaptcha();

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [recaptchaReady, setRecaptchaReady] = useState<boolean>(false);

    const {register, handleSubmit, reset, formState: { errors } } = useForm<ContattiFormInputs>({
            resolver: zodResolver(contattiSchema),
            mode: "onChange",
            defaultValues: {
                nome: "",
                email: "",
                telefono: "",
                messaggio: "",             
              }
    });

      
    useEffect(() => {
        const checkRecaptcha = () => {
            if (window.grecaptcha) {
            window.grecaptcha.ready(() => setRecaptchaReady(true));
            } else {
            setTimeout(checkRecaptcha, 500);
            }
        };
        checkRecaptcha();
    }, []);
    

    const onSubmit = async (data: ContattiFormInputs) => {
        setLoading(true); 
        
        
        if (!window.grecaptcha || !recaptchaReady) {                      
            setError("reCAPTCHA non è pronto"); 
            return;  
        }

        const tokenREC = await window.grecaptcha.execute(
            process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
            { action: "submit" }
        );  

        const { message, error } = await sendContattiMail(data, tokenREC);

        if (message) {
            setSuccess(message);
        } 

        if (error) {
            setError(error);
        }

        setLoading(false);
        reset();
        
        setTimeout(() => {  //--> dopo 10 sec. resetto error e succ (aternativa al banner di notifica che scompare!)
            setSuccess(null);  //messo 10 sec. perchè il timeout parte appena invio il form, cosi includo anche il tempo 
            setError(null)   //di invio mail e il messaggio rimane visibile per un tempo ragionevole
        }, 10000);
    }    

    return (<>     
        <h2 className="font-semibold text-3xl text-center my-5">Richiedi Info</h2>   
        <form onSubmit={handleSubmit(onSubmit)}  className='flex flex-col  gap-2 w-full p-2 md:py-10'>
            <div className='flex flex-col gap-2 xl:flex-row xl:gap-4  w-full'>
                <div className="w-full xl:w-1/3">
                    <input                   
                        className="h-10 px-3 py-[6px] rounded-[4px] outline-none w-full text-[15px] text-[#555555] bg-white shadow-form border border-[#ccc] xl:text-lg" 
                        placeholder='Il tuo nome'     
                        {...register("nome")}              
                    />
                    <ErrorValidationComponent error={errors.nome?.message} />  
                </div>  
                <div className="w-full xl:w-1/3">             
                    <input 
                        className="h-10 px-3 py-[6px] rounded-[4px] outline-none w-full text-[15px] text-[#555555] bg-white shadow-form border border-[#ccc] xl:text-lg" 
                        placeholder='Email'
                        type="text"
                        {...register("email")}
                    />
                    <ErrorValidationComponent error={errors.email?.message} /> 
                </div>
                <div className="w-full xl:w-1/3">
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





