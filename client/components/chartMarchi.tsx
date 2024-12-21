"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect, useState } from "react"
import { cn, formatDate } from "@/lib/utils"


type ConteggioMarchio = {
  marchio: string;
  conteggio: number;
};

type ChartMarchiProps = {
  marchioAuto: ConteggioMarchio[];
  marchioMoto: ConteggioMarchio[];
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
  marchioAuto: string;
  marchioMoto: string;
} 

export function ChartMarchi({marchioAuto, marchioMoto, className, colorAuto, colorMoto, chartTitle, chartDescription}: ChartMarchiProps) {

  const [chartData, setChartData] = useState<DataChartType[]>();    

  useEffect(() => {
    const data = []; 

    for (let index = 0; index < marchioAuto.length; index++) {
      data.push({
        veicolo: `${index + 1} posto`, 
        Auto: marchioAuto[index].conteggio, 
        Moto: marchioMoto[index].conteggio,
        marchioAuto: marchioAuto[index].marchio,
        marchioMoto: marchioMoto[index].marchio,
      });       
    }  

    setChartData(data);     
  }, []);


   

  return (
    <Card className={cn("w-full select-none flex flex-col justify-between", className)}>
      <CardHeader>
        <CardTitle>{chartTitle}</CardTitle>
        <CardDescription>{chartDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} >
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey="veicolo"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}              
            />
            <XAxis  type="number" hide />
            <ChartTooltip
              cursor={false}              
              content={<ChartTooltipContent customTooltip  keyPayload={['marchioAuto', 'marchioMoto']}/>}
            />
            <Bar dataKey="Auto" layout="vertical" radius={5} fill={colorAuto} />
            <Bar dataKey="Moto" layout="vertical" radius={5} fill={colorMoto} />
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
