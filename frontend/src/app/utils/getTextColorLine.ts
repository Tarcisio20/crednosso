export const getTextColorLine = (status: number) => {
    switch (status) {
      case 1:
        return "text-blue-400";   // exemplo: Em andamento
      case 2:
        return "text-yellow-400"; // exemplo: Pendente
      case 3:
        return "text-green-400";  // exemplo: Aprovado
      case 4:
        return "text-red-400";    // exemplo: Rejeitado
      case 5:
        return "text-purple-400"; // exemplo: Finalizado
      default:
        return "text-white";
    }
  };
  