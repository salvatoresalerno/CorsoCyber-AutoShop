
'use server'


 
import { ResponseResult, Veicolo } from "@/lib/types";
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


export async function uploadImageWithData(formData: FormData, id?: string) {

  const token = cookies().get("token")?.value;
  if(!token) {  
    redirect('/admin');      
  }

  try {
    let response;
    if (!id) {  //salva
      response = await fetch('http://localhost:5000/api/veicoli/addVeicolo', {
        method: 'POST',
        body: formData,
        headers: {       
          Cookie: `token=${token}; `
        },
      });
    } else {
      response = await fetch('http://localhost:5000/api/veicoli/updVeicolo', {
        method: 'PUT',
        body: formData,
        headers: {       
          Cookie: `token=${token}; `
        },
      });
    }

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


export async function loadVeicoloById(id: string) {
  const token = cookies().get("token")?.value;
  if(!token) {  
    redirect('/admin');      
  }

  try {
    const res = await fetch(`http://localhost:5000/api/veicoli/getVeicolo/${id}`, {
      method: 'GET',
      headers: {       
        Cookie: `token=${token}; `
      },
    });

    const resultData = await res.json()
//console.log('resultData: ', resultData)

    return {
      data: resultData.data as Veicolo,
      error: resultData.error as string
    }

  
  } catch (error) {
    console.log('errore status: ', error)
    return {
      data: null,
      error: 'errore recupero veicolo'
    }
  }
}

export async function deleteVeicoloByID(id: string): Promise<ResponseResult> {
  if (!id) {
    return {
      message: '',
      error: 'errore cancellazione veicolo'
    }
  }
  const token = cookies().get("token")?.value;
  if(!token) {  
    redirect('/login');      
  }
  try {
      const res = await fetch(`http://localhost:5000/api/veicoli/deleteVeicolo`, {
        method: 'DELETE',
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
          error: 'errore cancellazione veicolo'
        }
      }

      return await res.json();
    
    } catch (error) {
      console.log('errore cancellazione: ', error)
      return {
        message: '',
        error: 'errore cancellazione veicolo'
      }
    }
}

/*
export async function updateNewsClick(id: string): Promise<void> {
   
  if (!validateGuid(id)) {
    //se l'id non è un guid valido, non segnala errori e non apre la pagina
    return;
  } 

    redirect(`/admin/dashboard/news/page-editor/${id}`)
}

export async function deleteNews(id: string): Promise<DbResponse> {
    if (!validateGuid(id)) {
      //se l'id non è un guid valido, genera errore
      throw new Error('Errore durante la cancellazione dei dati - code: V400');
    }
    const supabaseClient =  createClient();
    try {
      const { error } = await supabaseClient
        .from('news')
        .delete()
        .eq('id', id)
      if (error) {  
        throw new Error(`Errore durante la cancellazione dei dati - code: ${error.code}`);
      } else {
        return {
          message: 'News cancellata correttamente',
          error: null,
        }
      }
    } catch (err) {  
      const errorDB: ErrorDB = err instanceof Error ? {message: err.message} : {message: 'Unknown error occurred', code: 999}
  
      return {
          message: null,
          error: errorDB,
      };
    }

}    
*/




























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




