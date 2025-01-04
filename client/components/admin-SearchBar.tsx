'use client'

import MySliderRange from "@/components/MySliderRange";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel } from "@/components/ui/select";
import { Button } from "./ui/button";
import { useEffect, useMemo, useState } from "react";
import { Alimentazione, FilterParams, Range, TipoVeicolo, Veicolo } from "@/lib/types";
import { useDebouncedCallback } from "use-debounce";
import { useFiltriContext } from "./context/filtriContext";
import { Checkbox } from "./ui/checkbox";
import clsx from "clsx";

type AdminSearchBarProps = {
    veicoli: Veicolo[]; 
}

const AdminSearchBar = ({veicoli}: AdminSearchBarProps) => {

    const [selectedBrand, setSelectedBrand] = useState<string>("");
    const [selectedModel, setSelectedModel] = useState<string>("");
    const [models, setModels] = useState<string[]>([]);
    const [selectedAlimentazione, setSelectedAlimentazione] = useState<string>("");
    const [selectedTipo, setSelectedTipo] = useState<string>(TipoVeicolo.AUTO);
    const [anni, setAnni] = useState<number[]>([]);
    const [selectedAnno, setSelectedAnno] = useState<number | string >("");
    const [prezzo, setPrezzo] = useState<Range>({valueA: 5000, valueB: 20000});
    const [km, setKm] = useState<Range>({valueA: 40000, valueB: 100000});
    const [isValidSearch, setIsValidSearch] = useState<boolean>(false);
    const [checkPrezzo, setCheckPrezzo] = useState<boolean>(true);
    const [checkKm, setCheckKm] = useState<boolean>(true);

    const { setFiltri } = useFiltriContext();

    const brands = useMemo(() => {
        // Filtro i veicoli in base al tipo selezionato
        const veicoliFiltrati = selectedTipo
          ? veicoli.filter((v) => v.tipo === selectedTipo)
          : veicoli;
    
        // Estraggo i brand univoci e ordinati crescenti
        const result = Array.from(new Set(veicoliFiltrati.map((v) => v.brand))).sort((a, b) => a.localeCompare(b));         

        return result;
    }, [veicoli, selectedTipo]);

    useEffect(() => {
        //carico modelli in base al brand selezionato, modelli ord. cresc.
        if (selectedBrand) {
          const filteredModels = Array.from(
            new Set(veicoli.filter((v) => v.brand === selectedBrand).map((v) => v.modello))
            ).sort((a, b) => a.localeCompare(b));  
            setModels(filteredModels);
            setSelectedModel("");  
            setAnni([]);
            setSelectedAnno("");
        } else {
            setModels([]);
            setSelectedModel("");
            setAnni([]);
            setSelectedAnno("");
        }
    }, [selectedBrand, veicoli]);

    useEffect(() => {  //effetto per caricare anno in base al modello e alimentazione
        if (selectedModel) {
            const filteredAnni = Array.from(
              new Set(
                veicoli
                  .filter((v) => v.brand === selectedBrand && v.modello === selectedModel && v.alimentazione === selectedAlimentazione)
                  .map((v) => v.anno)
              )
            ).sort(); // Ordinamento degli anni
            setAnni(filteredAnni);
            setSelectedAnno(""); // Resetta l'anno selezionato
          } else {
            setAnni([]);
            setSelectedAnno("");
          }
    }, [selectedModel, selectedBrand, selectedAlimentazione, veicoli]);


    useEffect(() => {         
        
        const filtriImpostati = selectedBrand && selectedModel && selectedAlimentazione && selectedTipo && selectedAnno;    

        //if((km.valueA===0 && km.valueB === 0) || (prezzo.valueA===0 && prezzo.valueB === 0)) filtriImpostati = "";  //controlla che km o prezzo siano != 0

        setIsValidSearch(filtriImpostati ? true : false);  //--> fara render condizionale per il ring del cerca.

    }, [selectedBrand, selectedModel, selectedAlimentazione, selectedTipo, selectedAnno, km, prezzo]);

    const onSelectedTipo = (value: string) => {
         
        setSelectedTipo(value);
        setSelectedBrand("");
    }

    const handleCheckPrezzo = (checked: boolean) => {
        setCheckPrezzo(checked);
    };

    const handleCheckKm = (checked: boolean) => {
        setCheckKm(checked);
    };

    const onRangePrezzoChange = useDebouncedCallback((value: Range) => {
        setPrezzo({valueA: value.valueA, valueB: value.valueB})
    }, 300);

    const onRangeKmChange = useDebouncedCallback((value: Range) => {
        setKm({valueA: value.valueA, valueB: value.valueB})
    }, 300);

    const handleSearchFilter = async () => {

        if (isValidSearch) {
            const filtro:FilterParams = {
                tipo: selectedTipo,
                brand: selectedBrand,
                model: selectedModel !== 'tutti' ? selectedModel : undefined,
                alim: selectedAlimentazione !== 'tutti' ? selectedAlimentazione : undefined,
                anno:  (typeof selectedAnno === 'number') ? Number(selectedAnno) : undefined,
                //anno: selectedAnno!,
                km: checkKm ? km : undefined,
                prezzo: checkPrezzo ? prezzo : undefined
            }

            setFiltri(filtro);
        } 
    }
   

    return(
        <div className="container mx-auto  w-full">
            <div className="border rounded-lg mt-10 mx-14 p-6 space-y-5"> 
                <RadioGroup className="flex gap-4 text-base md:justify-end lg:justify-start"  value={selectedTipo} onValueChange={onSelectedTipo}>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value={TipoVeicolo.AUTO} id="AUTO" />
                        <label htmlFor="auto">Auto</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value={TipoVeicolo.MOTO} id="moto" />
                        <label htmlFor="moto">Moto</label>
                    </div>
                </RadioGroup> 
                <div className="flex flex-col  gap-2  md:grid md:grid-cols-2 md:gap-3 lg:flex lg:flex-row lg:justify-around lg:gap-4">  {/* mt-5 */}
                    <Select onValueChange={setSelectedBrand} value={selectedBrand} defaultValue="" disabled={!selectedTipo}>
                        <SelectTrigger className="text-base">
                            <SelectValue placeholder="Brand" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Marca</SelectLabel>
                                {brands.map((brand)=>(
                                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                                ))} 
                            </SelectGroup>
                        </SelectContent>
                    </Select>  
                    <Select onValueChange={setSelectedModel} defaultValue="" value={selectedModel} disabled={!selectedBrand}>
                        <SelectTrigger className="text-base">
                            <SelectValue placeholder="Modello" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Modello</SelectLabel>
                                <SelectItem value={'tutti'}>{'-- TUTTI --'}</SelectItem>
                                {models.map((model)=> (
                                    <SelectItem key={model} value={model}>{model}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Select onValueChange={setSelectedAlimentazione} defaultValue=""  value={selectedAlimentazione}>
                        <SelectTrigger className="text-base">
                            <SelectValue placeholder="Alimentazione" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Alimentazione</SelectLabel>
                                <SelectItem value={'tutti'}>{'-- TUTTI --'}</SelectItem>
                                {Object.values(Alimentazione).map((alimentazione) => (
                                    <SelectItem key={alimentazione} value={alimentazione}>
                                        {alimentazione}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Select onValueChange={(anno) => setSelectedAnno(anno.toString())} defaultValue="" value={selectedAnno ? selectedAnno.toString() : ""} disabled={!selectedModel}>
                        <SelectTrigger className="text-base">
                            <SelectValue placeholder="Anno" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Anno</SelectLabel>
                            <SelectItem value={'tutti'}>{'-- TUTTI --'}</SelectItem>
                            {anni.map((anno) => (
                                <SelectItem key={anno} value={anno.toString()}>
                                    {anno}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                        </SelectContent>
                    </Select>
                </div> 
                <div className="flex flex-col gap-6 px-2 lg:flex-row lg:gap-10 ">  {/* mt-10  */}
                    <div className="flex gap-3 w-full order-1 lg:order-none">
                        <Checkbox 
                            className="focus-visible:ring-0"
                            id="prezzo" 
                            checked={checkPrezzo}
                            onCheckedChange={handleCheckPrezzo}
                        />
                        <div className={clsx('w-full', {'pointer-events-none opacity-40':!checkPrezzo})}>
                            <MySliderRange 
                                //className="order-1 lg:order-none"
                                className=""
                                min={0}
                                max={100000}
                                step={500}
                                label="Prezzo"
                                ticksCount={6}
                                value={[prezzo.valueA, prezzo.valueB]}
                                //defaultValue={[4000,20000]}
                                xFactor={0}
                                onRangeChange={onRangePrezzoChange}
                                styles={{
                                    //rail: { backgroundColor: 'red', height: 15 },
                                    track: { backgroundColor: '#2d7dd2' },
                                    handle: { borderWidth: 1, height: 24, width: 24, marginTop: -10,   boxShadow: '0 0 0 1px #C6C6C6'   },
                                }}
                            />
                        </div>
                    </div>
                    <Button className={clsx("space-x-2 self-end bg-orange-400 hover:bg-orange-400/80 order-3 focus-visible:ring-0 lg:order-none active:text-lime-300", {"active:text-red-500":!isValidSearch} )} onClick={handleSearchFilter}>Cerca</Button>
                    <div className="flex gap-3 w-full order-1 lg:order-none">
                        <Checkbox 
                            className="focus-visible:ring-0"
                            id="km" 
                            checked={checkKm}
                            onCheckedChange={handleCheckKm}
                        />
                        <div className={clsx('w-full', {'pointer-events-none opacity-40':!checkKm})}>
                            <MySliderRange 
                                //className="order-2 lg:order-none"
                                min={0}
                                max={400000}
                                step={500}
                                label="Km"
                                ticksCount={6}
                                value={[km.valueA, km.valueB]}
                                //defaultValue={[4000,20000]}
                                xFactor={0}
                                onRangeChange={onRangeKmChange}
                                styles={{
                                    //rail: { backgroundColor: 'red', height: 15 },
                                    track: { backgroundColor: '#2d7dd2' },
                                    handle: { borderWidth: 1, height: 24, width: 24, marginTop: -10,   boxShadow: '0 0 0 1px #C6C6C6'   },
                                }}
                            />
                        </div>
                    </div>
                </div>  
                
            </div>
        </div>
    )
}

export default AdminSearchBar;