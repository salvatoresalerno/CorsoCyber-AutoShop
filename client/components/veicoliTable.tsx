'use client'


import { useFiltriContext } from "./context/filtriContext";
import { useEffect, useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell,  } from "./ui/table";
import { cn } from "@/lib/utils";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";
import { Veicolo } from "@/lib/types";
import { Button } from "./ui/button";
import { CiEdit } from "react-icons/ci";
import { PiTrash } from "react-icons/pi";
import { useRouter } from "next/navigation";

type VeicoliTableProps = {
    veicoli: Veicolo[] | null;
    className?: string;
}

const sortedIcon = (
    <svg viewBox="0 0 18 18" className="w-4 h-4">
      <polygon className="fill-none stroke-current stroke-2 stroke-linecap-round stroke-linejoin-round" points="7 11 9 13 11 11 7 11"></polygon>
      <polygon className="fill-none stroke-current stroke-2 stroke-linecap-round stroke-linejoin-round" points="7 7 9 5 11 7 7 7"></polygon>
    </svg>
);

const VeicoliTable = ({ veicoli, className }: VeicoliTableProps) => {

    const router = useRouter();

    const [veicoliFiltrati, setVeicoliFiltrati] = useState<Veicolo[] | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Veicolo; direction: 'ascending' | 'descending' } >({key: 'modello', direction: 'ascending'});

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(5);

    const { filtri } = useFiltriContext();

    //ricevuti i filtri, filtro i veicoli in base ai filtri ricevuti
    useEffect(() => {
        if (veicoli && filtri) {
            let _veicoliFiltrati =  veicoli.filter((veicolo) => {
                const matchesTipo = filtri.tipo ? veicolo.tipo === filtri.tipo : true;
                const matchesBrand = filtri.brand ? veicolo.brand === filtri.brand : true;
                const matchesModel = filtri.model ? veicolo.modello === filtri.model : true;
                const matchesAlim = filtri.alim ? veicolo.alimentazione === filtri.alim : true;
                const matchesAnno = filtri.anno ? veicolo.anno === filtri.anno : true;
        
                const matchesKm = filtri.km ? (veicolo.kilometri >= filtri.km.valueA && veicolo.kilometri <= filtri.km.valueB) : true;
                const matchesPrezzo = filtri.prezzo ? (veicolo.prezzo >= filtri.prezzo.valueA && veicolo.prezzo <= filtri.prezzo.valueB) : true;
        
                return matchesTipo && matchesBrand &&  matchesModel &&  matchesAlim && matchesAnno && matchesKm && matchesPrezzo;
            });           

            if (sortConfig !== null) {  //ordinamento di default --> modello
                if (_veicoliFiltrati) {
                    _veicoliFiltrati.sort((a, b) => {
                        if (sortConfig.key !== 'id') {  //esclude la key id dall'ordinamento
                            if (a[sortConfig.key] < b[sortConfig.key]) {
                                return sortConfig.direction === 'ascending' ? -1 : 1;
                            }
                            if (a[sortConfig.key] > b[sortConfig.key]) {
                                return sortConfig.direction === 'ascending' ? 1 : -1;
                            }
                        }
                        return 0;
                    });
                } else {
                    _veicoliFiltrati = [];
                }
            } 

            setVeicoliFiltrati(_veicoliFiltrati);

        }
      
    }, [filtri, sortConfig]);
    
    
    const requestSort = (key: keyof Veicolo) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
          direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const totalVeicoli = veicoliFiltrati ? veicoliFiltrati.length : 0;
    const totalPages = Math.ceil(totalVeicoli / itemsPerPage);
    //console.log('tot pag. ', totalPages)
    const paginatedVeicoli = veicoliFiltrati ? veicoliFiltrati.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    ) : [];

    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(startIndex + itemsPerPage - 1, totalVeicoli);

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

    const handleButtonClick = (veicolo: Veicolo, action: 'update' | 'delete') => async (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        
        if (action === 'update') {
           console.log('update del veicolo: ', veicolo)
           router.push(`/admin/dashboard/veicolo/${veicolo.id}`);
        } else if (action === 'delete') { 
            console.log('canc. del veicolo: ', veicolo)
        }
      };
    
    return (
        <div className={cn(className)}>
            <div className="overflow-x-auto">
                <Table>        
                    <TableHeader className='text-[16px] border-b-2 [&_tr]:hover:bg-transparent dark:[&_tr]:hover:bg-transparent'>
                        <TableRow>
                            <TableHead className="whitespace-nowrap font-bold">
                                <div className="flex items-center justify-center gap-1">
                                    <span>Brand</span>
                                    <span className="w-[18px] cursor-pointer" onClick={() => requestSort('brand')}>{sortedIcon}</span>
                                </div>
                            </TableHead>
                            <TableHead className="whitespace-nowrap font-bold">
                                <div className="flex items-center justify-center gap-2">
                                    <span>Modello</span>
                                    <span className="w-[18px] cursor-pointer" onClick={() => requestSort('modello')}>{sortedIcon}</span>
                                </div>
                            </TableHead>
                            <TableHead className="whitespace-nowrap font-bold">
                                <div className="flex items-center justify-center gap-2">
                                    <span>Anno</span>
                                    <span className="w-[18px] cursor-pointer" onClick={() => requestSort('anno')}>{sortedIcon}</span>
                                </div>
                            </TableHead>
                            <TableHead className="whitespace-nowrap font-bold hidden sm:table-cell">
                                <div className="flex items-center justify-center gap-2">
                                    <span>Alimentazione</span>
                                    <span className="w-[18px] cursor-pointer" onClick={() => requestSort('alimentazione')}>{sortedIcon}</span>
                                </div>
                            </TableHead>
                            <TableHead className="whitespace-nowrap font-bold hidden sm:table-cell">
                                <div className="flex items-center justify-center gap-2">
                                    <span>Km</span>
                                    <span className="w-[18px] cursor-pointer" onClick={() => requestSort('kilometri')}>{sortedIcon}</span>
                                </div>
                            </TableHead>                            
                            <TableHead className="whitespace-nowrap font-bold">
                                <div className="flex items-center justify-center gap-2">
                                    <span>Prezzo</span>
                                    <span className="w-[18px] cursor-pointer" onClick={() => requestSort('prezzo')}>{sortedIcon}</span>
                                </div>
                            </TableHead> 
                            <TableHead ></TableHead>
                        </TableRow>
                    </TableHeader> 
                    <TableBody>
                        {paginatedVeicoli && paginatedVeicoli.map((veicolo, index) => (
                            <TableRow key={index}>
                                <TableCell className="text-center">{veicolo.brand}</TableCell>
                                <TableCell className="max-w-[200px] sm:max-w-xs" title={veicolo.modello}>
                                    <p className="line-clamp-2 text-center">{veicolo.modello}</p>
                                </TableCell>
                                <TableCell className="text-center">{veicolo.anno}</TableCell>
                                <TableCell className="hidden sm:table-cell text-center">{veicolo.alimentazione}</TableCell>
                                <TableCell className="hidden sm:table-cell text-center">{veicolo.kilometri}</TableCell>
                                <TableCell className="sm:table-cell text-center">{veicolo.prezzo}</TableCell> 
                                <TableCell>
                                    <div className="flex gap-3 justify-center">
                                        <Button 
                                            title='Modifica Veicolo'
                                            size='sm' 
                                            className="bg-transparent text-blueShop hover:bg-blueShop/80 hover:text-white p-1  xl:flex xl:items-center xl:justify-center xl:p-2"
                                            onClick={handleButtonClick(veicolo, 'update')}                                            
                                        >
                                            <CiEdit className="h-4 w-4 xl:h-5 xl:w-5"/>
                                        </Button>
                                        <Button 
                                            title='Cancella Veicolo'
                                            size='sm' 
                                            className="bg-transparent text-red-400 hover:bg-red-400 hover:text-white p-1 xl:flex xl:items-center xl:justify-center xl:p-2"
                                            onClick={handleButtonClick(veicolo, 'delete')}
                                        >
                                            <PiTrash className="h-4 w-4 xl:h-5 xl:w-5"/>
                                        </Button>                                        
                                    </div>
                                </TableCell>                          
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
                    Da {startIndex} a {endIndex} su {totalVeicoli} Veicoli
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


export default VeicoliTable;