
'use client'


import { Alimentazione, Stato, TipoVeicolo, User, Veicolo } from "@/lib/types";
import { formatEuro } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Spinner } from "./spinner";
import { setVeicoloVenduto } from "@/app/(user)/action";
import { z } from 'zod';
import { sendOrderMail } from "@/app/action";

type CardProps = {
    veicolo: Veicolo;
    user: User | null;
}

const mailDataSchema = z.object({  
    username: z
        .string()
        .trim()
        .regex(/^[a-zA-Z0-9]+$/, { message: "L'username può contenere solo lettere e numeri" })
        .min(3, { message: "Username deve essere da 3 a 30 caratteri" })
        .max(30, { message: "Username deve essere da 3 a 30 caratteri" }),  
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
});

export type MailData = z.infer<typeof mailDataSchema>;


const CardComponent_V2 = ({veicolo, user}: CardProps) => {

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [src, setSrc] = useState<string>(veicolo.image);
    //const [prezzo, setPrezzo] = useState<string>('');
    const [acquistato, setAcquistato] = useState<boolean>(false);

    /* useEffect(() => {    --> per bug Mozilla     
        setPrezzo(formatEuro(veicolo.prezzo));
    }, [veicolo.prezzo]); */

    const handlerInviaMail = async () => {
        setLoading(true);
        try {
            const mailData = {
                username: user ? user.username : '',
                brand: veicolo.brand,
                modello: veicolo.modello,
                anno: veicolo.anno.toString(),
                alimentazione: veicolo.alimentazione
            }

            mailDataSchema.parse(mailData);

          

            const { message, error } = await sendOrderMail(mailData);


            //contrassegna il veicolo come acquistato
            /* const  { error: errorVenduto } = await setVeicoloVenduto(veicolo.id ?? '');
            if (error) {
                throw new Error(error || 'Errore durante l\'aggiornamento stato');
            } */



           /*  const response = await fetch('/api/sendMail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({                    
                    text: `<p>Il sig. <strong>${mailData.username}</strong> ha effettuato un nuovo ordine.</p>
                           <p>Veicolo ordinato: ${mailData.brand} ${mailData.modello}</p>
                           <p>immatricolazione: ${mailData.anno}</p>
                           <p>Alimentazione: ${mailData.alimentazione}</p>`
                }),
            })
            if (response.ok) {
                setSuccess('Ordine ricevuto con successo!');
                setAcquistato(true);  //appare barra acquistato
            } else {
                setError("Errore durante l'elaborazione dell'ordine.");
            }*/

            if (message) {
                const  { error } = await setVeicoloVenduto(veicolo.id ?? '');
                if (error) {
                    throw new Error(error || 'Errore durante l\'aggiornamento stato');
                }
                setSuccess(message);
                setAcquistato(true);  //appare barra acquistato
            } else {
                setError(error);
            }

            
 
            setTimeout(() => {  //--> dopo 5 sec. resetto error e succ (aternativa al banner di notifica che scompare!)
                setSuccess(null);   
                setError(null)    
                //setAcquistato(true);  //appare barra acquistato
            }, 5000);
            
        } catch (error) {
            console.log(error)
            if (error instanceof z.ZodError) {
                setError('Dati non validi: ');
                return;
            }
            if (error instanceof Error) {
                setError(error.message || 'Errore sconisciuto.');
                return;
            }
            setError('Errore sconisciuto.');
        } finally {
            setLoading(false)
        }
    }  
    /* const handlerInviaMail = async () => {
        setLoading(true);
        try {
            const mailData = {
                username: user?.username,
                brand: veicolo.brand,
                modello: veicolo.modello,
                anno: veicolo.anno.toString(),
                alimentazione: veicolo.alimentazione
            }

            mailDataSchema.parse(mailData);

            //contrassegna il veicolo come acquistato
            const {error} = await setVeicoloVenduto(veicolo.id ?? '');
            if (error) {
                throw new Error(error || 'Errore durante l\'aggiornamento stato');
            }



            const response = await fetch('/api/sendMail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({                    
                    text: `<p>Il sig. <strong>${mailData.username}</strong> ha effettuato un nuovo ordine.</p>
                           <p>Veicolo ordinato: ${mailData.brand} ${mailData.modello}</p>
                           <p>immatricolazione: ${mailData.anno}</p>
                           <p>Alimentazione: ${mailData.alimentazione}</p>`
                }),
            })
            if (response.ok) {
                setSuccess('Ordine ricevuto con successo!');
                setAcquistato(true);  //appare barra acquistato
            } else {
                setError("Errore durante l'elaborazione dell'ordine.");
            }

            setTimeout(() => {  //--> dopo 5 sec. resetto error e succ (aternativa al banner di notifica che scompare!)
                setSuccess(null);   
                setError(null)    
                //setAcquistato(true);  //appare barra acquistato
            }, 5000);
            
        } catch (error) {
            console.log(error)
            if (error instanceof z.ZodError) {
                setError('Dati non validi: ');
                return;
            }
            setError('Errore sconisciuto.');
        } finally {
            setLoading(false)
        }
    }  
 */
    const randomNumber = () => Math.floor(Math.random() * 3) + 1;

     
  
    return (
        <div className="relative flex flex-col justify-between bg-white pt-2 pl-2 w-full sm:pt-3 sm:pl-3 lg:pt-4 lg:pl-4 rounded-xl overflow-hidden select-none">
            {veicolo.stato === Stato.VENDUTO && !acquistato && <div className="absolute top-7 right-[-45px] w-[180px] transform rotate-45 bg-red-400/80 z-50 text-white font-bold text-center py-1 shadow-md">
                VENDUTO
            </div>}
            {acquistato && <div className="absolute top-9 right-[-38px] w-[180px] transform rotate-45 bg-lime-400/80 z-50 text-white font-bold text-center py-1 shadow-md">
                ACQUISTATO
            </div>}
            <div className="relative flex flex-col lg:flex-row gap-2 lg:gap-4 mr-2">
                <div className="w-fit">
                    <span className="font-semibold text-2xl text-lime-500">{veicolo.anno}</span>
                </div>
                <div className="relative w-[200px] h-[150px] mx-auto lg:mx-0 overflow-hidden border rounded-lg">
                    {/*L'img viene caricata cosi perchè non sono presenti le img per ogni veicolo, quindi quando non trovata carico il placheholder random in base al tipo di veicolo */}
                    <Image 
                        //src={`http://localhost:5000/uploads/veicoli/59d7cbc0d1f817da4d28b4700.jpg`}
                        src={`http://localhost:5000/uploads/${src}`}
                        //src={'http://localhost:5000' + src}
                        //src={'/veicoli/' + src}
                        //src={'/veicoli/' + veicolo.urlImg}
                        alt={`${veicolo.brand} ${veicolo.modello} ${veicolo.anno}`}
                        fill
                        sizes="33vw"
                        priority
                        onError={() => veicolo.tipo === TipoVeicolo.AUTO ? setSrc("veicoli/auto" +  randomNumber() + ".jpg") : setSrc("veicoli/moto" +  randomNumber() + ".jpg")}                        
                    />
                </div>
                <div className="flex-1">
                   {/*  <h2 className="flex items-baseline lg:items-end justify-center font-semibold text-2xl text-orange-400 h-[40%] ">{`€ ${prezzo}`}</h2>*/}
                    <h2 className="flex items-baseline lg:items-end justify-center font-semibold text-2xl text-orange-400 h-[40%] ">{`€ ${formatEuro(veicolo.prezzo)}`}</h2> 
                    <div className="flex items-end h-[60%]">
                        {loading ? <Spinner /> : '' } 
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                        {success && <span className="text-green-500 text-balance mt-2 ">{success}</span>}
                    </div>  
                </div>
            </div>
            <div className="flex mt-2 w-full justify-between ">
                <div className="flex flex-col mb-2">
                    <div >
                        <span className="font-semibold text-xl sm:text-2xl ">{`${veicolo.brand} ${veicolo.modello}`}</span>
                    </div>                    
                    <div className="flex flex-row sm:flex-col md:flex-row font-medium text-base  sm:text-lg">
                        <span>{veicolo.alimentazione}</span>
                        <span className="sm:hidden md:block">&nbsp;-&nbsp;</span>
                        <span>{veicolo.kilometri} km</span>
                    </div>
                </div>
                {user && <div className="flex items-end ">
                    <div className="bg-[#f5f7f8] p-2 rounded-tl-lg">
                    <button 
                        onClick={handlerInviaMail} 
                        disabled={loading || veicolo.stato === Stato.VENDUTO || acquistato} 
                        className='bg-orange-400 text-white font-normal rounded-[4px] py-[4px] px-4 sm:px-5 text-base hover:opacity-80 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60'
                    >                            
                        Acquista
                    </button>
                    </div>
                </div>}
            </div>
        </div>
    )
}


export default CardComponent_V2;



