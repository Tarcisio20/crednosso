export const returnDefault = (data : { cassete_A : number, cassete_B : number, cassete_C : number, cassete_D : number }) => {
    if(data.cassete_A === 10 && data.cassete_B === 20 && data.cassete_C === 50  && data.cassete_D === 100){
        return 'Padrão Natural'
    }else if(data.cassete_A === 20 && data.cassete_B === 50 && data.cassete_C === 50  && data.cassete_D === 100){
        return 'Padrão CD'
    } else {
        return 'Padrão Desconhecido'
    }
}