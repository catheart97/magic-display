import { AltAbility } from "./Ability";

export enum EntryType {
  Entries = "entries",
  Item = "item",
  List = "list",
  VariantSub = "variantSub",
  Spellcasting = "spellcasting",
  Table = "table",
  VariantInner = "variantInner",
  Inset = "inset",
  Variant = "variant",
  Quote = "quote",
  Section = "section",
  Cell = "cell",
}

export interface Entry {
  name?: string;
  type?: EntryType;
  entry?: string;
  caption?: string;
  colLabels?: string[];
  colStyles?: string[];
  rows?: Array<Array<Entry | string>>;

  headerEntries?: string[];
  spells?: {
    [key: string]: {
      spells: string[];
      slots?: number;
    };
  };

  roll?: {
    exact?: number;
    min?: number;
    max?: number;
  };

  footerEntries?: string[];
  entries?: Array<Entry | string>;
  items?: Array<Entry | string>;
  page?: number;
  style?: string;
  will?: string[];
  daily?: Entry;
  ability?: AltAbility;

  token?: {
    name: string;
    source: string;
    page?: number;
  };

  by?: string;
}
