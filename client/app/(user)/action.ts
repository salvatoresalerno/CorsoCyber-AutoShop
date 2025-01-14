
'use server'
 
import { SignupFormInputs } from "@/components/form-signup";
import { ProfileFormInputs } from "@/components/profileComponent";
import { DataFilterResult, FilterParams, Profilo, ResponseResult, UserDataResult } from "@/lib/types";
import { cookies } from 'next/headers';
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";






/* export const filtraVeicoli = async (params: FilterParams): Promise<VeicoloWithImg[] | VeicoliSuggeriti> => {
  const veicoli = await getCachedVeicoli();

  const veicoliFiltrati =  veicoli.filter((veicolo) => {
      const matchesTipo = params.tipo ? veicolo.tipo === params.tipo : true;
      const matchesBrand = params.brand ? veicolo.brand === params.brand : true;
      const matchesModel = params.model ? veicolo.modello === params.model : true;
      const matchesAlim = params.alim ? veicolo.alimentazione === params.alim : true;
      const matchesAnno = params.anno ? veicolo.anno === params.anno : true;

      const matchesKm = params.km ? (veicolo.kilometri >= params.km.valueA && veicolo.kilometri <= params.km.valueB) : true;
      const matchesPrezzo = params.prezzo ? (veicolo.prezzo >= params.prezzo.valueA && veicolo.prezzo <= params.prezzo.valueB) : true;

      return matchesTipo && matchesBrand &&  matchesModel &&  matchesAlim &&  matchesAnno && matchesKm && matchesPrezzo;
  });

  if (veicoliFiltrati.length > 0) {  //ricerca con successo

    return veicoliFiltrati;  

    //return veicoliFiltrati;
  } else {  //effettuo ricerca senza km, prezzo, anno, alimentazione  --> veicoli suggeriti
    const veicoliSuggeriti =  veicoli.filter((veicolo) => {
      const matchesTipo = params.tipo ? veicolo.tipo === params.tipo : true;
      const matchesBrand = params.brand ? veicolo.brand === params.brand : true;
      const matchesModel = params.model ? veicolo.modello === params.model : true;      

      return matchesTipo && matchesBrand &&  matchesModel ;
    }).sort((a, b) => a.anno - b.anno);  //veicoli ordinato con anno crescente

    const result:VeicoliSuggeriti = {veicoli: veicoliSuggeriti, suggerito: true}


    return result;
  }
}
 */





export async function logoutUserAction(id: string) {
  try {
    const response = await fetch('http://localhost:5000/api/auth/logout', {
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
      secure: true,
      sameSite: 'strict',
      value: '',
      path: '/',
      maxAge: -1, // imposto scadenza immediata
    });
    cookies().set({
      name: 'refreshToken',
      httpOnly: true,
      secure: true,
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
      secure: true,
      sameSite: 'strict',
      value: '',
      path: '/',
      maxAge: -1, // imposto scadenza immediata
    });
    cookies().set({
      name: 'refreshToken',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      value: '',
      path: '/',
      maxAge: -1, // imposto scadenza immediata
    });
  }
}



export const SignUpAction = async (formData: SignupFormInputs, ruolo: string | null = null, update?: boolean): Promise<ResponseResult> => {

  const id = formData.id;  // ? formData.id : null;
  const username = formData.username;
  const email = formData.email;
  const password = formData.password;
  const confirmPassword = formData.confirmPassword;
  
  try {
    let response;
    if (!update) {
      response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, confirmPassword, ruolo }),
      }); 
    } else {
      const token = cookies().get("token")?.value;
      response = await fetch('http://localhost:5000/api/auth/updAdmin', {
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
      //error: err instanceof Error ? err.message : "Errore durante la registrazione"
    }
  }
} 





 

/* export async function getAvatar() {
  const avatarUrl = 'https://thispersondoesnotexist.com';

  try {
     const response = await fetch(avatarUrl, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache', //non preleva da cache ma solo da richiesta
      },
    });  

    

    console.log('response: ', response)
    

    if (!response.ok) {
      throw new Error('Nessuna immagine ricevuta');
    }

     
    const imageBlob = await response.blob(); // Converti la risposta in un blob
console.log('blob: ', imageBlob)

    //const imageObjectURL = URL.createObjectURL(imageBlob); // Crea un URL oggetto dal blob

    return imageBlob;

  } catch (error) {
    console.error('Impossibile recuperare immagine:', error);
    throw new Error('Impossibile recuperare immagine');
  }
} */





 
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
  
  const res = await fetch('http://localhost:5000/api/auth/getCurrentUser', { 
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
      
      const refreshRes = await fetch('http://localhost:5000/api/auth/refresh', { 
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
    
    const res = await fetch('http://localhost:5000/api/veicoli/getFilteredVeicoli', {
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
      const res = await fetch(`http://localhost:5000/api/veicoli/setVenduto`, {
        method: 'PUT',
        headers: {    
          'Content-Type': 'application/json',   
          Cookie: `token=${token}; `
        },
        body: JSON.stringify({ id }),
      });

      console.log('risposta: ', res)

      if (!res.ok) {
        return {
          message: '',
          error: 'errore aggiornamento veicolo'
        }
      }

      return await res.json();
    
    } catch (error) {
      console.log('errore status: ', error)
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
    const res = await fetch(`http://localhost:5000/api/user/getProfilo/${username}`, {
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
    console.log('errore profilo: ', error)
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
      const res = await fetch('http://localhost:5000/api/user/setProfilo', {
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
      console.log('errore profilo: ', error)
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
   
      const response = await fetch('http://localhost:5000/api/user/updProfilo', {
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

export async function geAvatar(username: string | undefined)/* : Promise<UserDataResult> */ {

  const token = cookies().get("token")?.value;
  if(!token || !username) {  
    redirect('/login');      
  }

  try {
    const res = await fetch(`http://localhost:5000/api/user/getProfileImage/${username}`, {
      method: 'GET',
      headers: {       
        Cookie: `token=${token}; `
      },
    });

    const resultData = await res.json();

    console.log('Avatar da get: ', resultData)

     return {
      data: resultData.data[0] as { image: string },
      error: resultData.error  as string 
    }  

  
  } catch (error) {
    console.log('errore profilo: ', error)
    return {
      data: null,
      error: 'errore recupero profilo'
    }
  }
}






















