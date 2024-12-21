'use client'

import { useState } from "react";
import { Spinner } from "./spinner";

export default function ContattiForm() {

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const submitForm = (event: React.FormEvent) => {
        event.preventDefault();   

        const form = event.currentTarget as HTMLFormElement;
        const formData = new FormData(form);
        
        handlerInviaMail(formData);

        form.reset();
        
        setTimeout(() => {  //--> dopo 10 sec. resetto error e succ (aternativa al banner di notifica che scompare!)
            setSuccess(null);  //messo 10 sec. perchè il timeout parte appena invio il form, cosi includo anche il tempo 
            setError(null)   //di invio mail e il messaggio rimane visibile per un tempo ragionevole
        }, 10000);
    }

    const handlerInviaMail = async (formData: FormData) => {
        setLoading(true);

        const nome = formData.get("nome")?.toString().trim();
        const email = formData.get("email")?.toString().trim();
        const telefono = formData.get("telefono")?.toString().trim();
        const messaggio = formData.get("messaggio")?.toString().trim();

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
        <form  className='flex flex-col  gap-2 w-full p-2 md:py-10' onSubmit={submitForm}>
            <div className='flex flex-col gap-2 xl:flex-row xl:gap-4  w-full'>
                <input 
                    name="nome"
                    className="h-10 px-3 py-[6px] rounded-[4px] outline-none w-full text-[15px] text-[#555555] bg-white shadow-form border border-[#ccc] xl:text-lg" 
                    placeholder='Il tuo nome'     
                    required               
                />
                
                <input 
                    className="h-10 px-3 py-[6px] rounded-[4px] outline-none w-full text-[15px] text-[#555555] bg-white shadow-form border border-[#ccc] xl:text-lg" 
                    placeholder='Email'
                    type="email"
                    name="email"
                    required
                />
                <input 
                    className="h-10 px-3 py-[6px] rounded-[4px] outline-none w-full text-[15px] text-[#555555] bg-white shadow-form border border-[#ccc] xl:text-lg" 
                    placeholder='Telefono'
                    name="telefono"
                    required
                />
            </div>
            <div className='w-full'>
                <textarea 
                    className="px-3 py-[6px] rounded-[4px] outline-none w-full text-[15px] text-[#555555] bg-white shadow-form border border-[#ccc] xl:text-lg" 
                    rows={5}
                    placeholder='Il tuo messaggio...'
                    name="messaggio"
                    required
                />
            </div>
            <div className="flex items-center justify-end gap-4">
                {loading ? <Spinner /> : '' } 
                {error && <p className="text-red-500 ">{error}</p>}
                {success && <span className="text-green-500   ">{success}</span>}
                <button className='bg-[#51b200] text-white  font-normal  rounded-[4px] py-[4px] px-5 lg:text-[20px]'>
                    Invia
                </button>
            </div>                       
        </form>
    </>)
}





