 
import { headers } from "next/headers";
import Link from "next/link";
import logoImage from '@/public/logo.png'
import Image from "next/image";
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarComponent } from "@/components/sidebarComponent";


export default function PublicLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {

    //recupero cookie admin con dati
    //const adminSession = cookies().get('adminSession')?.value;
    //const admin: Utente | null = adminSession ? JSON.parse(adminSession) : null;  //<-- tipo Omit che crea alias di Utente ma senza campo password!!!
    //const admin = null


    //recupero User eventualmente esistente in headers
      const currentHeaders = headers();
      const currentAdminHeader = currentHeaders.get('X-Current-User');
      const currentAdmin = currentAdminHeader ? JSON.parse(currentAdminHeader) : null;
    
    
    
    
    
    return (
      <SidebarProvider>
        <SidebarComponent />
          <main className="w-full">  
            
            <nav className="flex items-center bg-white shadow-bottom-only sticky top-0 z-50">    
              <SidebarTrigger />
              <div className="flex flex-col justify-between items-center sm:flex-row container mx-auto py-2">
                <div className="flex items-center gap-2">   
                                 
                  <Link href={'/admin'}>
                      <Image src={logoImage} alt="logo" className="w-20" priority/>
                  </Link>                     
                  <h1 className="text-2xl font-bold">
                      Dashboard Auto-Shop.it
                  </h1>
                </div>
                {currentAdmin && <h2 className="text-2xl font-medium">
                  Benvenuto, <span className="font-bold">{currentAdmin.username}</span>
                </h2>}
              </div>
            </nav> 
            {children} 
          </main>
      </SidebarProvider>
    );
  }