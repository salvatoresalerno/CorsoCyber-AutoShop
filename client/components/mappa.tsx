 
"use client";

type mappaProps = {
  className?: string;
}

export default function GoogleMapComponent({className}: mappaProps) {


  return (
    <iframe 
        className={className}
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3570.387583538333!2d16.58804107991386!3d41.192863122693666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1347f9d1cb48896b%3A0x9fb922daa384bab5!2sVia%20Molfettesi%20del%20Venezuela%2C%2070056%20Molfetta%20BA!5e0!3m2!1sit!2sit!4v1730140998703!5m2!1sit!2sit" 
        /* width="600" 
        height="450" */ 
        referrerPolicy="no-referrer-when-downgrade"
        style={{border: '1px solid #ccc', padding:'5px'}}
        loading="lazy" 
    />   
  );
}
