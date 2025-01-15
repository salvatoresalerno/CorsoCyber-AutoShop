'use client'


 
import { useEffect, useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell,  } from "./ui/table";
import { cn, formatDate,  } from "@/lib/utils";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";
import { ExtendedUser, Ruolo } from "@/lib/types";
import { Button } from "./ui/button";
import { CiEdit } from "react-icons/ci";
import { PiTrash } from "react-icons/pi";
import { Switch } from "@/components/ui/switch"
import { deleteAdminByID, setBanned } from "@/app/(admin)/admin/action";
import { z } from "zod";
import AddAdminDialog from "./addAdminDialog";
import { IoMdAddCircleOutline } from "react-icons/io";

type UserTableProps = {
    utenti: ExtendedUser[] | null,
    ruolo: string;
    currentAdminRole: string;
    className?: string;
}

const sortedIcon = (
    <svg viewBox="0 0 18 18" className="w-4 h-4">
      <polygon className="fill-none stroke-current stroke-2 stroke-linecap-round stroke-linejoin-round" points="7 11 9 13 11 11 7 11"></polygon>
      <polygon className="fill-none stroke-current stroke-2 stroke-linecap-round stroke-linejoin-round" points="7 7 9 5 11 7 7 7"></polygon>
    </svg>
);

