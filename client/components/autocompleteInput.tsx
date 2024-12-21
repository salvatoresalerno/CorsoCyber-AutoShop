
'use client'

import React, { useState } from "react";
import { Input } from "./ui/input";


type InputProps = {
  brand: string;
}

const AutocompleteInput = ({brand}: InputProps) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const allSuggestions = ["Apple", "Banana", "Cherry", "Date", "Grapes", "Orange"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Filtra i suggerimenti in base all'input
    const filteredSuggestions = allSuggestions.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase())
    );

    setSuggestions(filteredSuggestions);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setSuggestions([]); // Nascondi i suggerimenti
  };

  return ( 
    <div className="relative">
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className="border border-gray-300 rounded p-2 w-full"
        placeholder="Type something..."
      />
      {suggestions.length > 0 && (
        <ul className="absolute bg-white border border-gray-300 mt-1 rounded w-full">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput;
