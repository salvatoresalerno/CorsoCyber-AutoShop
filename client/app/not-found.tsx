
import Link from "next/link";

 



 
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <div className="absolute top-1/4 text-center space-y-6 px-4 md:px-8">
        <h1 className="text-5xl md:text-7xl font-bold text-orange-500 drop-shadow-lg">
            404
        </h1>
        <p className="text-lg md:text-2xl text-gray-200 max-w-lg mx-auto drop-shadow-md">
            Oops! La pagina che stai cercando non è disponibile.
        </p>
        <p className="text-md md:text-lg text-gray-400 max-w-md mx-auto">
            {"Forse hai inserito l'URL sbagliato o questa pagina è stata spostata."}
        </p>
        <Link href="/">
            <button className="mt-8 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out">
                Torna alla Home
            </button>
        </Link>
      </div>
    </div>      
  )   
}



 