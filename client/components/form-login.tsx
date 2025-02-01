"use client";


import { Button } from "./ui/button";
import { Spinner } from "./spinner";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Ruolo } from "@/lib/types";
import { useRecaptcha } from "@/hooks/useRecaptcha";

type FormLoginProps = {
  ruolo: string;
}

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
    //.regex(/[$!%=[\]#\-.\(\)]/, "La password deve contenere almeno un carattere speciale tra !$%=[]#-.()"),  
    .regex(/[\!\$\%\=\[\]\#\-\.\(\)]/, "La password deve contenere almeno un carattere speciale tra !$%=[]#-.()")
    .regex(/^[A-Za-z\d\!\$\%\=\[\]\#\-\.\(\)]+$/, "La password può contenere solo lettere, numeri e i caratteri speciali consentiti"),  
});

export type SigninFormInputs = z.infer<typeof signinSchema>; 

//const apiBaseUrl = process.env.NEXT_CLIEN_API_URL || '';
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;


export const LoginForm = ({ruolo}: FormLoginProps) => {

  useRecaptcha();

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [recaptchaReady, setRecaptchaReady] = useState<boolean>(false);

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

  const {register, handleSubmit, reset, formState: { errors } } = useForm<SigninFormInputs>({
    resolver: zodResolver(signinSchema),
    mode: "onChange",
  });

  const router = useRouter();

  const onSubmit = async (formData: SigninFormInputs) => {
    setLoading(true);        
    setErrorMessage("");

    try { 

      if (!window.grecaptcha || !recaptchaReady) throw new Error("reCAPTCHA non è pronto");

      const tokenREC = await window.grecaptcha.execute(
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
        { action: "submit" }
      );   
    
      const response = await fetch(`${apiBaseUrl}/v1/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email: formData.email, password: formData.password, role: ruolo, tREC: tokenREC }),
      });

      const {message, error} = await response.json();

      console.log()
      
      if (error) {
        setErrorMessage(error || 'Login Fallito');
      } 

      if (message && ruolo === Ruolo.USER) { //refresh componenti server per aggiornare layout dopo login (alternativa stato globale!)
        router.push('/');
        router.refresh();
      } else if (message && (ruolo === Ruolo.ADMIN || ruolo === Ruolo.SUPERADMIN)) {
        router.push('/admin/dashboard/in_vendita');
        router.refresh();
      }        
    
    } catch (err: unknown) {  //errore impostato uguale per usare la var 'err' che se inutilizzata potrebbe dare problemi in produzione         
      setErrorMessage(
        err instanceof Error ? 'Login Fallito' : 'Login Fallito'
      );
    } finally {
      setLoading(false);
      reset();
    }

  }

  return (
    <form  onSubmit={handleSubmit(onSubmit)}  >
        <div className="mb-4">
          <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
              Email
          </label>
          <input
              type="email"
              id="email"
              className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="email"
              {...register("email")}
          />
        </div>
        <div className="mb-4">
          <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
              Password
          </label>
          <input
              type="password"
              id="password"
              className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your password"
              {...register("password")}
          />
        </div>
        {ruolo === Ruolo.USER && <div className="flex items-center justify-end mb-4">        
          <Link
              href="/signup"
              className="text-xs text-gray-500 hover:text-gray-700 focus:outline-none "
          >
              Create Account
          </Link>
        </div>}
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
