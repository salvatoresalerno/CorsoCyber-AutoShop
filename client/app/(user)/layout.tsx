 
import FooterUser from "@/components/footer-user";
import NavBarResponsive from "@/components/navbar-resp";
import React from "react";
import { headers } from "next/headers";
import { geAvatar } from "./action";
import { Ruolo } from "@/lib/types";

 
export default async function PublicLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) { 

   

  //recupero User eventualmente esistente in headers
  const currentHeaders = headers();
  const currentUserHeader = currentHeaders.get('X-Current-User');
  let currentUser = currentUserHeader ? JSON.parse(currentUserHeader) : null;


  if ((currentUser?.role === Ruolo.ADMIN) || (currentUser?.role === Ruolo.SUPERADMIN)) currentUser = null;


  const { data } = currentUser ? await geAvatar(currentUser?.username) : {data: null};
 

  return (
    <main className="min-h-screen flex flex-col bg-[#f5f7f8]">  
      <NavBarResponsive user={currentUser} avatar={data?.image ?? null}/>
      <div className="flex-1">{children}</div>  
      <FooterUser />
    </main>
  );
}