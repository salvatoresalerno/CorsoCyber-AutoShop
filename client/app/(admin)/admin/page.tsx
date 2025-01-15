import Image from "next/image";
import Link from "next/link";
import logoImage from '@/public/logo.png'
import { LoginForm } from "@/components/form-login";
import { Ruolo } from "@/lib/types";


export default function LoginAdmin() {
    return (
      <div className="min-h-screen flex flex-col bg-[#f5f7f8]">
          <div className="flex justify-center mt-10">
              <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg px-8 py-6 max-w-md md:min-w-96"> 
                  <Link href="/" className="flex justify-center">
                      <Image src={logoImage} alt="logo" className="w-20" priority/>
                  </Link> 
                  <h1 className="text-2xl font-bold text-center pt-4">
                      Pannello Amministrazione
                  </h1>
                  <h1 className="text-2xl font-bold text-center mb-4 pb-4">
                      Auto-Shop.it
                  </h1>
                  <LoginForm ruolo={Ruolo.ADMIN} />
              </div>
          </div>
      </div>
    );     
}



 