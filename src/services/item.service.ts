import axios from "axios";
import { Types } from "src/types";
import { injectable } from "tsyringe";

@injectable()
export class Item {
  constructor() {
    console.log(`Item service has been initialized`);
  }
  async getMany() {
    const response = await axios.get<Types.Item[]>(
      "https://api.skinport.com/v1/items",
      {
        params: {
          app_id: 730,
          currency: "EUR",
          tradable: 1,
        },
        headers: {
          "Accept-Encoding": "br",
        },
      }
    );

    const data = response.data;

    return data;
  }
}
