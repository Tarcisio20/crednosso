export const  formatedDateToPTBRforEnglish = (date : string) => {
    // brDate no formato "DD/MM/YYYY"
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
  }
  