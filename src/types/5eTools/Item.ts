import { Class } from "./Class";
import { DamageType } from "./DamageType";
import { Entry } from "./Entry";
import { Rarity } from "./Rarity";

export interface ItemDatabase {
  item: Item[];
  itemGroup: ItemGroup[];
}

export interface Item extends ItemGroup {
  optionalfeatures?: string[];
  value?: number | null;
  detail1?: string;
  hasRefs?: boolean;
  crew?: number;
  vehAc?: number;
  vehHp?: number;
  vehSpeed?: number;
  capPassenger?: number;
  capCargo?: number;
  additionalEntries?: Array<Entry | string>;
  seeAlsoVehicle?: string[];
  vulnerable?: string[];
  poison?: boolean;
  poisonTypes?: ("contact" | "ingested" | "inhaled" | "injury")[];
  containerCapacity?: {
    weight?: number[];
    weightless?: boolean;
    item?: { [key: string]: number }[];
  };
  packContents?: Array<
    | {
        item?: string;
        quantity?: number;
        special?: string;
      }
    | string
  >;
  atomicPackContents?: boolean;
  grantsLanguage?: boolean;
  age?: string;
  vehDmgThresh?: number;
  bonusWeaponDamage?: string;
  critThreshold?: number;
  carryingCapacity?: number;
  speed?: number;
  alias?: string[];
  seeAlsoDeck?: string[];
  reprintedAs?: string[];
  reqAttuneAlt?: string;
  reach?: number;
  bonusProficiencyBonus?: string;
  firearm?: boolean;
  bonusSavingThrowConcentration?: string;
  typeAlt?: string;
  dexterityMax?: null;
  crewMin?: number;
  crewMax?: number;
  travelCost?: number;
  shippingCost?: number;
  spellScrollLevel?: number;
  bonusAbilityCheck?: string;
  weightNote?: string;
}

enum Property {
  Ammunition = "A", // Ammunition
  AmmunitionFiring = "AF", // Ammunition, firing
  EnergyResistance = "ER", // Energy resistance
  Finesse = "F", // Finesse
  Heavy = "H", // Heavy
  Light = "L", // Light
  Loading = "LD", //  Loading
  Reach = "R", // Reach
  Special = "S", // Special
  Thrown = "T", // Thrown
  TwoHanded = "2H",
  Versatile = "V", // Versatile
  Vst = "Vst", // ?
}

enum Recharge {
  Dawn = "dawn",
  Decade = "decade",
  Dusk = "dusk",
  Midnight = "midnight",
  LongRest = "restLong",
  ShortRest = "restShort",
  Special = "special",
}

export interface ItemGroup {
  name: string;
  source: string;
  page: number;
  rarity: Rarity;
  reqAttune?: boolean | string;
  wondrous?: boolean;
  tattoo?: boolean;
  entries?: Array<Entry | string>;
  items: string[];
  baseItem?: string;
  type?: string;
  reqAttuneTags?: {
    class?: Class;
    spellcasting?: boolean;
    alignment?: string[];
    background?: string;
    skillProficiency?: string;
    creatureType?: string;
    race?: string;
    psionics?: boolean;
    languageProficiency?: string;
    size?: DamageType;
    int?: number;
  }[];
  weight?: number;
  weaponCategory?: "martial" | "simple";
  property?: Property[];
  dmg1?: string;
  dmgType?: DamageType;
  bonusWeapon?: string;
  hasFluffImages?: boolean;
  scfType?: string;
  focus?: string[];
  tier?: "major" | "minor";
  immune?: string[];
  resist?: string[];
  conditionImmune?: string[];
  ac?: number;
  bonusAc?: string;
  stealth?: boolean;
  attachedSpells?: string[];
  curse?: boolean;
  strength?: string;
  lootTables?: string[];
  srd?: boolean;
  basicRules?: boolean;
  sentient?: boolean;
  range?: string;
  recharge?: Recharge;
  charges?: number;
  ammoType?: string;
  bonusSavingThrow?: string;
  miscTags?: string[];
  ability?: {
    static?: {
      con?: number;
      str?: number;
      int?: number;
      wis?: number;
      dex?: number;
      cha?: number;
    };
    choose?: {
      from: string[];
      count: number;
      amount?: number;
    }[];
    con?: number;
    wis?: number;
    cha?: number;
    from?: string[];
    count?: number;
    amount?: number;
    str?: number;
    dex?: number;
    int?: number;
  };
  dmg2?: string;
  hasFluff?: boolean;
  grantsProficiency?: boolean;
  bonusWeaponAttack?: string;
  rechargeAmount?: string;
  modifySpeed?: {
    equal?: {
      fly?: string;
      climb?: string;
      burrow?: string;
      swim?: string;
    };
    multiply?: {
      walk?: number;
      fly?: number;
      burrow?: number;
      swim?: number;
    };
    static?: {
      walk?: number;
      burrow?: number;
      swim?: number;
      fly?: number;
    };
    bonus?: {
      [key: string]: number;
    };
  };
  otherSources?: {
    source: string;
    page?: number;
  }[];
  bonusSpellAttack?: string;
  bonusSpellSaveDc?: string;
  staff?: boolean;
}
