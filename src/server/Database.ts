"use server";

import fs from "fs-extra";
import * as glob from "glob";

import { mergeDeep } from "@/server/Utility";
import { BestiaryDatabase } from "@/types/5eTools/Bestiary";
import { Spell, SpellDatabase } from "@/types/5eTools/Spell";
import { ItemDatabase } from "@/types/5eTools/Item";

export const getBestiary = async () => {
  let db: BestiaryDatabase = {
    monster: [],
  };

  const bestiaryFiles = glob.sync(`data/database/bestiary/bestiary-*.json`);
  for (const bestiaryFile of bestiaryFiles) {
    const data = fs.readJsonSync(bestiaryFile);
    db = mergeDeep(db, data);
  }

  return db.monster;
};

export const getSpells = async () => {
  let db: SpellDatabase = {
    spell: [],
  };

  const spellFiles = glob.sync(`data/database/spells/spells-*.json`);
  for (const spellFile of spellFiles) {
    const data = fs.readJsonSync(spellFile);
    db = mergeDeep(db, data);
  }

  return db.spell;
};

export const getShopItems = async () => {
  let db: ItemDatabase = {
    item: [],
    itemGroup: [],
  };

  const itemFiles = glob.sync(`data/database/items.json`);
  for (const itemFile of itemFiles) {
    const data = fs.readJsonSync(itemFile);
    db = mergeDeep(db, data);
  }

  return db.item;
};

export const getSpellDict = async () => {
  const Spells = await getSpells();
  const SpellDict = Spells.reduce(
    (acc, spell) => {
      acc[spell.name] = spell;
      return acc;
    },
    {} as Record<string, Spell>,
  );
  return SpellDict;
};
