export const gerarNomeArquivo = (titulo: string, dados: any[]) => {

  console.log("Gerando nome do arquivo para", titulo, "com dados:", dados)
  const dataOriginal = dados[0]?.date

  const data = new Date(dataOriginal)

  const ano = data.getFullYear()
  const mes = String(data.getMonth() + 1).padStart(2, "0")
  const dia = String(data.getDate()).padStart(2, "0")

  const dataFormatada = `${ano}-${mes}-${dia}`

  const contaPagamento = dados[0]?.conta_pagamento ?? ""

  const agencia = contaPagamento.includes("Agência: ")
    ? contaPagamento.split("Agência: ")[1]?.split(" - ")[0]?.trim() ?? "sem-agencia"
    : "sem-agencia"

  const conta = contaPagamento.includes("Conta: ")
    ? contaPagamento.split("Conta: ")[1]?.trim() ?? "sem-conta"
    : "sem-conta"

  return `pedido-${dataFormatada}-${titulo}-agencia-${agencia}-conta-${conta}-a.pdf`
}