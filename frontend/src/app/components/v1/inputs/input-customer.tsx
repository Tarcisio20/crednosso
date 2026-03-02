import { IconProp } from "@fortawesome/fontawesome-svg-core";

type InputCustomerProps = {
    label?: string;
    size: 'small' | 'meddium' | 'large' | 'extra-large';
    icon?: IconProp;
    mask?: 'phone' | 'currency' | 'email';
}

export default function InputCustomer({ label, size, icon, mask, ...props }: InputCustomerProps) {
    return (<></>)
   
}


