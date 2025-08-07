import { ordersWithTreasuriesProps } from "../(private)/supply/add/page";

export const removeDuplicateInOrders = ( orders: ordersWithTreasuriesProps[] ) : number[] =>  {
  const ids = new Set<number>();
  for (const order of orders) {
    ids.add(order.id_treasury_origin); // ou outro campo
  }
  return Array.from(ids);
}
