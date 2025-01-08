
'use server'


import { DataResult, Stato, User } from "@/lib/types";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";



//preleva i veicoli in base allo stato: venduto/inVendita
export async function getVeicoliStato(stato: Stato): Promise<DataResult> {
    
  try {
    const res = await fetch(`http://localhost:5000/api/veicoli/getVeicoliStato/${stato}`, {
      method: 'GET',             
    });  

    if (!res.ok) {
      throw new Error('Errore nel recupero dei dati');
    }

    const result:DataResult = await res.json();

    return result;

    } catch (err: unknown) {
      return {
        data: null,
        error: err instanceof Error ? err.message : "Errore Inaspettato"
      }
    }
}



export async function refreshProcess(user: User) {

  const refreshToken = cookies().get("refreshToken")?.value;
  console.log('refreshToken in refreshProcess: ', refreshToken)

  if(!refreshToken) {
    return NextResponse.json({
      user: null,
      error: 'Token mancante',
      token: null,
      refreshToken: null
    });
  }

  const refreshRes = await fetch('http://localhost:5000/api/auth/refresh', { 
    method: 'POST', credentials: 'include', 
    headers: {
      "Content-Type": "application/json",
      Cookie: `refreshToken=${refreshToken}; `
    },
    body: JSON.stringify({ user_id: user.id, username: user.username, email: user.email, role: user.role }),
  });

  if (!refreshRes.ok) {
    return NextResponse.json({
      error: 'Impossibile rinnovare',
      token: null,
      refreshToken: null
    });
  }
  const dataRefresh = await refreshRes.json();

  return NextResponse.json({
    error: null,
    token: dataRefresh.token,
    refreshToken: dataRefresh.refreshToken
  });  
}



export async function getAuthenticate() {
  const token = cookies().get("token")?.value;

  if(!token) {
    return NextResponse.json({
      error: 'Token mancante',
      token: null,
      refreshToken: null
    });    
  }
 
  try {
    const res = await fetch('http://localhost:5000/api/auth/getAuth', { 
      method: 'POST',
      credentials: 'include', 
      headers: {
        Cookie: `token=${token}; `, // Passa il cookie manualmente
      }, 
    });

    if (res.status === 401) {
      const data = await res.json();
      const refreshRes = await refreshProcess(data.payload);

      if (!refreshRes.ok) {
        return NextResponse.json({
          error: 'Impossibile rinnovareX',
          token: '',
          refreshToken: null
        });
      }

      const refreshData = await refreshRes.json();  //tutto ok
       return NextResponse.json({        
        error: refreshData.error,
        token: refreshData.token,
        refreshToken: refreshData.refreshToken
      });   
    }

    //gestisco risposta senza refresh

    const resData = await res.json();  //dati da risposta senza errori

    if (resData.error) {
      return NextResponse.json({
        error:  resData.error,
        isAuth: false
      });
      /* return {
        error: resData.error,
        isisAuth: false
      } */
    }

    
    return NextResponse.json({
      error:  '',
      isAuth: true
    });  

    


  } catch (error) {
    console.log('errore: ', error)
    return NextResponse.json({
      error: 'Impossibile rinnovare',
      token: null,
      refreshToken: null
    });
  }
}