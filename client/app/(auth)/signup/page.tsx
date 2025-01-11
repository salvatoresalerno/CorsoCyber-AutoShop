import Image from "next/image";
import logoImage from '@/public/logo.png'
import Link from "next/link";

import { SignUpForm } from "@/components/form-signup";
import { Ruolo } from "@/lib/types";

export default async function LoginPage() {
    

    return (
        <div className="min-h-screen flex flex-col bg-[#f5f7f8]">
            <div className="flex justify-center mt-10">
                <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg px-8 py-6 max-w-md md:min-w-96"> 
                    <Link href="/" className="flex justify-center">
                        <Image src={logoImage} alt="logo" className="w-20" priority/>
                    </Link> 
                    <h1 className="text-2xl font-bold text-center  pt-4">Benvenuto, </h1>
                    <h1 className="text-2xl font-bold text-center mb-4 pb-4">
                        registrati ad Auto-Shop.it
                    </h1>
                    <SignUpForm ruolo={Ruolo.USER}/>
                </div>
            </div>
        </div>
      );    
}