
'use server'
 
import { SignupFormInputs } from "@/components/form-signup";
import { ProfileFormInputs } from "@/components/profileComponent";
import { DataFilterResult, FilterParams, Profilo, ResponseResult, UserDataResult } from "@/lib/types";
import { cookies } from 'next/headers';
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL + '/v1';

export async function logoutNoUser() {
  cookies().set({
    name: 'token',
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    value: '',
    path: '/',
    maxAge: -1, // imposto scadenza immediata
  });
  cookies().set({
    name: 'refreshToken',
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    value: '',
    path: '/',
    maxAge: -1, // imposto scadenza immediata
  });
}

export async function logoutUserAction(id: string) {
  try {
    const response = await fetch(`${apiBaseUrl}/api/auth/logout`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    const  result: ResponseResult = await response.json();
    //rimuovo i cookie con qualsiari risposta ricevuta. In questo scenario non gestisco i messaggi di logout
    cookies().set({
      name: 'token',
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      value: '',
      path: '/',
      maxAge: -1, // imposto scadenza immediata
    });
    cookies().set({
      name: 'refreshToken',
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      value: '',
      path: '/',
      maxAge: -1, // imposto scadenza immediata
    });

    return result;

  } catch (err: unknown) {   //se ci sono errori per sicurezza rimuovo comunque i cookie 
    console.error("Erroi durante il logout:", err);
    cookies().set({
      name: 'token',
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      value: '',
      path: '/',
      maxAge: -1, // imposto scadenza immediata
    });
    cookies().set({
      name: 'refreshToken',
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      value: '',
      path: '/',
      maxAge: -1, // imposto scadenza immediata
    });
  }
}



export const SignUpAction = async (formData: SignupFormInputs, ruolo: string | null = null, update?: boolean): Promise<ResponseResult> => {

  const id = formData.id;  
  const username = formData.username;
  const email = formData.email;
  const password = formData.password;
  const confirmPassword = formData.confirmPassword;
  
  try {
    let response;
    if (!update) {
      response = await fetch(`${apiBaseUrl}/api/auth/signup`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, confirmPassword, ruolo }),
      }); 
    } else {
      const token = cookies().get("token")?.value;
      response = await fetch(`${apiBaseUrl}/api/auth/updAdmin`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}; `
        },    
        body: JSON.stringify({id, username, email, password, confirmPassword}),
      }); 
    }
    

    const  result:ResponseResult = await response.json();

    return result;    
  } catch (err) {
    console.error("Erroi durante la registrazione:", err);
    return {
      message: "",
      error: "Errore durante la registrazione"
    }
  }
} 


 
export async function getCurrentUser() {
   
  const token = cookies().get("token")?.value;

  if(!token) {
    return NextResponse.json({
      user: null,
      error: 'Token mancante',
      token: null,
      refreshToken: null
    });    
  }
  
  const res = await fetch(`${apiBaseUrl}/api/auth/getCurrentUser`, { 
    method: 'POST',
    //credentials: 'include', 
    headers: {
      Cookie: `token=${token}; `, // Passa il cookie manualmente
    }, 
  });

   
  if (res.status === 401) {
    const data = await res.json();
    const refreshToken = cookies().get("refreshToken")?.value;
      if(!refreshToken) {
        return NextResponse.json({
          user: null,
          error: 'Token mancante',
          token: null,
          refreshToken: null
        })
      }
      
      const refreshRes = await fetch(`${apiBaseUrl}/api/auth/refresh`, { 
        method: 'POST', credentials: 'include', 
        headers: {
          "Content-Type": "application/json",
          Cookie: `refreshToken=${refreshToken}; `
        },
        body: JSON.stringify({ user_id: data.payload.id, username: data.payload.username, email: data.payload.email, role: data.payload.role }),
      });

      if (!refreshRes.ok) {
          return NextResponse.json({
            user: null,
            error: 'Impossibile rinnovare',
            token: null,
            refreshToken: null
          });
      }

      const dataRefresh = await refreshRes.json();

      const response = NextResponse.json({  //restituisco l'utente del payload del jwt scaduto per non perdere connesione
        user: {id:data.payload.id, username: data.payload.username, email: data.payload.email, role: data.payload.role},
        error: null,
        token: dataRefresh.token,
        refreshToken: dataRefresh.refreshToken
      });
      
      return response; 
  }

  const data = await res.json();  //tutto ok
  return NextResponse.json({
    user: data.user,
    error: data.error,
    token: null,
    refreshToken: null
  });      
}


export async function getFilteredVeicoli(params: FilterParams): Promise<DataFilterResult> {
   
  try {
    
    const res = await fetch(`${apiBaseUrl}/api/veicoli/getFilteredVeicoli`, {
      method: 'POST',       
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),      
    });   
    
    if (!res.ok) {
      throw new Error('Errore nel recupero dei dati');
    }

    const result:DataFilterResult = await res.json();

    return result;
    
  } catch (err) {
    return {
      data: null,
      suggerito: false,
      error: err instanceof Error ? err.message : "Errore Inaspettato"
    }
  }
}


export async function setVeicoloVenduto(id: string): Promise<ResponseResult> {
  if (!id) {
    return {
      message: '',
      error: 'errore aggiornamento veicolo'
    }
  }
  const token = cookies().get("token")?.value;
  if(!token) {  
    redirect('/login');      
  }
  try {
      const res = await fetch(`${apiBaseUrl}/api/veicoli/setVenduto`, {
        method: 'PUT',
        headers: {    
          'Content-Type': 'application/json',   
          Cookie: `token=${token}; `
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        return {
          message: '',
          error: 'errore aggiornamento veicolo'
        }
      }

      return await res.json();
    
    } catch (error) {
      console.error('errore status: ', error)
      return {
        message: '',
        error: 'errore aggiornamento veicolo'
      }
    }
}



export async function getProfilo(username: string | undefined): Promise<UserDataResult> {

  const token = cookies().get("token")?.value;
  if(!token || !username) {  
    redirect('/login');      
  }

  try {
    const res = await fetch(`${apiBaseUrl}/api/user/getProfilo/${username}`, {
      method: 'GET',
      headers: {       
        Cookie: `token=${token}; `
      },
    });

    const resultData = await res.json();

    return {
      data: resultData.data as Profilo,
      error: resultData.error as string
    }

  
  } catch (error) {
    console.error('errore profilo: ', error)
    return {
      data: null,
      error: 'errore recupero profilo'
    }
  }
}

export async function setProfilo(formData: ProfileFormInputs): Promise<ResponseResult> {
  
  const token = cookies().get("token")?.value;
  if(!token) {  
    redirect('/login');      
  }

  const id = formData.id;
  const nome = formData.nome;
  const cognome = formData.cognome;
  const via = formData.via;
  const citta = formData.citta;
  const cap = formData.cap;
  const provincia = formData.provincia;
  const telefono = formData.telefono;
  const cellulare = formData.cellulare;

  try {
      const res = await fetch(`${apiBaseUrl}/api/user/setProfilo`, {
        method: 'PUT',
        headers: {    
          'Content-Type': 'application/json',   
          Cookie: `token=${token}; `
        },        
        body: JSON.stringify({id, nome, cognome, via, citta, cap, provincia, telefono, cellulare}),
      });

      if (!res.ok) {        
        return {
          message: '',
          error: 'errore aggiornamento profilo'
        }
      }

      return await res.json();
    
    } catch (error) {
      console.error('errore profilo: ', error)
      return {
        message: '',
        error: 'errore aggiornamento profilo'
      }
    }
}


export async function uploadProfilo(formData: FormData) {

  const token = cookies().get("token")?.value;
  if(!token) {  
    redirect('/admin');      
  }

  try {
   
    const response = await fetch(`${apiBaseUrl}/api/user/updProfilo`, {
      method: 'PUT',
      body: formData,
      headers: {       
        Cookie: `token=${token}; `
      },
    });
     

    const  result:ResponseResult = await response.json();

    return result;     

  } catch (error) {
    console.error('Error in server action:', error);
    return { 
      message: "", 
      error: error instanceof Error ? error.message : 'Errore sconosciuto' 
    };
  }
}

export async function geAvatar(username: string | undefined) {

  const token = cookies().get("token")?.value;
  if(!token || !username) {  
    redirect('/login');      
  }

  try {
    const res = await fetch(`${apiBaseUrl}/api/user/getProfileImage/${username}`, {
      method: 'GET',
      headers: {       
        Cookie: `token=${token}; `
      },
    });

    const resultData = await res.json();

    return {
      data: resultData.data[0] as { image: string },
      error: resultData.error  as string 
    }  

  
  } catch (error) {
    console.error('errore profilo: ', error)
    return {
      data: null,
      error: 'errore recupero profilo'
    }
  }
}






















