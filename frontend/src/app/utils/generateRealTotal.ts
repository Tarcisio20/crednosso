export const generateRealTotal = (valueA : number, valueB : number, valueC : number, valueD : number) => {
    return ((valueA * 10) + (valueB * 20) + (valueC * 50) + (valueD * 100)).toLocaleString('pt-BR', {
          style: 'currency',
        currency: 'BRL'
    })
}