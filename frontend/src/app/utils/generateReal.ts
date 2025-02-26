export const generateReal = (value : number, index : number) => {
    return (value * index).toLocaleString('pt-BR', {
          style: 'currency',
        currency: 'BRL'
    })
}