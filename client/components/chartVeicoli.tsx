"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect, useState } from "react"
import { cn, formatDate } from "@/lib/utils"
import { Veicolo } from "@/lib/types"

  
type ChartVeicoliProps = {
  auto: Veicolo[];
  moto: Veicolo[];
  className?: string;
  colorAuto: string;
  colorMoto: string;
  chartTitle: string;
  chartDescription: string;
}

type DataChartType = {
  veicolo: string; 
  Auto: number; 
  Moto: number;
  labelAuto: string;
  labelMoto: string; 
} 


export function ChartVeicoli({auto, moto, className, colorAuto, colorMoto, chartTitle, chartDescription}: ChartVeicoliProps) {
  const [chartData, setChartData] = useState<DataChartType[]>();
  const [minY, setMinY] = useState<number>(0);
  const [maxY, setMaxY] = useState<number>(0);

  const chartConfig = {
    auto: {
      label: "Auto",
      color: colorAuto,     
    },

    moto: {
      label: "Moto",
      color: colorMoto,        
    },
  } satisfies ChartConfig 


  useEffect(() => {
    const data = []; 
    let maxVal = 0;
    let minVal = Infinity;

    for (let index = 0; index < auto.length; index++) {
      data.push({
        veicolo: `${index + 1} posto`, 
        Auto: auto[index].prezzo, 
        Moto: moto[index].prezzo,
        labelAuto: auto[index].brand + ' ' + auto[index].modello,
        labelMoto: moto[index].brand + ' ' + moto[index].modello
      });
      maxVal = Math.max(maxVal, auto[index].prezzo, moto[index].prezzo); 
      minVal = Math.min(minVal, auto[index].prezzo, moto[index].prezzo); 
    }  

    const divisoreMax = calcolaDivisore(maxVal);
    const divisoreMin = calcolaDivisore(minVal);

    setChartData(data);
    setMaxY(Math.ceil(maxVal / divisoreMax) * divisoreMax);  //valore max visualizzato nel chart
    setMinY(Math.floor(minVal / divisoreMin) * divisoreMin); //valore min visualizzato nel chart    
  }, []);

  function calcolaDivisore(numero: number) {  //--> calcola il divisore per impostate limiti al chart
    const numeroCifre = numero.toString().length;  
    return Math.pow(10, numeroCifre - 1 );  
  }

  
  return (
    <Card className={cn("w-full select-none", className)}>
      <CardHeader>
        <CardTitle>{chartTitle}</CardTitle>
        <CardDescription>{chartDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} >
          <BarChart accessibilityLayer data={chartData} barSize={20}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="veicolo"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
              //tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              domain={[minY, maxY]}  
              tickFormatter={(value)=> value + ' €'}              
              width={70}  
              values={'95000'}         
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" customTooltip  keyPayload={['labelAuto', 'labelMoto']} tooltipSuffix="€"/>}
            />
            <Bar dataKey="Auto" fill="var(--color-auto)" radius={4}  />
            <Bar dataKey="Moto" fill="var(--color-moto)" radius={4}  />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="gap-4  items-center text-sm">
        <div className="flex sm:flex-col lg:flex-row gap-2 font-medium leading-none ">
           <span>Dati aggiornati ad oggi</span><span className="sm:hidden lg:block">-</span><span className="capitalize">{formatDate({date:new Date(), onlyDate:true, withDay: true})}</span>  
        </div>
        <TrendingUp className="h-4 w-4" />
      </CardFooter> 
    </Card>
  )
}
