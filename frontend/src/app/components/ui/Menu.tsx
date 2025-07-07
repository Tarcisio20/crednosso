"use client0"

import { faRightFromBracket, faShieldHalved, IconDefinition } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/navigation";

type ItemMenu = {
  label : string;
  icon: IconDefinition;
  link: string
}

type NavProps = {
  menu : ItemMenu[];
  onClose?: () => void
  onLoadingStart?: () => void
}

export const Nav = ({ menu, onClose, onLoadingStart } : NavProps) => {

  const router = useRouter();

  const handleClick = (link : string) => {
    if (onLoadingStart) onLoadingStart(); // mostra loading
    if (onClose) onClose();               // fecha menu
    router.push(link);         
  }
 
  return <nav className="grid gap-6 text-lg font-medium">
    <Link href="/" className="flex h-10 w-10 bg-primary rounded-full text-lg items-center justify-center
      text-primary-foreground md:text-base gap-2"
      prefetch={false} // Disable prefetching for this link
    >
      <FontAwesomeIcon icon={faShieldHalved} size="1x" color="#FFF" className="h-5 w-5 transition-all" />
      <span className="sr-only">Logo do Projeto</span>
    </Link>

    {menu.map((item, index) => (
      <Link key={index} href={item.link} className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
        prefetch={false} onClick={() => handleClick(item.link)} // Disable prefetching for this link 
      >
        <FontAwesomeIcon icon={item.icon} size="1x" color="#FFF" className="h-5 w-5 transition-all text-muted-foreground hover:text-foreground" />
        {item.label}
      </Link>
    ))}
    <Link  href="/sign-out" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
        prefetch={false} // Disable prefetching for this link
        onClick={() => handleClick("/sign-out")} // Disable prefetching for this link
      >
        <FontAwesomeIcon icon={faRightFromBracket} size="1x" color="#FFF" className="h-5 w-5 transition-all text-muted-foreground hover:text-foreground" />
        Sair
      </Link>
  </nav>



  // <ul className="bg-[#0082c7]">
  //   {menu.map((item, index) => (
  //     <li key={index} className=" bg-[#0082c7] uppercase hover:bg-[#4682b4] cursor-pointer">
  //       <Link href={item.link} className="" >{
  //         <FontAwesomeIcon icon={item.icon} size="1x" color="#FFF" className="h-5 w-5 transition-all" />
  //       }
  //         <span>
  //           {item.label}
  //         </span>
  //       </Link>
  //     </li>
  //   ))}
  //   <li className=" bg-red-600 uppercase hover:bg-red-700 cursor-pointer">
  //     <Link href="/sign-out" className="">
  //       <FontAwesomeIcon icon={faRightFromBracket} size="1x" color="#FFF" className="h-5 w-5 transition-all" />
  //       <span>
  //         Sair
  //       </span>
  //     </Link>
  //   </li>
  // </ul>
}