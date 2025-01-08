 
import FooterUser from "@/components/footer-user";
import NavBarResponsive from "@/components/navbar-resp";
import React from "react";
import { headers } from "next/headers";

 
export default async function PublicLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) { 

   

  //recupero User eventualmente esistente in headers
  const currentHeaders = headers();
  const currentUserHeader = currentHeaders.get('X-Current-User');
  const currentUser = currentUserHeader ? JSON.parse(currentUserHeader) : null;

   

  return (
    <main className="min-h-screen flex flex-col bg-[#f5f7f8]">  
      <NavBarResponsive user={currentUser}/>
      <div className="flex-1">{children}</div>  
      <FooterUser />
    </main>
  );
}