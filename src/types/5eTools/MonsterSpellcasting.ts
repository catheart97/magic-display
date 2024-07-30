import { Ability, MonsterAbilityDisplayType } from "./Bestiary";
import { EntryType } from "./Entry";

export interface MonsterSpellcasting {
  name: string;
  type: EntryType;
  headerEntries?: string[];
  will?: Array<
    | {
        entry: string;
        hidden: boolean;
      }
    | string
  >;
  spells?: {
    [key: string]: {
      slots?: number;
      spells: string[];
      lower?: number;
    };
  };
  ability?: Ability;
  hidden?: string[];
  daily?: {
    [key: string]: Array<
      | {
          entry: string;
          hidden: boolean;
        }
      | string
    >;
  };
  footerEntries?: string[];
  displayAs?: MonsterAbilityDisplayType;
  recharge?: {
    [key: string]: string[];
  };
  rest?: {
    [key: string]: string[];
  };
  charges?: {
    [key: string]: string[];
  };
  chargesItem?: string;
  ritual?: string[];
}
