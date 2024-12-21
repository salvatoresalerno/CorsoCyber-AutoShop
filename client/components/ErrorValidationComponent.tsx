/* import { AnimatePresence, motion } from 'framer-motion'
import { MdError } from 'react-icons/md'


export const ErrorComponent = ({error=undefined}) => {

    const framer_error = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 10 },
        transition: { duration: 0.2 },
    }

    return (
        <AnimatePresence mode="wait" initial={false}>
            {error && (<motion.p
            className="flex items-center gap-1 px-2 font-semibold text-red-500 bg-red-100 rounded-md whitespace-normal break-words"
            {...framer_error}
            >
            <MdError />
                {error.message}
            </motion.p>)}
        </AnimatePresence>
      )
} */


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
      