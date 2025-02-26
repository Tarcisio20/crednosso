export const generateValueTotal = (value_10 : number, value_20 : number, value_50 : number, value_100 : number) => {
    return ((value_10 * 10) + (value_20 * 20) + (value_50 * 50) + (value_100 * 100)).toLocaleString('pt-BR', {
          style: 'currency',
        currency: 'BRL'
    })
}