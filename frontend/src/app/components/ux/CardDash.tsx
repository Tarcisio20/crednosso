"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type CardDashProps = {
    title: string;
    value: string;
    icon : IconDefinition;
}

export const CardDash = ({ title, value, icon }: CardDashProps) => {
    return  <Card className="w-[300px] ">
          <CardHeader>
            <div className="flex items-center justify-center">
              <CardTitle className="text-lg sm:text-xl text-gray-100 select-none ">{title}</CardTitle>
              <FontAwesomeIcon icon={icon} className="ml-auto h-6 w-6" />
            </div>
            <CardDescription>Totais cadastrados</CardDescription>
          </CardHeader>
          <CardContent className="py-2 text-center text-2xl mb-2">
            <p className=" sm:textlg font-bold text-4xl">{value ?? "Nada a mostrar!!"}</p>
          </CardContent>
        </Card>
    
    
    
    // <div className="flex flex-col gap-6 w-80 h-44 bg-[#0082c7]/50 rounded-md pb-2">
    //     <div className=" flex  justify-center items-center text-4xl text-center uppercase font-bold bg-[#0082c7] h-full">{title}</div>
    //     <div className="text-center text-7xl">{value}</div>
    // </div>
}