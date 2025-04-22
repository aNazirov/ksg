import axios from "axios";
import path from "path";
import Piscina from "piscina";
import { Types } from "src/types";
import { injectable } from "tsyringe";

@injectable()
export class Item {
  private readonly piscina: Piscina<
    {
      tradable: Types.Item[];
      untradable: Types.Item[];
    },
    Types.ItemWithTradableMinPrice[]
  >;

  constructor() {
    const piscina = new Piscina({
      filename: path.resolve(__dirname, "../worker-handlers/items-handler"),
      maxThreads: 4,
    });

    this.piscina = piscina;
    console.log(`Item service has been initialized`);
  }

  async getMany() {
    const promises = [
      axios.get<Types.Item[]>("https://api.skinport.com/v1/items", {
        params: {
          app_id: 730,
          currency: "EUR",
          tradable: 1,
        },
        headers: {
          "Accept-Encoding": "br",
        },
      }),
      axios.get<Types.Item[]>("https://api.skinport.com/v1/items", {
        params: {
          app_id: 730,
          currency: "EUR",
          tradable: 0,
        },
        headers: {
          "Accept-Encoding": "br",
        },
      }),
    ];

    const [tradable, untradable] = await Promise.all(promises);

    const result = await this.piscina.run({
      tradable: tradable.data,
      untradable: untradable.data,
    });

    return result;
  }
}
