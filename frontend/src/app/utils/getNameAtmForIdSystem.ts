import { getAtmFronId } from "../service/atm"

export const getNameAtmForIdSystem = async  (id_atm_system: number) => {
     if (
      id_atm_system === undefined || 
      id_atm_system === null || 
      isNaN(Number(id_atm_system))
    ) {
      return "Erro ao Pesquisar"
    }
    const atm = await getAtmFronId(id_atm_system.toString())
    if (atm.data !== undefined && atm.status === 200) {
        return atm.data.name
    }

    return "Erro ao Pesquisar"
}