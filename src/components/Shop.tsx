"use client";

import { getShopItems } from "@/server/Database";
import React from "react";
import { Searchbar } from "@/components/Searchbar";
import { Item } from "@/types/5eTools/Item";

const ValueLabel = (props: { value: number }) => {
  const gold = Math.floor(props.value / 100);
  const silver = Math.floor((props.value - gold * 100) / 10);
  const copper = props.value - gold * 100 - silver * 10;

  return (
    <label className="flex w-full items-center justify-end gap-1 text-end">
      {gold}
      <i className="bi bi-coin pt-1 text-yellow-300"></i> &nbsp;
      {silver}
      <i className="bi bi-coin pt-1 text-gray-200"></i> &nbsp;
      {copper}
      <i className="bi bi-coin pt-1 text-orange-300"></i>
    </label>
  );
};

export const Shop = (props: {}) => {
  const [filter, setFilter] = React.useState<string>("");
  const [items, setItems] = React.useState<Item[]>([]);
  React.useEffect(() => {
    getShopItems().then((items) => {
      setItems(items.filter((item) => item.value != undefined));
    });
  }, []);

  return (
    <div className="relative flex w-full grow flex-col gap-2 overflow-y-scroll p-2">
      <Searchbar filter={filter} setFilter={setFilter} />
      {filter.length > 1 ? (
        <>
          {items
            .filter((item) =>
              item.name.toLowerCase().match(filter.toLowerCase()),
            )
            .map((item, i) => {
              return (
                <div
                  key={i}
                  className="flex w-full flex-col justify-between gap-2 rounded-full rounded-xl bg-french-700 p-2 px-4 text-white"
                >
                  <label>{item.name}</label>
                  {item.entries != undefined
                    ? item.entries.map((entry, i) => {
                        if (typeof entry === "string") {
                          return <label key={i}>{entry}</label>;
                        }
                        return null;
                      })
                    : null}
                  {item.value ? <ValueLabel value={item.value} /> : null}
                </div>
              );
            })}
        </>
      ) : (
        <a className="px-4 pb-6 text-french-100">
          Type in the search bar to show items.
        </a>
      )}
    </div>
  );
};
