"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { faCheck, faPenToSquare, faTrash, faUserTie, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/app/components/ui/Button";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { userSaveType } from "@/types/userSaveType";
import Link from "next/link";
import { toast } from "sonner";
import { getAllPagination } from "@/app/service/user";

export default function User() {
  const router = useRouter()

  const [users, setUsers] = useState<userSaveType[]>([])
  const [loadingng, setLoading] = useState(false)

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 16;

  useEffect(() => {
    document.title = "Usuários | CredNosso";
  }, []);

  const getAllUsersPagination = useCallback(async () => {
    setLoading(true);
    const allUsers = await getAllPagination(currentPage, pageSize);
    console.log(allUsers)
    if (allUsers.status === 300 || allUsers.status === 400 || allUsers.status === 500) {
      toast.error('Erro de requisição, tente novamente')
      setLoading(false);
      return;
    }
    if (allUsers.data !== undefined && allUsers.data.users.data.length > 0) {
      setUsers(allUsers.data.users.data);
      setTotalPages(allUsers.data.users.totalPages);
      setLoading(false);
      return;
    } else {
      toast.error('Sem dados a carregar, tente novamente!')
      setLoading(false);
      return;
    }
  }, [currentPage])



  useEffect(() => {
    getAllUsersPagination();
  }, [currentPage, getAllUsersPagination]);

  const handleAdd = () => {
    setLoading(true)
    router.push("/user/add");
    setLoading(false)
    return
  }

  const handleDelete = async (e: React.MouseEvent<HTMLAnchorElement>, id: number) => {
    e.preventDefault()
    
    // setLoading(false);
    // setLoading(true);
    // if (!id) {
    //   toast.error('Selecione um Usuário, para continunar')
    //   setLoading(false);
    //   return;
    // }
    // const deleteAtm = await del(id)
    // if (deleteAtm.status === 300 || deleteAtm.status === 400 || deleteAtm.status === 500) {
    //   toast.error('Erro de requisição, tente novamente')
    //   setLoading(false);
    //   return;
    // }
    // if (deleteAtm.status === 200) {
    //   toast.success('Atm deletado com sucesso!')
    //   setLoading(false);
    //   getAllAtmsPagination();
    //   return;
    // }
  };


  return <Page>
    <TitlePages linkBack="/" icon={faUserTie}>
      Usuários
    </TitlePages>
    <div className="flex flex-col gap-4 p-5 w-full">
      <div className="flex flex-col gap-3 items-center justify-center mb-4">
        <Button
          color="#2E8B57"
          variant={"primary"}
          textColor="white"
          onClick={handleAdd}
          size="medium"
        >
          Adicionar
        </Button>
      </div>
      <table className="flex-1 text-center p-3" width="100%">
        <thead className="border-b-2 border-b-zinc-500 uppercase pb-2 text-2xl">
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Slug</th>
            <th>E-mail</th>
            <th>Ativo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody className=" text-xl">
          {users &&
            users.map((item, index) => (
              <tr key={index}
                className={`h-12 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-600'
                  } hover:bg-zinc-300 transition-colors hover:text-black`}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.slug}</td>
                <td>{item.email}</td>
                <td>
                  {item.status ? (
                    <FontAwesomeIcon
                      icon={faCheck}
                      size="2x"
                      color="#2E8B57"
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faXmark}
                      size="2x"
                      color="#BF6C6C"
                    />
                  )}
                </td>
                <td className="flex justify-center items-center gap-4 h-12">
                  <Link href={`/user/edit/${item.id}`} >
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      size="1x"
                      color="#6C8EBF"
                    />
                  </Link>
                  <a href={`/atm/del/${item.id}`} onClick={(e) => handleDelete(e, item.id as number)} className="cursor-pointer" >
                    <FontAwesomeIcon
                      icon={faTrash}
                      size="1x"
                      color="#BF6C6C"
                    />
                  </a>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  </Page>

}