import React, { useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { FcSearch } from "react-icons/fc";
import { cn } from "@/lib/utils"

type SearchInputProps = {
    id?: string;
    value: string;
    onChange: (txt: string)=>void;
    showIconSearch?: boolean;
    className?: string;
}

const SearchInput = ({id="",  value = "", onChange = () => {}, showIconSearch = true, className = "" }: SearchInputProps) => {
    const inputRef = useRef(null);
    const [inputValue, setInputValue] = useState(value);
  
    useEffect(() => {       
      setInputValue(value); // Aggiorna il valore dell'input quando cambia la prop 'value' dall'esterno
    }, [value]);
  
    const handleSearch = (txt: string) => {
      setInputValue(txt); // Aggiorna il valore locale dell'input
      onChange(txt); // Richiama la funzione 'onChange' per passare il valore dell'input all'esterno
    };
  
    const handleIconClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setInputValue(""); // Resetta il valore dell'input
      handleSearch(""); // Esegui la ricerca con testo vuoto
    };
   
    return (
      <div id={id} className={'inputSearch_container relative'}>
        <label htmlFor={id + "_inputSearch"} className="sr-only">
          Search
        </label>
        <input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => handleSearch(e.target.value)}
          id={id + "_inputSearch"}
          type="text"
          placeholder="Ricerca..."
          className={cn(`block w-full rounded-lg border py-2 ${showIconSearch ? "px-10" : "pl-3 pr-10"} text-sm  focus:outline-none `, className)}
        />
        {showIconSearch && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 transform">
            <FcSearch className="h-5 w-5" />
          </span>
        )}
  
        {inputValue && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 transform cursor-pointer" onClick={handleIconClick}>
            <FaTimes className="text-red-500" />
          </span>
        )}
      </div>
    );
  };
  
  export default SearchInput;
