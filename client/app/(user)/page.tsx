 'use server'

import Image from "next/image";
import heroImage from '@/public/hero2.png';
import aboutImage from '@/public/about.jpg';
import brand3 from '@/public/brands-car-3.jpg';
import brand4 from '@/public/brands-car-4.jpg';
import brand5 from '@/public/brands-car-5.jpg';
import brand6 from '@/public/brands-car-6.jpg';
import brand7 from '@/public/brands-car-7.jpg';
import brand8 from '@/public/brands-car-8.jpg';
import CruscottoSearch from "@/components/cruscotto-search";
import GoogleMapComponent from "@/components/mappa";
import { RiCustomerService2Line } from "react-icons/ri";
import { MdOutlineEmail, MdPhone } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { RxHome } from "react-icons/rx";
import ContattiForm from "@/components/form-contatti";
import CardComponent_V2 from "@/components/cardComponent_V2";
import { headers } from "next/headers";
import { getVeicoliStato } from "../action";
import { Stato, Veicolo } from "@/lib/types";
import { decodeEscapedHtml } from "@/lib/utils";
import ErrorComponent from "@/components/errorComponent";




const MainUser = async () => {    
 
  //recupero User eventualmente esistente in headers
  const currentHeaders = headers();
  const currentUserHeader = currentHeaders.get('X-Current-User');
  const currentUser = currentUserHeader ? JSON.parse(currentUserHeader) : null;
   

  const { data: veicoli, error  } = await getVeicoliStato(Stato.VENDESI);  //veicoli usari (in Vendita) per vetrina random e per estrarre brand, modello, ecc nel cruscotto
  
  if (error) {
    return (<ErrorComponent/>);
  }

  const data: Veicolo[] | null = veicoli ? 
  veicoli.map((item) => ({
    id: item.id,  
    brand: decodeEscapedHtml(item.brand),
    modello: decodeEscapedHtml(item.modello),
    tipo: item.tipo,
    anno: item.anno,
    kilometri: item.kilometri,
    alimentazione: item.alimentazione,
    prezzo: item.prezzo,
    stato: item.stato,  
    image: decodeEscapedHtml(item.image ? item.image : '')  
  })) : [];
     
  
  function creaVetrina(length: number, count:number): number[] {  //ritorna un array di count elementi che sono gli indici per i veicoli della vetrina random
    const indici = new Set<number>();
    while (indici.size < count) {
        indici.add(Math.floor(Math.random() * length));
    }
    return Array.from(indici);
  }


  return ( 
      <div>
        <section className="relative  w-full lg:h-[650px] ">  {/* Hero section */}
          <Image 
            src={heroImage} 
            alt="heroImage" 
            className="lg:hidden p-1 sm:p-2 "
          />
          <Image 
            src={heroImage} 
            alt="heroImage" 
            className="hidden lg:block" 
            fill    
             style={{
              objectFit: "cover",
              objectPosition: "50% 15%", 
            }} 
          />  
          <span className="absolute top-2 right-3 md:top-3 md:right-5 lg:top-10 lg:right-10 text-white font-semibold text-2xl md:text-3xl  lg:text-5xl">Solo Usato Garantito</span>           
        </section>

        <section className="flex justify-center h-[300px] w-full mt-0 sm:-mt-10 md:-mt-20 lg:-mt-24  bg-transparent">
            {data && <CruscottoSearch veicoli={data} />}  
        </section>  

        <section id="vetrina" className="bg-[#FFEFE5]"  > {/*Vetrina occasioni */}
          <div className="container mx-auto p-5">
            <h2 className="text-3xl font-semibold text-center my-2 sm:my-8">Occasioni in vetrina</h2>
            <div className="grid grid-cols-1 justify-items-center sm:grid-cols-2 xl:grid-cols-3 gap-4 p-2 sm:p-4 ">
              {data.length > 0 && creaVetrina(data.length, 6).map((value, index) => {
                return <CardComponent_V2
                      key={index} 
                      veicolo={data[value]}
                      user={currentUser}
                  />
              })}
            </div>
          </div>
        </section>

        <section className="py-10 px-5 mx-auto"> {/*marchi */}
          <div className="grid grid-cols-2 justify-items-center  sm:flex  justify-center gap-4 sm:gap-10">
            <div className="w-fit shadow-md rounded-lg overflow-hidden">
              <Image src={brand3} alt="brand3"/>
            </div>
            <div className="w-fit shadow-md rounded-lg overflow-hidden">
              <Image src={brand4} alt="brand4"/>
            </div>
            <div className="w-fit shadow-md rounded-lg overflow-hidden">
              <Image src={brand5} alt="brand5"/>
            </div>
            <div className="w-fit shadow-md rounded-lg overflow-hidden">
              <Image src={brand6} alt="brand6"/>
            </div>
            <div className="w-fit shadow-md rounded-lg overflow-hidden">
              <Image src={brand7} alt="brand7"/>
            </div>
            <div className="w-fit shadow-md rounded-lg overflow-hidden">
              <Image src={brand8} alt="brand8"/>
            </div>
          </div>
        </section>           

        <section id="about" className=" bg-white"> {/*About */}
          <div className="container mx-auto p-5">
            <h1 className="text-3xl font-semibold text-center sm:text-left">Qualcosa su di noi ...</h1>              
            <div className="sm:p-8 lg:flex lg:items-center lg:gap-8">                
              <Image
                src={aboutImage}
                alt="aboutImage"
                className="w-[90%] mx-auto mb-5 md:mt-10 md:mr-5  md:w-1/2 rounded-md md:float-left lg:float-none lg:m-5"
              />                
              <div className="">
                <h2 className="font-semibold text-2xl text-center sm:text-left">Chi siamo</h2>
                <p className="text-lg leading-loose text-justify break-words p-4 sm:p-0">
                  {"Benvenuti nel nostro sito, la destinazione ideale per chi cerca automobili e moto di alta qualità, accompagnate da un servizio d'eccellenza. Siamo un team di professionisti appassionati di motori, con anni di esperienza nel settore della vendita di veicoli nuovi e usati. La nostra mission è fornire soluzioni di mobilità che soddisfino le esigenze e i desideri dei nostri clienti, offrendo una selezione accurata e sempre aggiornata di veicoli, sia per la città che per l'avventura."}
                </p>
              </div>
            </div>
            <div className="flex flex-col p-4 sm:flex-row sm:p-8 sm:gap-8">
              <div>
                <h2 className="font-semibold text-2xl">La nostra Mission</h2>
                <p className="text-lg leading-loose text-justify break-words">
                {"Il nostro obiettivo è più di una semplice vendita: vogliamo rendere ogni acquisto un'esperienza positiva e appagante. Dall'ampia scelta di auto e moto alle opzioni di finanziamento su misura, ci impegniamo a fornire un servizio personalizzato e trasparente, guidando ogni cliente nella scelta del veicolo perfetto per le sue esigenze. Crediamo nell'importanza della fiducia e lavoriamo costantemente per costruire rapporti solidi e duraturi con i nostri clienti, accompagnandoli in ogni fase, dalla selezione fino alla consegna e oltre."}
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <h2 className="font-semibold text-2xl">La nostra Vision</h2>
                <p className="text-lg leading-loose text-justify break-words">
                {"Aspiriamo a diventare il punto di riferimento per chi cerca un veicolo con cui realizzare i propri sogni su strada. Per noi, il futuro della mobilità è sostenibile, sicuro e accessibile a tutti. Guardiamo oltre la vendita di automobili e moto: puntiamo a promuovere una cultura della mobilità consapevole, che rispetti l'ambiente e soddisfi le esigenze in continua evoluzione di una clientela moderna. La nostra visione è un mercato in cui qualità, innovazione e rispetto per il cliente possano viaggiare sempre di pari passo."}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="contatti" className="flex justify-center mt-10"> {/*contatti */}
          <div className="container mx-auto p-5 md:px-0">
            <div className="flex flex-col md:flex-row  justify-between gap-3">
              <GoogleMapComponent className="w-full h-[300px] md:w-[700px] md:h-[450px]"/> 
              <div className="w-full md:w-1/2">
                <ContattiForm />
              </div>
            </div>
            <h2 className="font-semibold text-3xl w-full text-center mt-5 md:mt-10">Contatti</h2>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-10 my-5">              
              <div className="">
                <fieldset className="border px-2 text-xl  space-y-1">
                  <legend className="flex items-center gap-2 px-2"><RiCustomerService2Line /> Servizio Clienti</legend>                  
                  <div className="flex items-center gap-2"><MdOutlineEmail /> <a href='mailto:servizio.clienti@autoshop.it'>servizio.clienti@autoshop.it</a></div>
                  <div className="flex items-center gap-2"><MdPhone /> <span>080 / 1234567</span></div>
                  <div className="flex items-center gap-2"><FaWhatsapp /> <span>333 / 88776655</span></div>
                </fieldset>
              </div>
              <div className="">
                <fieldset className="border px-2 text-xl space-y-1">
                  <legend className="flex items-center gap-2 px-2"><HiOutlineBuildingOffice2 /> Concessionaria</legend>                  
                  <div className="flex items-center gap-2"><MdOutlineEmail /> <a href='mailto:autosalone@autoshop.it'>autosalone@autoshop.it</a></div>
                  <div className="flex items-center gap-2"><MdPhone /> <span>080 / 1234567</span></div>
                  <div className="flex items-center gap-2"><FaWhatsapp /> <span>333 / 88776655</span></div>
                  <div className="flex items-center gap-2">
                    <RxHome /> 
                    <div className="flex flex-col">
                      <span>Via scappa scappa, 113</span>
                      <span>{"70056 - Molfetta (Ba)"}</span>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>              
          </div>
        </section>
      </div>
  );
}

export default MainUser;

