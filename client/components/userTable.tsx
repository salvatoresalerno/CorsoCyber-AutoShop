'use client'


import { useFiltriContext } from "./context/filtriContext";
import { useEffect, useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell,  } from "./ui/table";
import { cn, formatDate,  } from "@/lib/utils";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";
import { ExtendedUser, Ruolo, Stato, Veicolo } from "@/lib/types";
import { Button } from "./ui/button";
import { CiEdit } from "react-icons/ci";
import { PiTrash } from "react-icons/pi";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch"
import { deleteVeicoloByID } from "@/app/(admin)/admin/action";

type UserTableProps = {
    utenti: ExtendedUser[] | null,
    ruolo: string;
    className?: string;
}

const sortedIcon = (
    <svg viewBox="0 0 18 18" className="w-4 h-4">
      <polygon className="fill-none stroke-current stroke-2 stroke-linecap-round stroke-linejoin-round" points="7 11 9 13 11 11 7 11"></polygon>
      <polygon className="fill-none stroke-current stroke-2 stroke-linecap-round stroke-linejoin-round" points="7 7 9 5 11 7 7 7"></polygon>
    </svg>
);

const UserTable = ({/*  veicoli,  stato */ className, utenti, ruolo}: UserTableProps) => {

    const router = useRouter();

    //const [veicoliFiltrati, setVeicoliFiltrati] = useState<ExtendedUser[] | null>(null);
    const [utentiFiltrati, setUtentiFiltrati] = useState<ExtendedUser[] | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: keyof ExtendedUser; direction: 'ascending' | 'descending' } >({key: 'username', direction: 'ascending'});

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(5);

    const [errore, setErrore] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

     

    //ricevuti i filtri, filtro i veicoli in base ai filtri ricevuti
    useEffect(() => {
        if (utenti && ruolo) {
            let viewUsers = utenti.filter(user => user.role === ruolo);

            if (sortConfig !== null) {  //ordinamento di default --> modello
                if (viewUsers) {
                      /* viewUsers.sort((a, b) => {
                        if (sortConfig.key !== 'id'  && sortConfig.key !== 'banned') {  //esclude la key e banned id dall'ordinamento
                            if (a[sortConfig.key].toString().toLowerCase() < b[sortConfig.key].toString().toLowerCase()) {
                                return sortConfig.direction === 'ascending' ? -1 : 1;
                            }
                            if (a[sortConfig.key].toString().toLowerCase() > b[sortConfig.key].toString().toLowerCase()) {
                                return sortConfig.direction === 'ascending' ? 1 : -1;
                            }
                        } 
                        return 0;
                    });  */
                    viewUsers.sort((a, b) => {
                        if (sortConfig.key !== 'id' && sortConfig.key !== 'banned') { // Esclude le key id dall'ordinamento
                            const valueA = a[sortConfig.key];
                            const valueB = b[sortConfig.key];
            
                            // Controllo se il valore è una data
                            const isDate = !isNaN(new Date(valueA).getTime()) && !isNaN(new Date(valueB).getTime());                           
            
                            if (isDate) {                                
                                // Ordinamento per date
                                const timeA = new Date(valueA).getTime();
                                const timeB = new Date(valueB).getTime();
                                console.log('Time A: ', timeA)
                                console.log('Time B: ', timeB)
                                //return sortConfig.direction === 'ascending' ? timeA - timeB : timeB - timeA;
                                if (timeA < timeB) {
                                    return sortConfig.direction === 'ascending' ? -1 : 1;
                                }
                                if (timeA > timeB) {
                                    return sortConfig.direction === 'ascending' ? 1 : -1;
                                }  
                            } else {
                                // Ordinamento per stringhe o altri tipi
                                const stringA = valueA.toString().toLowerCase();
                                const stringB = valueB.toString().toLowerCase();
                                if (stringA < stringB) {
                                    return sortConfig.direction === 'ascending' ? -1 : 1;
                                }
                                if (stringA > stringB) {
                                    return sortConfig.direction === 'ascending' ? 1 : -1;
                                }
                            }
                        }
                        return 0;
                    });

                } else {
                    viewUsers = [];
                }
            } 

            setUtentiFiltrati(viewUsers);

        }
      
    }, [utenti, sortConfig, ruolo]);
    
    
    const requestSort = (key: keyof ExtendedUser) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
          direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    console.log('calcolo ')

    const totalUsers = utentiFiltrati ? utentiFiltrati.length : 0;
    const totalPages = Math.ceil(totalUsers / itemsPerPage);
    const paginatedUsers = utentiFiltrati ? utentiFiltrati.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    ) : [];
   
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(startIndex + itemsPerPage - 1, totalUsers);

    const getPageNumbers = () => {
        const pageNumbers = [];
        const totalPagesToShow = 5;

        if (totalPages <= totalPagesToShow + 2) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            pageNumbers.push(1);

            if (currentPage > 3) {
                pageNumbers.push('ellipsis');
            }

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pageNumbers.push(i);
            }

            if (currentPage < totalPages - 2) {
                pageNumbers.push('ellipsis');
            }

            pageNumbers.push(totalPages);
        }

        return pageNumbers;
    };

    const handleButtonClick = (utente: ExtendedUser, action: 'update' | 'delete') => async (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();

        console.log('utente cliccato: ', utente)
        
        /* if (action === 'update') {
           console.log('update del veicolo: ', veicolo)
           router.push(`/admin/dashboard/veicolo/${veicolo.id}`);
        } else if (action === 'delete') { 
            console.log('canc. del veicolo: ', veicolo)
            const { message, error } = await deleteVeicoloByID(veicolo.id ?? '');
            console.log('pagin prima: ', veicoliFiltrati)
            if (message){ //se tutto ok
                setSuccess(message);
                setVeicoliFiltrati(prevItems => {
                    if (!prevItems) return [];
                    const index = prevItems.findIndex(item => item.id === veicolo.id); //rimuovo dai dati già caricati per evitare chiamata a BE
                    if (index !== -1) {
                      prevItems.splice(index, 1);
                    }
                    return [...prevItems];
                  });                
            }
            if (error) {
                setErrore(error);
            }
            setTimeout(() => {
                setErrore('');
                setSuccess('');
            }, 5000);

             
        }*/
    };

    //formatDate(utente.created_at)
    
    return (
        <div className={cn(className)}>
            
            <div className="overflow-x-auto relative">  
                {errore && <span className="absolute text-red-500 ">{errore}</span>}
                {success && <span className="absolute text-lime-500 ">{success}</span>}
                <Table>        
                    <TableHeader className='text-[16px] border-b-2 [&_tr]:hover:bg-transparent dark:[&_tr]:hover:bg-transparent'>
                        <TableRow>
                            <TableHead className="whitespace-nowrap font-bold">
                                <div className="flex items-center justify-center gap-1">
                                    <span>Username</span>
                                    <span className="w-[18px] cursor-pointer" onClick={() => requestSort('username')}>{sortedIcon}</span>
                                </div>
                            </TableHead>
                            <TableHead className="whitespace-nowrap font-bold">
                                <div className="flex items-center justify-center gap-2">
                                    <span>Email</span>
                                    <span className="w-[18px] cursor-pointer" onClick={() => requestSort('email')}>{sortedIcon}</span>
                                </div>
                            </TableHead>
                            <TableHead className="whitespace-nowrap font-bold">
                                <div className="flex items-center justify-center gap-2">
                                    <span>Data Creazione</span>
                                    <span className="w-[18px] cursor-pointer" onClick={() => requestSort('created_at')}>{sortedIcon}</span>
                                </div>
                            </TableHead>
                            <TableHead className="whitespace-nowrap font-bold hidden sm:table-cell">
                                <div className="flex items-center justify-center gap-2">
                                    <span>Ultimo Login</span>
                                    <span className="w-[18px] cursor-pointer" onClick={() => requestSort('last_sign_in_at')}>{sortedIcon}</span>
                                </div>
                            </TableHead>
                            <TableHead className="whitespace-nowrap font-bold hidden sm:table-cell">
                                <div className="flex items-center justify-center gap-2">
                                 <span>{ruolo === Ruolo.USER ? 'Banned' : 'Sospeso'}</span>                                    
                                </div>
                            </TableHead>                          
                           
                            {ruolo === Ruolo.ADMIN && <TableHead ></TableHead>}
                        </TableRow>
                    </TableHeader> 
                    <TableBody>
                        {paginatedUsers && paginatedUsers.map((utente, index) => (
                            <TableRow key={index}>
                                <TableCell className="text-center">{utente.username}</TableCell>
                                <TableCell className="text-center">{utente.email}</TableCell>
                                <TableCell className="text-center">{formatDate(new Date(utente.created_at), true )}</TableCell>
                                <TableCell className="hidden sm:table-cell text-center">{formatDate(new Date(utente.last_sign_in_at), true)}</TableCell>
                                <TableCell className="hidden sm:table-cell text-center">
                                    <Switch
                                        checked={utente.banned}
                                        //onCheckedChange={field.onChange}
                                    />    
                                </TableCell>
                                {ruolo === Ruolo.ADMIN && <TableCell>
                                    <div className="flex gap-3 justify-center">
                                        <Button 
                                            title='Modifica Veicolo'
                                            size='sm' 
                                            className="bg-transparent text-blueShop hover:bg-blueShop/80 hover:text-white p-1  xl:flex xl:items-center xl:justify-center xl:p-2"
                                            onClick={handleButtonClick(utente, 'update')}                                            
                                        >
                                            <CiEdit className="h-4 w-4 xl:h-5 xl:w-5"/>
                                        </Button>
                                        <Button 
                                            title='Cancella Veicolo'
                                            size='sm' 
                                            className="bg-transparent text-red-400 hover:bg-red-400 hover:text-white p-1 xl:flex xl:items-center xl:justify-center xl:p-2"
                                            onClick={handleButtonClick(utente, 'delete')}
                                        >
                                            <PiTrash className="h-4 w-4 xl:h-5 xl:w-5"/>
                                        </Button>                                        
                                    </div>
                                </TableCell>}                                                         
                            </TableRow> 
                        ))}
                    </TableBody> 
                </Table>
            </div>  
            <div className="flex flex-col justify-start items-center w-full mt-4 px-4  sm:flex-row sm:justify-between ">
                <div className='flex items-center gap-2'>
                    <Select                 
                        value={itemsPerPage.toString()} 
                        onValueChange={(value) => {setItemsPerPage(Number(value)); setCurrentPage(1)}}
                    >
                        <SelectTrigger className="w-[60px] h-6 px-[10px] select-none focus:border-[#abe2fb] focus:ring-none dark:focus:ring-none">
                            <SelectValue  />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem className="cursor-pointer" value='3'>3</SelectItem>
                        <SelectItem className="cursor-pointer" value='5'>5</SelectItem>
                        <SelectItem className="cursor-pointer" value='10'>10</SelectItem>
                        <SelectItem className="cursor-pointer" value='15'>15</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-600 order-2 sm:order-1">
                    Da {startIndex} a {endIndex} su {totalUsers} Utenti
                    </p>
                    <span>-</span>
                    
                </div>
                <Pagination className="order-1 sm:order-2 m-0 w-auto select-none">
                <PaginationContent>
                    <PaginationItem className={currentPage === 1 ? 'cursor-not-allowed' : 'cursor-pointer'}>
                    <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className={(currentPage === 1  || totalPages===0) ? "pointer-events-none opacity-50" : ""}
                    />
                    </PaginationItem>
                    {getPageNumbers().map((pageNumber, index) => (
                    <PaginationItem key={index} className="hidden sm:inline-block">
                        {pageNumber === 'ellipsis' ? (
                        <PaginationEllipsis />
                        ) : (
                        <PaginationLink
                            className='cursor-pointer'
                            onClick={() => setCurrentPage(pageNumber as number)}
                            isActive={currentPage === pageNumber}
                        >
                            {pageNumber}
                        </PaginationLink>
                        )}
                    </PaginationItem>
                    ))}
                    <PaginationItem className={currentPage === totalPages ? 'cursor-not-allowed' : 'cursor-pointer'}>
                    <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className={(currentPage === totalPages || totalPages===0) ? "pointer-events-none opacity-50" : ""}
                    />
                    </PaginationItem>
                </PaginationContent>
                </Pagination>
            </div>
        </div>
    )
}


export default UserTable;