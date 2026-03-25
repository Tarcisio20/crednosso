import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


type Props = {
    label: string;
    description?: string;
    icon?: IconProp;
    addButton?: React.ReactNode;
    children: React.ReactNode;
}
export default function CardCustomizer({ label, description, icon, addButton, children }: Props) {
    return <Card className="border border-zinc-400 rounded-md p-2" >
        <CardHeader>
            <CardTitle className="flex justify-between">
                <div>
                {icon &&
                    <FontAwesomeIcon icon={icon} size="2x" color="#FFF" />
                }
                {label}
                
                </div>
                {addButton}
                </CardTitle>

            {description &&
                <CardDescription >{description}</CardDescription>
            }
        </CardHeader>
          <CardContent className="max-h-[500px]" >{children}</CardContent>
    </Card>
}