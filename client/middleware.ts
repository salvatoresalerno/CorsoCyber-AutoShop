import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from './app/(user)/action';
import { Ruolo } from './lib/types';
import { getAuthenticate } from './app/action';



const REFRESH_TOKEN_EXPIRY =  Number(process.env.REFRESH_TOKEN_EXPIRY) || 7 * 24 * 60 * 60 * 1000;


export async function middleware(request: NextRequest) {

  const response = NextResponse.next();


  if (request.nextUrl.pathname.startsWith('/admin/dashboard')  && request.method === 'POST') {  //intercetto server action del ramo admin/dasboard
    
    const getAuthResponse = await getAuthenticate();
    
    const {token, refreshToken, isAuth, error} = await getAuthResponse.json();

    if (error) {   //cancello i cookie e poi passo alla server action che non troverà i cookie e mi manda al login
      response.cookies.delete('token');
      response.cookies.delete('refreshToken');

      return response;
    }

    if (isAuth) return;

    if (token && refreshToken) {
      response.cookies.set('token', token, {
        httpOnly: true,
        secure: false, //process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        //senza scadenza (session)
      });

      response.cookies.set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,   
        sameSite: 'strict',
        path: '/',
        maxAge: REFRESH_TOKEN_EXPIRY,
      });
    }  

    return response;
  }

  //qui sto gestendo una route e non una server action

  const res = await getCurrentUser(); 
  const { user, token, refreshToken } = await res.json();

  console.log('user, token, refreshT: ', user, token, refreshToken);

  if (token) {
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: false, //process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      //senza scadenza (session)
    });
  }

  if (refreshToken) {
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,   
      sameSite: 'strict',
      path: '/',
      maxAge: REFRESH_TOKEN_EXPIRY,
    });
  }

  const requestHeaders = new Headers(request.headers);
  if (user) {
    requestHeaders.set('X-Current-User', JSON.stringify({ id: user.id, username: user.username, email: user.email, role: user.role }));
  } else {
    requestHeaders.delete('X-Current-User'); // Rimuovo l'header se non c'è un utente
  }

  response.headers.set('X-Current-User', requestHeaders.get('X-Current-User') || '');
  response.headers.set('Cache-Control', 'no-store');

  if(request.nextUrl.pathname==='/' || request.nextUrl.pathname.startsWith('/risultati')) {   
    return response       
  }

  if (user && user.role === Ruolo.USER && request.nextUrl.pathname.startsWith('/private')){  //solo per user
    return response;
  }

  if (user && ((user.role === Ruolo.ADMIN) || (user.role === Ruolo.SUPERADMIN)) && request.nextUrl.pathname.startsWith('/admin/dashboard')){  //solo per admin
    return response;
  }

  if (request.nextUrl.pathname.startsWith('/admin/dashboard')) {
    return NextResponse.redirect(new URL('/admin', request.url));
  } else {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
}

  
export const config = {
  matcher: ['/', '/risultati/:path*', '/private/:path*', '/admin/dashboard/:path*'],
}; 



  