
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft  } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import Link from 'next/link';

type TitlePagesProps = {
    children : React.ReactNode;
    linkBack ?: string;
    icon : IconProp
}

export const TitlePages = ({ children, linkBack, icon } : TitlePagesProps) => {
    return <div className="flex w-full items-center gap-5 border-b-2 border-zinc-900 p-3">
        {linkBack &&
            <Link href={linkBack}>
                <div className="w-14 h-14 bg-zinc-600 rounded-full flex justify-center items-center hover:bg-zinc-500">
                    <FontAwesomeIcon icon={faChevronLeft} size="2x" color="#FFF" />
                </div>
            </Link>
        }
        <div className='flex gap-3 justify-center'>
            <FontAwesomeIcon icon={icon} size="2x" color="#FFF" />
            <div className='flex-1 text-4xl uppercase font-bold'>{children}</div>
        </div>
    </div>
}