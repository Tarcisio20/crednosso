import { faCircleCheck, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

type MessegerProps = {
    type : string;
    title : string;
    messege : string;
}

export const Messeger = ({ type, title, messege } : MessegerProps) => {
    return <div className="flex justify-center items-center flex-col  text-center p-2">
        <div className={`
            flex justify-center items-center w-2/4 gap-4 
            ${ type === 'error' ? 'bg-[#dc143c] border-2 border-[#ff0000]' : ''}
            ${ type === 'success' ? 'bg-[#478f4e] border-2 border-[#008000]' : ''}
            `}>
        {type === 'error' && 
            <FontAwesomeIcon icon={faTriangleExclamation} color="#FFF" size="2x" />
        }
         {type === 'success' && 
            <FontAwesomeIcon icon={faCircleCheck} color="#FFF" size="2x" />
        }
            <label className="text-2xl">{title}</label>
        </div>
        <div className={`text-white  w-2/4 pt-2 pb-4
            ${type === 'error' ? 'bg-[#cd5c5c]' : ''}
            ${type === 'success' ? 'bg-[#3cb371]' : ''}
            `}>{messege}</div>
    </div>
}