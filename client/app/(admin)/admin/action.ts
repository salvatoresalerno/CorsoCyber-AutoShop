
'use server'


 
import { ResponseResult } from "@/lib/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


export async function getBrandAndModel() {
  const token = cookies().get("token")?.value;
  if(!token) {  //se qui manca token è perchè il middleware lo ha rimosso per manomissione, altrimenti qui ho un cookie valido (se usata lato client)
    redirect('/admin');      
  }

  try {
    const res = await fetch('http://localhost:5000/api/veicoli/brand_model', {
      method: 'GET',
      headers: {       
        Cookie: `token=${token}; `
      },
    });

    const resultData = await res.json()
    return {
      data: resultData.data,
      error: null
    }
  } catch (error) {
    console.log('errore status: ', error)
    return {
      data: null,
      error: 'errore recupero veicoli'
    }
  }

}





export async function getBrand() {
  console.log('ciao sono Pluto')
  const token = cookies().get("token")?.value;

  //console.log('token in getPluto: ', token)

  if(!token) {  //se qui manca token è perchè il middleware lo ha rimosso per manomissione, altrimenti qui ho un cookie valido
    console.log('Qui manca il token!!!');
    redirect('/admin');  
    
  }

  try {
    const res = await fetch('http://localhost:5000/api/veicoli/brand', {
      method: 'GET',
      headers: {       
        Cookie: `token=${token}; `
      },
    });

    const resultData = await res.json()
    return {
      data: resultData.data,
      error: null
    }

    //console.log('dati in risposta da refresh: ', data)

    //return data;
  } catch (error) {
    console.log('errore status: ', error)
    return {
      data: null,
      error: 'errore recupero veicoli'
    }
  }
}

//solo brand: SELECT DISTINCT brand FROM veicoli;
//modelliassociati ai brand: SELECT DISTINCT modello FROM veicoli WHERE brand = 'NomeDelBrand';


export async function uploadImageWithData(formData: FormData) {   
  try {
    
    const response = await fetch('http://localhost:5000/api/images/upload', {
      method: 'POST',
      body: formData,
    });

    const  result:ResponseResult = await response.json();

    return result;

    /* if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error uploading image');
    }

    const data = await response.json();
    return { success: true, data }; */

  } catch (error) {
    //console.error('Error in server action:', error);
    return { 
      message: "", 
      error: error instanceof Error ? error.message : 'Errore sconosciuto' 
    };
  }
}



























/* export const loginAdminActionCookie = async (formData: SigninFormInputs) => {
     
    const username = formData.email;
    const password = formData.password;
  
      const admin = DB.utenti.find(     //ricerca dei dati nella tab. utente --> simulata 
      (utente) => utente.username === username && utente.password === password && utente.ruolo === Ruolo.ADMIN
    ); rimosso per evitare errori, rivedere !!!  
     
  
    if (!admin) {
      return {
        message: 'Username o password non corretti',
        success: false
      } 
    }
  
    cookies().set({
      name: 'adminSession',
      value: JSON.stringify({ username: admin.email, ruolo: admin.ruolo }),
      httpOnly: true,
      path: '/admin',
      maxAge: 60 * 60 * 24, // 1 giorno
    });
    
    return { 
      message: 'Login eseguito con successo',
      success: true
    };
  }*/
  
  export async function logoutAdminAction() {
    // Rimuove il cookie di sessione
    cookies().set({
      name: 'token',
      value: '',
      path: '/',
      maxAge: -1, // imposto scadenza immediata
    });
    cookies().set({
      name: 'refreshToken',
      value: '',
      path: '/',
      maxAge: -1, // imposto scadenza immediata
    });

    redirect('/admin')
    
    //return { success: true, message: 'Logout eseguito con successo' };
  }  




