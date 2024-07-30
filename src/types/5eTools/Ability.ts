export enum Ability {
  Charisma = "charisma",
  Constitution = "constitution",
  Dexterity = "dexterity",
  Intelligence = "intelligence",
  Strength = "strength",
  Wisdom = "wisdom",
}

export enum AltAbility {
  Cha = "cha",
  Con = "con",
  Int = "int",
  Wis = "wis",
  Str = "str",
  Dex = "dex",
}

export const toAltAbility = (ability: Ability) => {
  switch (ability) {
    case Ability.Charisma:
      return AltAbility.Cha;
    case Ability.Constitution:
      return AltAbility.Con;
    case Ability.Intelligence:
      return AltAbility.Int;
    case Ability.Wisdom:
      return AltAbility.Wis;
    case Ability.Strength:
      return AltAbility.Str;
    case Ability.Dexterity:
      return AltAbility.Dex;
  }
};

export const toAbility = (ability: AltAbility) => {
  switch (ability) {
    case AltAbility.Cha:
      return Ability.Charisma;
    case AltAbility.Con:
      return Ability.Constitution;
    case AltAbility.Int:
      return Ability.Intelligence;
    case AltAbility.Wis:
      return Ability.Wisdom;
    case AltAbility.Str:
      return Ability.Strength;
    case AltAbility.Dex:
      return Ability.Dexterity;
  }
};
export interface MonsterSave {
  con?: string;
  wis?: string;
  str?: string;
  dex?: string;
  int?: string;
  cha?: string;
}
