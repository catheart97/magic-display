import React from "react";
import { getBestiary, getSpells } from "@/server/Database";
import * as IDB from "idb-keyval";
import { useQuery } from "@tanstack/react-query";
import { NavBar } from "@/components/NavBar";
import { Searchbar } from "@/components/Searchbar";
import { BeastCard } from "@/components/BeastCard";
import { SpellCard } from "@/components/SpellCard";
import { Monster } from "@/types/5eTools/Bestiary";
import { Spell } from "@/types/5eTools/Spell";

const CompendiumCard = (props: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex h-full w-96 max-w-96 flex-col gap-2 rounded-xl bg-french-700 p-2">
      <div className="p-2 text-3xl text-white">{props.title}</div>
      <div className="grow">{props.children}</div>
    </div>
  );
};

const BestiaryCompendium = () => {
  const [filter, setFilter] = React.useState("");
  const { data: bestiary, isLoading: bestiaryLoading } = useQuery({
    queryKey: ["bestiary"],
    queryFn: async () => {
      // check idb first
      const data = await IDB.get("bestiary");
      if (data) {
        return data as Monster[];
      }
      let bestiary = await getBestiary();
      bestiary = bestiary
        .filter((m) => {
          // Monsters Manual
          // Mordenkainens Monsters of the Multiverse
          // Tasha's Cauldron of Everything
          // Volo's Guide to Monsters
          // Xanathar's Guide to Everything
          if (
            m.source == "MM" ||
            m.source == "MPMM" ||
            m.source == "TCE" ||
            m.source == "VGM" ||
            m.source == "PHB" ||
            m.source == "XGE"
          ) {
            return true;
          }
          return false;
        })
        .filter((m) => {
          return (
            (m.type === "beast" || m.type === "elemental") &&
            m.cr &&
            parseInt(typeof m.cr === "string" ? m.cr : m.cr.cr) <= 6
          );
        })
        .toSorted(
          (a, b) =>
            // sort first by cr, then by name
            parseInt(typeof a.cr === "string" ? a.cr : a.cr!.cr) -
              parseInt(typeof b.cr === "string" ? b.cr : b.cr!.cr) ||
            a.name.localeCompare(b.name),
        );
      IDB.set("bestiary", bestiary);
      return bestiary;
    },
  });

  return (
    <CompendiumCard title="Druid Bestiary">
      <div className="flex h-full w-full flex-col">
        <Searchbar filter={filter} setFilter={setFilter} />
        <div className="h-0 grow gap-2 overflow-y-scroll">
          {filter.length > 1 && bestiary ? (
            bestiary
              ?.filter((m) =>
                m.name.toLowerCase().includes(filter.toLowerCase()),
              )
              .map((m) => (
                <div
                  key={m.name + m.source}
                  className="my-2 h-fit w-full overflow-hidden rounded-xl bg-french-100"
                >
                  <BeastCard data={m} />
                </div>
              ))
          ) : (
            <></>
          )}
        </div>
      </div>
    </CompendiumCard>
  );
};

const SpellCompedium = () => {
  const [filter, setFilter] = React.useState("");
  const { data: spells, isLoading: spellsLoading } = useQuery({
    queryKey: ["spells"],
    queryFn: async () => {
      // check idb first
      const data = await IDB.get("spells");
      if (data) {
        return data as Spell[];
      }
      let spells = await getSpells();
      IDB.set("spells", spells);
      return spells;
    },
  });

  return (
    <CompendiumCard title="Spellbook">
      <div className="flex h-full w-full flex-col">
        <Searchbar filter={filter} setFilter={setFilter} />
        <div className="h-0 grow gap-2 overflow-y-scroll">
          {filter.length > 1 && spells ? (
            spells
              ?.filter((m) =>
                m.name.toLowerCase().includes(filter.toLowerCase()),
              )
              .map((m) => (
                <div
                  key={m.name + m.source}
                  className="my-2 h-fit w-full overflow-hidden rounded-xl bg-french-200"
                >
                  <SpellCard spell={m} />
                </div>
              ))
          ) : (
            <></>
          )}
        </div>
      </div>
    </CompendiumCard>
  );
};

export const Compendium = () => {
  return (
    <div className="flex grow flex-wrap justify-center gap-2 p-2">
      <BestiaryCompendium />
      <SpellCompedium />
    </div>
  );
};
