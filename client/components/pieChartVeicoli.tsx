 "use client"

import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"

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
import { cn, formatDate } from "@/lib/utils"  

type DataPieChartType = {
    veicolo: string; 
    prezzo: number;
     
}

type PieChartVeicoliProps = {    
    className?: string;
    dataChart: DataPieChartType[]
    chartTitle: string;
    chartDescription: string;
}

export function PieChartVeicoli({className, chartTitle, chartDescription, dataChart}: PieChartVeicoliProps) {

    const chartConfig = {

        auto: {
            label: "Auto",
            //color: colorAuto,   
        },

        moto: {
            label: "Moto",
            //color: colorMoto,     
        },
    } satisfies ChartConfig 

    
    

  return (
    <Card className={cn("flex flex-col w-full select-none", className)}>
      <CardHeader className="pb-0">
        <CardTitle>{chartTitle}</CardTitle>
        <CardDescription>{chartDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart className="h-40">
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel tooltipSuffix="€"/>}              
            />
            <Pie
              data={dataChart}
              dataKey="prezzo"
              nameKey="veicolo"
              innerRadius={60}
            />
          </PieChart>
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
 

