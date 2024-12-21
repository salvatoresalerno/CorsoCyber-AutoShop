"use client";


import { Button } from "./ui/button";
import { Spinner } from "./spinner";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Ruolo } from "@/lib/types";

/* type FormLoginProps = {
  ruolo: string;
} */

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
    .regex(/[$!%&=[\]#\-.\(\)]/, "La password deve contenere almeno un carattere speciale tra !$%&=[]#-.( )"),  
});

export type SigninFormInputs = z.infer<typeof signinSchema>; 


export const AddVeicoliForm = (/* {ruolo}: FormLoginProps */) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const {register, handleSubmit, reset, formState: { errors } } = useForm<SigninFormInputs>({
    resolver: zodResolver(signinSchema),
    mode: "onChange",
  });

   

  const onSubmit = async (formData: SigninFormInputs) => {
    setLoading(true);        
    setErrorMessage("");

    
    
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