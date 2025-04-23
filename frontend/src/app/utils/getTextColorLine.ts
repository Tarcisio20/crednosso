export const getTextColorLine = (status: number) => {
    switch (status) {
      case 2:
        return "text-blue-400"; // exemplo: Pendente
      case 3:
        return "text-blue-400";  // exemplo: Aprovado
      case 4:
        return "text-green-400";    // exemplo: Rejeitado
      case 5:
        return "text-red-400"; // exemplo: Finalizado
      case 6:
        return "text-red-400"; // exemplo: Finalizado
      default:
        return "text-white";
    }
  };
  