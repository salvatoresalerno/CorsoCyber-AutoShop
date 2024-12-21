

import logoImage from '@/public/logo.png'
import Image from 'next/image'
import Link from 'next/link'
import { FaWhatsapp } from 'react-icons/fa'
import { MdOutlineEmail, MdPhone } from 'react-icons/md'
import { RxHome } from 'react-icons/rx'



export default function FooterUser() {

return (<>
    <div className="bg-zinc-300 pt-4 px-4">
        <div className='flex flex-col sm:flex-row'> 
            <div className="flex items-center justify-center gap-2 w-full sm:w-1/3 p-4">
                <Link href={'/'}>
                    <Image src={logoImage} alt="logo" className="w-20 rounded-lg" priority/>
                </Link> 
                <span className='font-semibold'>Auto Shop s.r.l</span>
            </div>  
            <div className="flex flex-col items-center w-full sm:w-1/3 p-4">
                <h2 className='font-semibold text-xl uppercase mb-3 sm:mb-10'>LINK</h2>
                <div className='flex flex-col items-center justify-center gap-3'>
                    <Link href="\#about" className="font-medium  uppercase hover:underline underline-offset-4">
                        Chi siamo
                    </Link>
                    <Link href="\#vetrina" className="font-medium uppercase hover:underline underline-offset-4">
                        vetrina
                    </Link>
                    <Link href="\#contatti" className="font-medium uppercase hover:underline underline-offset-4">
                        Contatti
                    </Link>
                </div>
            </div>
            <div className="flex flex-col items-center w-full sm:w-1/3 p-4">
                <h2 className='font-semibold text-xl uppercase mb-3 sm:mb-10'>Contatti</h2>
                <div className='flex flex-col items-center justify-center gap-3'>
                    <div className="flex items-center gap-2">
                      <RxHome /> 
                      <div className="flex flex-col xl:flex-row">
                        <span>Via scappa scappa, 113</span>
                        <span>{"70056 - Molfetta (Ba)"}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2"><MdOutlineEmail /> <span>servizio.clienti@autoshop.it</span></div>
                    <div className="flex items-center gap-2"><MdOutlineEmail /> <span>autosalone@autoshop.it</span></div>

                    <div className="flex gap-3 sm:flex-col">
                        <span className='flex items-center gap-2'><MdPhone /> <span>080 / 1234567</span></span>
                        <span className='sm:hidden'>-</span>
                        <span className="flex items-center gap-2"><FaWhatsapp /> <span>333 / 88776655</span></span>
                    
                    </div>
                </div>
            </div>
        </div>
        <div className='text-xs text-center py-1 border-t border-zinc-400'>Copyright © 2024 - powered by Salvatore Salerno -</div>
    </div>
    
    </>)

}