
'use client'


import { Stato, TipoVeicolo, User, Veicolo } from "@/lib/types";
import { formatEuro } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { Spinner } from "./spinner";
import { setVeicoloVenduto } from "@/app/(user)/action";

type CardProps = {
    veicolo: Veicolo;
    user: User | null;
}



const CardComponent_V2 = ({veicolo, user}: CardProps) => {

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [src, setSrc] = useState<string>(veicolo.image);
    const [acquistato, setAcquistato] = useState<boolean>(false);

    const handlerInviaMail = async () => {
        setLoading(true);

        

        try {
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
                    text: `<p>Il sig. <strong>${user && user.username}</strong> ha effettuato un nuovo ordine.</p>
                           <p>Veicolo ordinato: ${veicolo.brand} ${veicolo.modello}</p>
                           <p>immatricolazione: ${veicolo.anno}</p>
                           <p>Alimentazione: ${veicolo.alimentazione}</p>`
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
            setError('Errore sconisciuto.');
        } finally {
            setLoading(false)
        }
    }  

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
                        src={'/veicoli/' + src}
                        //src={'/veicoli/' + veicolo.urlImg}
                        alt={`${veicolo.brand} ${veicolo.modello} ${veicolo.anno}`}
                        fill
                        sizes="33vw"
                        priority
                        onError={() => veicolo.tipo === TipoVeicolo.AUTO ? setSrc("auto" +  randomNumber() + ".jpg") : setSrc("moto" +  randomNumber() + ".jpg")}                        
                    />
                </div>
                <div className="flex-1">
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



