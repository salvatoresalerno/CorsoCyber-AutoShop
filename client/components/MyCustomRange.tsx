
'use client'

import { ISettingsPointer, RoundSlider } from "mz-react-round-slider";
import { useEffect, useState, useRef } from "react";
import { cn, formatNumber } from "@/lib/utils"


export interface PointerValueArgs {
    firstValue: number | string   | undefined;
    secondValue: number | string   | undefined;
}


interface MyCustomRangeProps extends React.ComponentProps<typeof RoundSlider> {
    className?: string;
    valueA?: number | string | undefined;
    valueB?: number | string | undefined;
    Xfactor?: number;
    Xlabel?: string;
    valueInDisplay?: boolean;
    textSuffix?: string;
    onValueChange?: (values: PointerValueArgs) => void;
}  

const MyCustomRange: React.FC<MyCustomRangeProps> = ({className, valueA=0, valueB=0, Xfactor=1, Xlabel, valueInDisplay=false, textSuffix='',  onValueChange, ...props }) => {

    const [ pointers, setPointers ] = useState<ISettingsPointer[]>([
            {
                value: valueA
            },

            {
                value: valueB
            }
    ]);

    const prevPointersRef = useRef(pointers);

        
    useEffect(() => {
        if (prevPointersRef.current[0].value !== pointers[0].value || prevPointersRef.current[1].value !== pointers[1].value) {
            if (onValueChange) {
              onValueChange({
                firstValue: typeof pointers[0].value === 'number' ? pointers[0].value * Xfactor : pointers[0].value,
                secondValue: typeof pointers[1].value === 'number' ? pointers[1].value * Xfactor : pointers[1].value,
              });
            }
            prevPointersRef.current = pointers; // Aggiorna il ref con i nuovi valori
          }        
    }, [pointers, onValueChange, Xfactor]);

    return(<div className={cn('relative inline-block', className)} >
        <RoundSlider
            textSuffix={ textSuffix }
            showTickValues={ true }
            textBetween=' - '
            textFontSize={20}
            tickValuesColor={'#f45d01'}
            connectionBgColor='#eeb902'
            max={100}
            min={0}
            hideText
            pathStartAngle={ 180 }
            pathEndAngle={ 0}
            enableTicks={ true }
            ticksWidth={ 3 }
            ticksHeight={ 10 }
            longerTicksHeight={ 25 }
            ticksCount={ 100}
            ticksGroupSize={ 5 }
            longerTickValuesOnly={ true }
            ticksDistanceToPanel={ 3 }
            ticksColor={ '#47464785' }
            pointers={ pointers }
            onChange={ setPointers }
            
            {...props}
        />
        {Xlabel && <label className='absolute top-[24%] left-1/2 -translate-x-1/2 font-bold text-xl select-none'>{Xlabel}</label>}    
        {valueInDisplay && <div className='absolute top-[42%] -translate-y-1/2 left-1/2 -translate-x-1/2  w-[43%] h-16 p-1 bg-black text-green-500 font-shareTechMono text-center rounded-lg border-[3px] border-green-700 shadow-lg select-none'>
          <p>{`Da ${typeof pointers[0].value === 'number' ? formatNumber(pointers[0].value * Xfactor) : pointers[0].value} ${textSuffix}`}</p>
          <p>{`A ${typeof pointers[1].value === 'number' ? formatNumber(pointers[1].value * Xfactor) : pointers[1].value} ${textSuffix}`}</p>          
        </div>}        
    </div>)
}

export default MyCustomRange;