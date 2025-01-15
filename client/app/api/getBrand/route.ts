import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {

    const token = cookies().get("token")?.value;

    try {
        const res = await fetch('http://localhost:5000/api/veicoli/brand', {
            method: 'GET',
            //credentials: 'include', 
           /*  headers: {
                Cookie: `token=${token}; `, // Passa il cookie manualmente
            },  */
        });


        if (res.status === 401) {
                return Response.json({
                    brand: null,
                    error: 'Token Scaduto!',
                    
                }); 
        }
        const data = await res.json();  //tutto ok
        cookies().set('ciccio', 'AWEEEEEE', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/',
        });
        return Response.json({
        brand: data,
        error: null,
        
        });   

        
    } catch (error) {
        console.error('Errore:', error);
        return Response.json({
            brand: null,
            error: 'ci sono errori!',
            
        });   
    }
}