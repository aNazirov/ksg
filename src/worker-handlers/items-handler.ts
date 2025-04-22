import { Types } from "src/types";

export default ({
  tradable,
  untradable,
}: {
  tradable: Types.Item[];
  untradable: Types.Item[];
}) => {
  const tradableMap = new Map<string, number>();

  for (const item of tradable) {
    tradableMap.set(item.market_hash_name, item.min_price);
  }

  const result: Types.ItemWithTradableMinPrice[] = [];

  for (const item of untradable) {
    const tradableMinPrice = tradableMap.get(item.market_hash_name);

    result.push(Object.assign(item, { tradable_min_price: tradableMinPrice }));
  }

  return result;
};