const UserTable = ({className, utenti, ruolo, currentAdminRole}: UserTableProps) => {

    const [utentiFiltrati, setUtentiFiltrati] = useState<ExtendedUser[] | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: keyof ExtendedUser; direction: 'ascending' | 'descending' } >({key: 'username', direction: 'ascending'});

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(5);

    const [errore, setErrore] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    const [selectedAdmin, setSelectedAdmin] = useState<ExtendedUser | null>(null); //per dialog addAdmin
    const [isOpen, setIsOpen] = useState<boolean>(false); //per dialog addAdmin

     

    //ricevuti i filtri, filtro i veicoli in base ai filtri ricevuti
    useEffect(() => {
        if (utenti && ruolo) {
            let viewUsers: ExtendedUser[] = []; 
            if (ruolo === Ruolo.USER) {
                viewUsers = utenti.filter(user => user.role === ruolo);
            } else if (ruolo === Ruolo.ADMIN) {
                viewUsers = utenti.filter(user => user.role === ruolo || user.role === Ruolo.SUPERADMIN);
            }

            if (sortConfig !== null) {  //ordinamento di default --> modello
                if (viewUsers) {                     
                    viewUsers.sort((a, b) => {
                        if (sortConfig.key !== 'id' && sortConfig.key !== 'banned') { // Esclude le key id e banned dall'ordinamento
                            const valueA = a[sortConfig.key];
                            const valueB = b[sortConfig.key];
            
                            // Controllo se il valore è una data
                            const isDate = !isNaN(new Date(valueA).getTime()) && !isNaN(new Date(valueB).getTime());                           
            
                            if (isDate) {                                
                                // Ordinamento per date
                                const timeA = new Date(valueA).getTime();
                                const timeB = new Date(valueB).getTime();
                                
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

        if (action === 'update') {
            openDialog(utente)
        } else if (action === 'delete') {
            const { message, error } = await deleteAdminByID(utente.id);
            if (message){ //se tutto ok
                setSuccess(message);
                setUtentiFiltrati(prevItems => {
                    if (!prevItems) return [];
                    const index = prevItems.findIndex(item => item.id === utente.id); //rimuovo dai dati già caricati per evitare chiamata a BE
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
        }        
    };

    const openDialog = (user: ExtendedUser | null) => {
        setSelectedAdmin(user);  
        setIsOpen(true); // Apre la dialog
    };
    
    const closeDialog = () => {
        setIsOpen(false); // Chiude la dialog
        setSelectedAdmin(null);  
    };

    const handleChangeBanned = async (id: string, checked: boolean) => {
        const paramsValidator = z.object({
            id: z
                .string()
                .uuid(),
            checked: z
                .boolean()
                .transform((val) => (val ? 1 : 0)),
        });

        const data = {
            id,
            checked
        }
        try {
            const isValid = paramsValidator.parse(data);
            if (isValid) {
                const { message, error } = await setBanned(isValid.id, isValid.checked);
                if (message){ //modifica slvata correttamente
                    //cambio nell'array utente lo stato banned senza ricaricare i dati
                    setUtentiFiltrati(prevItems => {
                        if (!prevItems) return [];
                        const index = prevItems.findIndex(utente => utente.id === isValid.id); //trovo index dell'utente da modificare
                        if (index !== -1) {
                          //prevItems.splice(index, 1);
                          prevItems[index] = { ...prevItems[index], banned: isValid.checked };
                        }
                        return [...prevItems];
                    });                     
                }
                setErrore(error);
                setSuccess(message);
                setTimeout(() => {
                    setErrore('');
                    setSuccess('');
                }, 5000);
            }
        } catch (error) {
            setErrore(error instanceof z.ZodError ? 'Errore Ban Utente, riprovare più tardi.' : 'Errore Imprevisto.')
        }         
    }

    const handleAddButton = () => {
        openDialog(null)
    }
    
    return (
        <div className={cn(className)}>            
            <div className="overflow-x-auto relative ">  
                {currentAdminRole === Ruolo.SUPERADMIN && ruolo === Ruolo.ADMIN && <Button
                    variant="outline" 
                    className="absolute right-1 top-0 flex items-center justify-center p-1 w-9 h-9  rounded-full z-10 border-blueShop  text-blueShop hover:bg-blueShop/80 hover:text-white"
                    title="Aggiungi ADMIN"
                    onClick={handleAddButton}
                >
                   <IoMdAddCircleOutline />
                </Button>}
                <AddAdminDialog 
                    isOpen={isOpen} 
                    onClose={closeDialog}
                    admin={selectedAdmin}
                />  
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
                            <TableHead className="whitespace-nowrap font-bold hidden sm:table-cell">
                                <div className="flex items-center justify-center gap-2">
                                    <span>Data Creazione</span>
                                    <span className="w-[18px] cursor-pointer" onClick={() => requestSort('created_at')}>{sortedIcon}</span>
                                </div>
                            </TableHead>
                            <TableHead className="whitespace-nowrap font-bold">
                                <div className="flex items-center justify-center gap-2">
                                    <span>Ultimo Login</span>
                                    <span className="w-[18px] cursor-pointer" onClick={() => requestSort('last_sign_in_at')}>{sortedIcon}</span>
                                </div>
                            </TableHead>
                            {currentAdminRole === Ruolo.SUPERADMIN && <TableHead className="whitespace-nowrap font-bold">
                                <div className="flex items-center justify-center gap-2">
                                 <span>{ruolo === Ruolo.USER ? 'Banned' : 'Sospeso'}</span>                                    
                                </div>
                            </TableHead>}      
                            {currentAdminRole === Ruolo.SUPERADMIN && <TableHead ></TableHead>}
                        </TableRow>
                    </TableHeader> 
                    <TableBody>
                        {paginatedUsers && paginatedUsers.map((utente, index) => (
                            <TableRow key={index} {...(utente.role === "SUPERADMIN" ? { title: "E' IL SUPERADMIN" } : {})} className={cn(utente.role === Ruolo.SUPERADMIN && "font-bold")}>
                                <TableCell className="text-center">{utente.username}</TableCell>
                                <TableCell className="text-center">{utente.email}</TableCell>
                                <TableCell className="hidden sm:table-cell text-center">{formatDate({date: new Date(utente.created_at), dateTimeSeparator: '-'} )}</TableCell>
                                <TableCell className="text-center">{utente.last_sign_in_at ? formatDate({date: new Date(utente.last_sign_in_at), dateTimeSeparator: '-'}) : '-'}</TableCell>
                                {currentAdminRole === Ruolo.SUPERADMIN && <TableCell className="text-center">
                                    {utente.role !== Ruolo.SUPERADMIN && <Switch
                                        onCheckedChange={(checked: boolean) => handleChangeBanned(utente.id, checked)}                                         
                                        checked={utente.banned === 1 ? true : false}
                                        className="data-[state=checked]:bg-red-500"
                                    />}    
                                </TableCell>}
                                {currentAdminRole === Ruolo.SUPERADMIN && utente.role !== Ruolo.USER && <TableCell>
                                    <div className="flex gap-3 justify-center">
                                        <Button 
                                            title='Modifica Admin'
                                            size='sm' 
                                            className="bg-transparent text-blueShop hover:bg-blueShop/80 hover:text-white p-1  xl:flex xl:items-center xl:justify-center xl:p-2"
                                            onClick={handleButtonClick(utente, 'update')}                                            
                                        >
                                            <CiEdit className="h-4 w-4 xl:h-5 xl:w-5"/>
                                        </Button>
                                        {utente.role !== Ruolo.SUPERADMIN && <Button 
                                            title='Cancella Admin'
                                            size='sm' 
                                            className="bg-transparent text-red-400 hover:bg-red-400 hover:text-white p-1 xl:flex xl:items-center xl:justify-center xl:p-2"
                                            onClick={handleButtonClick(utente, 'delete')}
                                        >
                                            <PiTrash className="h-4 w-4 xl:h-5 xl:w-5"/>
                                        </Button>}                                        
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