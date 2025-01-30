import { useEffect } from "react";

/* export const useRecaptcha = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Controlla se reCAPTCHA è già stato caricato
    if (document.getElementById("recaptcha-script")) return;

    const script = document.createElement("script");
    script.id = "recaptcha-script";
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
    script.async = true;
    document.body.appendChild(script);
  }, []);
}; */

export function useRecaptcha() {
  useEffect(() => {
    if (window.grecaptcha) return; // Se già presente, non fare nulla

    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => console.log("reCAPTCHA caricato");
    document.body.appendChild(script);
  }, []);
}
