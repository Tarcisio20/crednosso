function converterParaNumero(valorReal : string) {
    // Remove "R$", pontos e espaços, substitui vírgula por ponto
    const numero = parseFloat(
        valorReal
            .replace(/[^\d,]/g, '') // Remove tudo exceto números e vírgula
            .replace(',', '.')       // Converte vírgula para ponto
    );
    return isNaN(numero) ? 0 : numero; // Retorna 0 se conversão falhar
}

export const  calcularEstornoBRL = (valorSolicitadoBRL : string, valorRetiradoBRL : string) => {
    // Converte para números
    const valorSolicitado = converterParaNumero(valorSolicitadoBRL);
    const valorRetirado = converterParaNumero(valorRetiradoBRL);

    // Calcula a diferença (não permite valor negativo)
    const diferenca = Math.max(valorSolicitado - valorRetirado, 0);

    // Formata de volta para Real Brasileiro
    return diferenca.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}