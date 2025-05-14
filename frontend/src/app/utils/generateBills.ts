type Bills = {
  bills_100: number;
  bills_50: number;
  bills_20: number;
  bills_10: number;
};

export const  generateBills =  (amount: number): Bills | false =>  {
  const bills: Bills = {
    bills_100: 0,
    bills_50: 0,
    bills_20: 0,
    bills_10: 0,
  };

  if (amount % 10 !== 0) {
    return false
  }

  bills.bills_100 = Math.floor(amount / 100);
  amount %= 100;

  bills.bills_50 = Math.floor(amount / 50);
  amount %= 50;

  bills.bills_20 = Math.floor(amount / 20);
  amount %= 20;

  bills.bills_10 = Math.floor(amount / 10);

  return bills;
}
