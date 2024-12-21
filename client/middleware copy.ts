import { NextRequest, NextResponse } from 'next/server';
//import { Ruolo } from './database/DB';
import { getCurrentUser } from './app/(user)/action';
import { Ruolo } from './lib/types';
import { refreshProcess } from './app/action';



const REFRESH_TOKEN_EXPIRY =  Number(process.env.REFRESH_TOKEN_EXPIRY) || 7 * 24 * 60 * 60 * 1000;


  export async function middleware(request: NextRequest) {
    const response = NextResponse.next();

    /* if (request.nextUrl.pathname.startsWith('/api')) {
      console.log('Sono una API')
    } */

      console.log('sto nel middleware')

      console.log("Pathname:", request.nextUrl.pathname, request.url);
    console.log("Metodo:", request.method);


//creo action che invia il token al BE per validarlo, se scaduto restituisce 401 e parte refresh poi aggiornamneto cookie,
//se corrotto restituisce errore
//chiunque passa dal middleware --> prima di eseguire azioni valuta il token
//le action saranno eseguite sicuramente con token validi
//le pagine riceveranno il currentUser



    if (request.nextUrl.pathname.startsWith('/admin/dashboard') && request.method === 'POST') {
      console.log('beccata server action')
      //qui posso controllare i token ed eventualmente fare refresh ed aggiornare i cookie. dopo viene eseguita la action.
      //const ppp = await refreshProcess(data.payload)

      

      return NextResponse.next(); // Salta il middleware per le Server Actions del ramo /admin/dashboard/
    }



   /*  if (request.url.includes('/admin/dashboard/aggiungi') && request.method === 'POST') {
      return NextResponse.next(); // Salta il middleware per le Server Actions del ramo /admin/dashboard/
  } */


    const res = await getCurrentUser(); 
    const { user, token, refreshToken } = await res.json();

    if (token) {
      response.cookies.set('token', token, {
        httpOnly: true,
        secure: true, //process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        //senza scadenza (session)
      });
    }
  
    if (refreshToken) {
      response.cookies.set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,   
        sameSite: 'strict',
        path: '/',
        maxAge: REFRESH_TOKEN_EXPIRY,
      });
    }

    const requestHeaders = new Headers(request.headers);
    if (user) {
      requestHeaders.set('X-Current-User', JSON.stringify({ id: user.id, username: user.username, email: user.email, role: user.role }));
    } else {
      requestHeaders.delete('X-Current-User'); // Rimuovi l'header se non c'è un utente
    }

    response.headers.set('X-Current-User', requestHeaders.get('X-Current-User') || '');
 

    if(request.nextUrl.pathname==='/') {  //sperimentale
      return response       
    }

    if (user && user.role === Ruolo.USER && request.nextUrl.pathname.startsWith('/private')){  //solo per user
      return response;
    }

    if (user && user.role === Ruolo.ADMIN && request.nextUrl.pathname.startsWith('/admin/dashboard')){  //solo per admin
      return response;
    }

    if (request.nextUrl.pathname.startsWith('/admin/dashboard')) {
      return NextResponse.redirect(new URL('/admin', request.url));
    } else {//if (req.nextUrl.pathname.startsWith('/private')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
   
  }
  
   
  export const config = {
    matcher: ['/', '/private/:path*', '/admin/dashboard/:path*', /* '/api/:path*' */],
    //matcher: ['/:path*'], //tutte le route <-- vedere se impostare questo
  }; 



  //'/((?!actions).*)'