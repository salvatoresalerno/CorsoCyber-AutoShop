'use client'


import { Range } from "@/lib/types";
import Slider, { SliderProps } from "rc-slider";
import 'rc-slider/assets/index.css';
import { useEffect, useState } from "react";


interface RangeSliderProps extends SliderProps {
    min: number;
    max: number; 
    ticksCount: number;
    value?: [number, number]; 
    onRangeChange?: (range: Range) => void;
    xFactor?: number;
    label?: string;
  }


const MySliderRange: React.FC<RangeSliderProps> = ({min, max,  ticksCount, xFactor=1, value = [min, max] , onRangeChange, label='', ...props }) => {

    const safeXFactor = xFactor > 0 ? xFactor : 1;  //mi assicuro che xFactor sia sempre > 0 

    const [range, setRange] = useState<[number, number]>([value[0], value[1]]);

    useEffect(() => {
        
        if (onRangeChange) {
            onRangeChange({ valueA: range[0] * safeXFactor, valueB: range[1] * safeXFactor });
        }  
      
    }, [range, safeXFactor, onRangeChange]);
     
    
    
    const createTicks = (min:number, max:number, ticksCount:number ) => {
        const marks: { [key: number]: string } = {}

        Array.from({ length: ticksCount    }, (_, index) => {
            const value = Math.round(min + (index * (max - min) / (ticksCount  -1)));
            return  marks[value] =  value.toString()
        })

        return marks;        
    }

    const handleRangeChange = (value: number | number[]) => {
        if (Array.isArray(value) && value.length === 2) {
            setRange([value[0], value[1]] as [number, number]);
          }
    };

    const handleToInputChange = (event: React.FormEvent<HTMLInputElement>) => {
        const value = parseInt(event.currentTarget.value, 10);  
        if (!isNaN(value)) {
            setRange([range[0], value / safeXFactor]);  
        }
    }
    const handleFromInputChange = (event: React.FormEvent<HTMLInputElement>) => {
        const value = parseInt(event.currentTarget.value, 10);  
        if (!isNaN(value)) {
            setRange([value / safeXFactor, range[1]]);  
        }
    }

    return ( 
        <div className="sliderRange_container w-full">
            <div className="sliderRange_control">
                <Slider 
                    range
                    min={min}
                    max={max}
                    value={range}
                    onChange={handleRangeChange}
                    allowCross={false}
                    marks={createTicks(min, max, ticksCount)}  
                    {...props}
                />
            </div>
            <div className="sliderRange_form_control_container relative flex flex-col items-center gap-[5px] w-full mt-[25px] text-lg py-0 px-[10px] text-[#635a5a]  sm:flex-row sm:justify-evenly sm:mt-5">            
                <div className="sliderRange_form_control flex flex-row justify-center gap-3 w-full order-2  sm:flex-col sm:gap-0 sm:w-auto sm:order-none">  
                    <div className="sliderRange_label_input font-normal text-center">Min</div>
                    <input
                        className="form_control_container__min__input text-[#8a8383] w-[110px] text-lg border border-[#ccc] rounded-[5px] pl-[10px] focus-visible:outline  focus-visible:outline-1 focus-visible:outline-[#abe2fb]"
                        type="number"
                        min={min * safeXFactor}
                        max={max * safeXFactor}
                        step={props.step ? props.step : 1}
                        value={range[0] * safeXFactor}
                        onInput={handleFromInputChange}
                    />
                </div>
                {label && <label className='form_control_container__label text-2xl font-semibold self-center order-1 sm:self-end sm:order-none'>{safeXFactor > 1 ? `${label} x${safeXFactor}` : label}</label>}
                <div className="sliderRange_form_control flex flex-row justify-center gap-3 w-full order-2 sm:flex-col sm:gap-0 sm:w-auto sm:order-none">
                    <div className="sliderRange_label_input font-normal text-center">Max</div>
                    <input
                        className="form_control_container__max__input text-[#8a8383] w-[110px] text-lg border border-[#ccc] rounded-[5px] pl-[10px] focus-visible:outline  focus-visible:outline-1 focus-visible:outline-[#abe2fb]"
                        type="number"
                        min={min * safeXFactor}
                        max={max * safeXFactor}
                        step={props.step ? props.step : 1}
                        value={range[1] * safeXFactor}
                        onInput={handleToInputChange}
                    />
                </div>
            </div>
            <style jsx>{`   
                .sliderRange_container :global(.rc-slider-handle:hover) {
                    background: #f7f7f7;                     
                }
                     
                .sliderRange_container :global(.rc-slider-handle:active) {
                    box-shadow: inset 0 0 3px #387bbe, 0 0 9px #387bbe !important;
                    -webkit-box-shadow: inset 0 0 3px #387bbe, 0 0 9px #387bbe !important;                   
                }

                input[type=number]::-webkit-inner-spin-button, 
                    input[type=number]::-webkit-outer-spin-button {  
                    opacity: 1;
                }
            `}</style>
        </div>
    )

}

export default MySliderRange



