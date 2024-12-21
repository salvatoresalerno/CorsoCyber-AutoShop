
'use client'

import React, { useCallback } from 'react';

type ErrorProps = {
  message?: string; 
}



const ErrorComponent = ({ message='' }: ErrorProps) => {

    const handleRetry = useCallback(() => {
        window.location.reload();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-600">
            <h1 className="text-4xl font-bold">Ops! Qualcosa è andato storto.</h1>
            <p className="mt-2 text-lg">{message}</p>
            <div className="mt-6 flex space-x-4">        
                <button
                    onClick={handleRetry}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                    Riprova
                </button>
            </div>
        </div>
    );
};

export default ErrorComponent;
