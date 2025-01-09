
import Link from "next/link"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { FaRegUser } from "react-icons/fa";
import logoImage from '@/public/logo.png'
import Image from "next/image";
import UserMenu from "./user-menu";
import { User } from "@/lib/types";



type NavBarProps = {
  user: User | null;
  avatar: string | null;
}


export default function NavBarResponsive({user, avatar}:NavBarProps) {
  return (
    <div className="w-full bg-white shadow shadow-gray-300  px-6 ">
      <div className=" container mx-auto flex items-center justify-between">
        <Link href={'/'}>
            <Image src={logoImage} alt="logo" className="w-20" priority/>
        </Link> 
        
        <div className="hidden md:flex gap-4">
          <ul className="flex items-center gap-4">
              <li className="text-blueShop font-semibold uppercase"><Link href="\#about">Chi siamo</Link></li>
              <li className="text-blueShop font-semibold uppercase"><Link href="\#vetrina">vetrina</Link></li>
              <li className="text-blueShop font-semibold uppercase"><Link href="\#contatti">Contatti</Link></li>                        
              <li>{user ? (<UserMenu user={user} avatar={avatar}/>) :
                  (
                  <Button variant="outline" className="border-blueShop  text-blueShop hover:bg-blueShop/80 hover:text-white " asChild>
                      <Link href="/login"> <FaRegUser className="w-5 h-5 text-inherit" /> Accedi</Link>
                  </Button>
                  )}
              </li>
          </ul>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="grid w-[200px] p-4">
              <Link href="\#about" className="text-lg text-blueShop font-semibold uppercase hover:underline underline-offset-4">
                Chi siamo
              </Link>
              <Link href="\#vetrina" className="text-lg text-blueShop font-semibold uppercase hover:underline underline-offset-4">
                vetrina
              </Link>
              <Link href="\#contatti" className="text-lg text-blueShop font-semibold uppercase hover:underline underline-offset-4">
                Contatti
              </Link>
              <div className="mt-5">{user ? (<UserMenu user={user} avatar={avatar}/>) :
                  (
                  <Button variant="outline" className="border-blueShop  text-blueShop hover:bg-blueShop/80 hover:text-white " asChild>
                      <Link href="/login"> <FaRegUser className="w-5 h-5 text-inherit" /> Accedi</Link>                      
                  </Button>
                  )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}

function MenuIcon(props:React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}



