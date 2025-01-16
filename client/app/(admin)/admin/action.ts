
'use server'
 
import { ExtendedUser, ResponseResult, Veicolo } from "@/lib/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;


export async function getBrandAndModel() {
  const token = cookies().get("token")?.value;
  if(!token) {  //se qui manca token è perchè il middleware lo ha rimosso per manomissione, altrimenti qui ho un cookie valido (se usata lato client)
    redirect('/admin');      
  }

  try {
    const res = await fetch(`${apiBaseUrl}/api/veicoli/brand_model`, {
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
    console.error('errore status: ', error)
    return {
      data: null,
      error: 'errore recupero veicoli'
    }
  }

}





export async function getBrand() {
  const token = cookies().get("token")?.value;   

  if(!token) {  //se qui manca token è perchè il middleware lo ha rimosso per manomissione, altrimenti qui ho un cookie valido
    redirect('/admin');  
    
  }

  try {
    const res = await fetch(`${apiBaseUrl}/api/veicoli/brand`, {
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
    console.error('errore status: ', error)
    return {
      data: null,
      error: 'errore recupero veicoli'
    }
  }
}

 

export async function uploadImageWithData(formData: FormData, id?: string) {

  const token = cookies().get("token")?.value;
  if(!token) {  
    redirect('/admin');      
  }

  try {
    let response;
    if (!id) {  //salva
      response = await fetch(`${apiBaseUrl}/api/veicoli/addVeicolo`, {
        method: 'POST',
        body: formData,
        headers: {       
          Cookie: `token=${token}; `
        },
      });
    } else {
      response = await fetch(`${apiBaseUrl}/api/veicoli/updVeicolo`, {
        method: 'PUT',
        body: formData,
        headers: {       
          Cookie: `token=${token}; `
        },
      });
    }

    const  result:ResponseResult = await response.json();

    return result;
     

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
    const res = await fetch(`${apiBaseUrl}/api/veicoli/getVeicolo/${id}`, {
      method: 'GET',
      headers: {       
        Cookie: `token=${token}; `
      },
    });

    const resultData = await res.json()

    return {
      data: resultData.data as Veicolo,
      error: resultData.error as string
    }

  
  } catch (error) {
    console.error('errore status: ', error)
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
      const res = await fetch(`${apiBaseUrl}/api/veicoli/deleteVeicolo`, {
        method: 'DELETE',
        headers: {    
          'Content-Type': 'application/json',   
          Cookie: `token=${token}; `
        },
        body: JSON.stringify({ id }),
      }); 

      if (!res.ok) {
        return {
          message: '',
          error: 'errore cancellazione veicolo'
        }
      }

      return await res.json();
    
    } catch (error) {
      console.error('errore cancellazione: ', error)
      return {
        message: '',
        error: 'errore cancellazione veicolo'
      }
    }
}

export async function loadUserList() {
  const token = cookies().get("token")?.value;
  if(!token) {  
    redirect('/admin');      
  }

  try {
    const res = await fetch(`${apiBaseUrl}/api/admin/getUsers`, {
      method: 'GET',
      headers: {       
        Cookie: `token=${token}; `
      },
    });

    const resultData = await res.json();

    return {
      data: resultData.data as ExtendedUser[],
      error: resultData.error as string
    }

  
  } catch (error) {
    console.error('errore status: ', error)
    return {
      data: null,
      error: 'errore recupero lista Utenti'
    }
  }
}

export async function setBanned(id: string, banned: number): Promise<ResponseResult> {
  
  const token = cookies().get("token")?.value;
  if(!token) {  
    redirect('/login');      
  }
  try {
      const res = await fetch(`${apiBaseUrl}/api/admin/setBanned`, {
        method: 'PUT',
        headers: {    
          'Content-Type': 'application/json',   
          Cookie: `token=${token}; `
        },
        body: JSON.stringify({ id, banned }),
      });     

      if (!res.ok) {
        return {
          message: '',
          error: 'errore aggiornamento stato Ban'
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

export async function deleteAdminByID(id: string): Promise<ResponseResult> {
  if (!id) {
    return {
      message: '',
      error: 'errore cancellazione Admin'
    }
  }
  const token = cookies().get("token")?.value;
  if(!token) {  
    redirect('/login');      
  }
  try {
      const res = await fetch(`${apiBaseUrl}/api/admin/delAdmin`, {
        method: 'DELETE',
        headers: {    
          'Content-Type': 'application/json',   
          Cookie: `token=${token}; `
        },
        body: JSON.stringify({ id }),
      }); 

      if (!res.ok) {
        return {
          message: '',
          error: 'errore cancellazione Admin'
        }
      }

      return await res.json();
    
    } catch (error) {
      console.error('errore cancellazione: ', error)
      return {
        message: '',
        error: 'errore cancellazione Admin'
      }
    }
}

  
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

  redirect('/admin'); 
}  




