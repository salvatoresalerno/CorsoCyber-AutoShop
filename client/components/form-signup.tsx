"use client";

 
import { Button } from "./ui/button";
import { Spinner } from "./spinner"; 
import { useEffect, useState } from "react";
import { SignUpAction } from "@/app/(user)/action";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorValidationComponent } from "./ErrorValidationComponent";
import Link from "next/link";
import { ExtendedUser, Ruolo } from "@/lib/types";
import { useRouter } from 'next/navigation';
import { cn } from "@/lib/utils"; 
import { useRecaptcha } from "@/hooks/useRecaptcha";


const signupSchema = z.object({   //schema validazione campi form
    id: z    
        .string()
        .uuid()
        .optional(),        
    username: z
        .string()
        .trim()
        .regex(/^[a-zA-Z0-9]+$/, { message: "L'username può contenere solo lettere e numeri" })
        .min(3, { message: "Username deve essere da 3 a 30 caratteri" })
        .max(30, { message: "Username deve essere da 3 a 30 caratteri" }),
    email: z
        .string()
        .trim()
        .email("Formato email non valido.")
        .max(255, {message: "la mail deve essere massimo 255 caratteri"}),
    password: z
        .string()
        .trim()
        .min(8, "La password deve essere minimo 8 caratteri")
        .regex(/[A-Z]/, "La password deve contenere almeno una lettera maiuscola")
        .regex(/\d/, "La password deve contenere almeno un numero")
        //.regex(/[$!%=[\]#\-.\(\)]/, "La password deve contenere almeno un carattere speciale tra !$%=[]#-.( )"),
        .regex(/[\!\$\%\=\[\]\#\-\.\(\)]/, "La password deve contenere almeno un carattere speciale tra !$%=[]#-.()")
        .regex(/^[A-Za-z\d\!\$\%\=\[\]\#\-\.\(\)]+$/, "La password può contenere solo lettere, numeri e i caratteri speciali consentiti"),
    confirmPassword: z
        .string()
        .trim(),
    }).refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Le password non corrispondono",
});

export type SignupFormInputs = z.infer<typeof signupSchema>; 

type SignUpFormProps = {
    ruolo: string;
    admin?: ExtendedUser | null;
}


export const SignUpForm = ({ruolo, admin}: SignUpFormProps) => {   

    useRecaptcha();

    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [recaptchaReady, setRecaptchaReady] = useState<boolean>(false);

    const {register, handleSubmit, reset, setValue, formState: { errors } } = useForm<SignupFormInputs>({
        resolver: zodResolver(signupSchema),
        mode: "onChange",
        defaultValues: {
            id: undefined,
            username: "",
            email: "",
            password: "",
            confirmPassword: "",             
          }
    });

    const router = useRouter();

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

    useEffect(() => {
        if (admin) {
            setValue('id', admin.id);
            setValue("username", admin.username);
            setValue("email", admin.email);
        }

    }, [admin, setValue]);    




    const onSubmit = async (data: SignupFormInputs) => {
        setLoading(true);
        setMessage("");
        setErrorMessage("");

        let message: string = '';
        let error: string = '';

        if (!window.grecaptcha || !recaptchaReady) {                      
            setErrorMessage("reCAPTCHA non è pronto"); 
            setLoading(false);
            return;  
        }

        const tokenREC = await window.grecaptcha.execute(
            process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
            { action: "submit" }
        );  

        if (ruolo === Ruolo.USER) {
            const res = await SignUpAction(data, tokenREC);
            message = res.message;
            error = res.error;
        } else if (ruolo === Ruolo.ADMIN) {
            let res;
            if (admin) {  //sono in update                
                res = await SignUpAction(data, tokenREC, Ruolo.ADMIN, true);
            } else { //salvataggio normale
                res = await SignUpAction(data, tokenREC, Ruolo.ADMIN);
            }          
            error = res.error;
            message = res.message;
            router.refresh();            
        }        

        if (error) {
            setErrorMessage(error);    
        } 

        if (message) {
            setMessage(message); 
        }

        reset();
        setLoading(false);    
    }


    return (
        <form  onSubmit={handleSubmit(onSubmit)}  >
            <div className="relative mb-4">
                <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                    Username
                </label>   
                <input
                    type="text"
                    id="username"
                    {...register("username")}
                    className={cn(`shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
                        `, errors.username && 'border-red-500', admin && 'text-gray-500')}
                    placeholder="username"
                    {...(admin ? { disabled: true } : {})}
                />
                <ErrorValidationComponent error={errors.username?.message} />    
            </div>
            <div className="relative mb-4">
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                    Email Address
                </label>
                <input
                    type="text"
                    id="email"
                    className={cn(`shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
                               `, errors.email && 'border-red-500', admin && 'text-gray-500')}                    
                    placeholder="email"
                    {...register("email")}  
                    {...(admin ? { disabled: true } : {})}        
                />
                <ErrorValidationComponent error={errors.email?.message} />             
            </div>
            <div className="relative mb-4">
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    {...register("password")}
                    className={`shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
                        ${errors.password ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Enter your password"
                />
                <ErrorValidationComponent error={errors.password?.message} />  
            </div>
            <div className="relative mb-4">
                <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                    Confirm Password
                </label>
                <input
                    type="password"
                    id="confirmPassword"
                    {...register("confirmPassword")}
                    className={`shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
                        ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Confirm your password"
                />
                <ErrorValidationComponent error={errors.confirmPassword?.message} />  
            </div>
            <div className="flex items-center py-2 gap-2">
                <Button type="submit" className={`px-3 bg-orange-400 hover:bg-orange-400/80  ${Object.keys(errors).length > 0 ? 'cursor-not-allowed' : ''}`}>
                    {admin ? 'Modifica' : 'Registrati'}            
                </Button>
                {loading && <Spinner />}
                {message && 
                    <div className="flex flex-col leading-none">
                        <span className="text-lime-500">{message}</span>
                        {ruolo === Ruolo.USER && <Link href={'\login'} className="text-gray-500 hover:text-gray-700">Vai al login</Link>}
                    </div>
                }
                {errorMessage && <span className="text-red-500">{errorMessage}</span>}
            </div>            
        </form>
    )
}
