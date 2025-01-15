'use client'

import { useState, useEffect } from "react";
import { MdError } from "react-icons/md";

type ErrorComponentProps = {
    error?: string | undefined;
}

export const ErrorValidationComponent = ({ error }: ErrorComponentProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (error) {
            setIsVisible(true);
        } else {
            // Ritarda la scomparsa per consentire la transizione
            const timeout = setTimeout(() => setIsVisible(false), 500);
            return () => clearTimeout(timeout);
        }
    }, [error]);
    
    return (
        <div className="relative">
        {isVisible && (
            <p
            className={`absolute flex items-center gap-1 px-2 font-medium text-white text-sm bg-red-500 rounded-md whitespace-normal break-words 
            transition-all duration-200 ease-in-out transform  z-10 ${
                error ? "opacity-85 translate-y-0" : "opacity-0 translate-y-2"
            }`}
            >
            <span><MdError /></span>
            {error}
            </p>
        )}
        </div>
    );
};
      