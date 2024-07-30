import { Ability } from "./Ability";
import { MonsterType } from "./Bestiary";
import { AltDamageType } from "./DamageType";
import { Entry } from "./Entry";

export interface SpellDatabase {
  spell: Spell[];
}

export interface Spell {
  name: string;
  source: string;
  page?: number;
  otherSources?: {
    source: string;
    page?: number;
  }[];
  level: number;
  school: School;
  time: {
    number: number;
    unit: "action" | "bonus" | "hour" | "minute" | "reaction";
    condition?: string;
  }[];
  range: {
    type:
      | "cone"
      | "cube"
      | "hemisphere"
      | "line"
      | "point"
      | "radius"
      | "special"
      | "sphere";
    distance?: {
      type: "feet" | "miles" | "self" | "sight" | "touch" | "unlimited";
      amount?: number;
    };
  };
  components: {
    v?: boolean;
    s?: boolean;
    m?:
      | {
          text: string;
          cost?: number;
          consume?: boolean | string;
        }
      | string;
    r?: boolean;
  };
  duration: {
    type: "instant" | "permanent" | "special" | "timed";
    duration?: {
      type: "day" | "hour" | "minute" | "round";
      amount: number;
      upTo?: boolean;
    };
    concentration?: boolean;
    ends?: ("dispel" | "trigger")[];
  }[];
  entries: Array<Entry | string>;
  damageInflict?: AltDamageType[];
  savingThrow?: Ability[];
  areaTags?: string[];
  entriesHigherLevel?: {
    type: "entries" | "item";
    name: string;
    entries: string[];
  }[];
  damageResist?: AltDamageType[];
  conditionInflict?: string[];
  affectsCreatureType?: MonsterType[];
  miscTags?: string[];
  abilityCheck?: Ability[];
  spellAttack?: ("R" | "M")[];
  hasFluffImages?: boolean;
  scalingLevelDice?: ScalingLevelDice[] | ScalingLevelDice;
  additionalSources?: {
    source: string;
    page?: number;
  }[];
  damageImmune?: AltDamageType[];
  hasFluff?: boolean;
  conditionImmune?: string[];
  srd?: boolean | string;
  basicRules?: boolean;
  damageVulnerable?: AltDamageType[];
  subschools?: string[];
}

type ScalingLevelDice = {
  label: string;
  scaling: { [key: string]: string };
};

enum School {
  Abjuration = "A",
  Conjuration = "C", // Conjuration
  Divination = "D", // Divination
  Enchantment = "E", // Enchantment
  Illusion = "I", // Illusion
  Necromancy = "N", // Necromancy
  Transmutation = "T", // Transmutation
  Evocation = "V", // Evocation
}
