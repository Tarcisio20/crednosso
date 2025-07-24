"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import {
  faBuildingColumns,
  faCheck,
  faCloudArrowDown,
  faDownLong,
  faPenToSquare,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Loading } from "@/app/components/ux/Loading";
import { treasuryType } from "@/types/treasuryType";
import { returnNameTreasury } from "@/app/utils/returnNameTreasury";
import { returnDefault } from "@/app/utils/returnDefault";
import { Messeger } from "@/app/components/ux/Messeger";
import { Pagination } from "@/app/components/ux/Pagination";
import { accountBankType } from "@/types/accountBankType";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { downloadArchive, getAllPagination } from "@/app/service/download";

export default function Archives() {
  const router = useRouter();

  const [downloads, setDownloads] = useState<any[] | []>([]);
  const [error, setError] = useState({ type: '', title: '', messege: '' })
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 15;

  useEffect(() => {
    document.title = "Download | CredNosso";
  }, []);


  const allDownloadPagination = useCallback(async () => {
    setLoading(true);
    const allDownload = await getAllPagination(currentPage, pageSize);
    if (allDownload.data !== undefined && allDownload.data.data.length > 0) {
      setDownloads(allDownload.data.data);
      setTotalPages(allDownload.data.totalPages);
      setLoading(false);
      return;
    } else {
      setLoading(false);
      toast.error('Sem dados a carregar, tente novamente!');
      return;
    }
    setLoading(false);
  }, [currentPage]);

  const handleDownloadArchive = async (name: string) => {
    const down = await downloadArchive(name)
    if(down.data === undefined) {
      toast.error('Erro ao baixar arquivo, tente novamente!')
      return
    }else{
      toast.success('Arquivo baixado com sucesso!')
      return
    }
  }


  useEffect(() => {
    allDownloadPagination();
  }, [currentPage, allDownloadPagination]);


  return (
    <Page>
      <TitlePages linkBack="/" icon={faCloudArrowDown}> Downloads </TitlePages>
      <div className="flex flex-col gap-4 p-5 w-full">
        <Card>
          <CardHeader>
            <CardTitle>Saldos de Atms</CardTitle>
            <CardDescription>Saldos dos atms do dia atual</CardDescription>
          </CardHeader>
          <CardContent>
            {downloads && downloads.map((item, index) => (
              <div
                key={index}
                className={`flex justify-between items-center px-4 py-2 rounded-lg 
                  ${index % 2 === 0 ? 'bg-gray-800' : 'bg-transparent'}
                  ${index === 0 ? 'rounded-t-lg' : ''}
              `}
              >
                <div className="text-lg">{item}</div>
                <Link href={`/download/${item}`} onClick={(e) => {
                  e.preventDefault()
                  handleDownloadArchive(item)
                }}>
                  <FontAwesomeIcon icon={faDownLong} size="1x" />
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>
        {error.messege && (
          <Messeger type={error.type} title={error.title} messege={error.messege} />
        )}
        {loading && <Loading />}
      </div>
    </Page>
  );
}
