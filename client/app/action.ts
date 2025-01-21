
'use server'


import { MailData } from "@/components/cardComponent_V2";
import { ContattiFormInputs } from "@/components/form-contatti";
import { DataResult, ResponseResult, Stato, User } from "@/lib/types";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL  + '/v1';
//const api_BaseUrl = process.env.NEXT_API_URL;  //chiamate api route interne


//preleva i veicoli in base allo stato: venduto/inVendita
export async function getVeicoliStato(stato: Stato): Promise<DataResult> {
    
  try {
    const res = await fetch(`${apiBaseUrl}/api/veicoli/getVeicoliStato/${stato}`, {
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

  if(!refreshToken) {
    return NextResponse.json({
      user: null,
      error: 'Token mancante',
      token: null,
      refreshToken: null
    });
  }

  const refreshRes = await fetch(`${apiBaseUrl}/api/auth/refresh`, { 
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
    const res = await fetch(`${apiBaseUrl}/api/auth/getAuth`, { 
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
    }
    
    return NextResponse.json({
      error:  '',
      isAuth: true
    });  

  } catch (error) {
    console.error('errore: ', error);
    return NextResponse.json({
      error: 'Impossibile rinnovare',
      token: null,
      refreshToken: null
    });
  }
}


export async function sendOrderMail(mailData: MailData): Promise<ResponseResult> {
  const apiBaseRouteApiUrl = process.env.ORIGIN_API_URL;


  try {
    const response = await fetch(`${apiBaseRouteApiUrl}/api/sendMail`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({                    
          text: `<p>Il sig. <strong>${mailData.username}</strong> ha effettuato un nuovo ordine.</p>
                <p>Veicolo ordinato: ${mailData.brand} ${mailData.modello}</p>
                <p>immatricolazione: ${mailData.anno}</p>
                <p>Alimentazione: ${mailData.alimentazione}</p>`
      }),
    });


    if (response.ok) {
      return {
        message: 'Ordine ricevuto con successo!',
        error: ''
      }
    } else {
      return {
        message: '',
        error: "Errore durante l'elaborazione dell'ordine."
      }
    } 
  } catch (error) {
    console.error('errore invio ordine: ', error);
      return {
        message: '',
        error: 'errore invio ordine'
      }
  }

  
}
export async function sendContattiMail(mailData: ContattiFormInputs): Promise<ResponseResult> {
   
  const apiBaseRouteApiUrl = process.env.ORIGIN_API_URL;
  try {
    const response = await fetch(`${apiBaseRouteApiUrl}/api/sendInfo`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({                    
          text: `<p>Il sig. <strong>${mailData.nome}</strong> ha richiesto informazioni.</p>
                  <br />
                  <p ><strong>Contatti:</strong></p>
                  <ul>
                  <li><strong>Email:</strong> <a href="mailto:${mailData.email}">${mailData.email}</a></li>
                  <li><strong>Telefono:</strong> ${mailData.telefono}</li>
                  </ul> 
                  <br />
                  <p><strong>Messaggio</strong></p>
                  <p>${mailData.messaggio}</p>`
      }),
    });     

    if (response.ok) {
      return {
        message: 'Rischiesta INFO ricevuta con successo!',
        error: ''
      }
    } else {
      return {
        message: '',
        error: "Errore durante richiesta INFO."
      }
    } 
  } catch (error) {
    console.error('errore richiesta INFO: ', error);
      return {
        message: '',
        error: 'errore richiesta INFO'
      }
  }  
}