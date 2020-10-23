export interface Item {
  id: number;
  quantity: number;
}

export interface IGW2Service {
  getItem(name: string, apiKey: string): Item;
}

// export class GW2Api implements IGW2Service {

// }
