import { faBackward, faForward } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type PaginationProps = {
    currentPage : number ;
    totalPages : number;
    onPageChange : (newValue : number) => void;
}


export const Pagination = ({ currentPage , totalPages, onPageChange } : PaginationProps) => {
    return (
      <div className="flex justify-center items-center gap-4 text-xl">
        <button 
          onClick={() => onPageChange(currentPage - 1)} 
          disabled={currentPage === 1}
          className="bg-zinc-600 p-1 rounded-xl"
        >
          <FontAwesomeIcon icon={faBackward} color="#FFF" size="1x" />
        </button>
        
        <span className="text-1xl">{currentPage} de {totalPages}</span>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
           className="bg-zinc-600 p-1 rounded-xl"
        >
           <FontAwesomeIcon icon={faForward} color="#FFF" size="1x" />
        </button>
      </div>
    );
  };