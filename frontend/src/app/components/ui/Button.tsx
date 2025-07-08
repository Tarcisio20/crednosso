"use client"

import { cva, VariantProps } from "class-variance-authority";
import { Button as Bt } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

// Define as variantes do botão
const customButtonVariants = cva(
  "font-bold uppercase rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
  {
    variants: {
      size: {
        small: "px-4 h-9 text-sm",
        medium: "px-6 h-10 text-base",
        large: "px-8 h-12 text-lg",
      },
      variant: {
        primary: "bg-blue-500 text-white hover:bg-blue-600 border border-slate-600",
        outline: "bg-transparent text-slate-100 border border-slate-600 hover:bg-slate-700",
        danger: "bg-red-500 text-white hover:bg-red-600 border border-slate-600",
        neutral: "bg-slate-700 text-white hover:bg-slate-600 border border-slate-600",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      size: "medium",
      variant: "primary",
      fullWidth: false,
    },
  }
);


type CustomButtonProps = {
  children: ReactNode;
  color?: string; // cor de fundo
  textColor?: string;
  onClick?: () => void;
  disabled?: boolean;
} & VariantProps<typeof customButtonVariants>;

export const Button = ({ size, color, textColor, disabled, children, onClick, variant }: CustomButtonProps) => {
     return <Bt
      onClick={onClick}
      disabled={disabled}
      className={cn(customButtonVariants({ size, variant }))}
      style={{
        backgroundColor: variant === "primary" && color ? color : undefined,
        color: variant === "primary" && textColor ? textColor : undefined,
      }}
    >
      {children}
    </Bt>
}