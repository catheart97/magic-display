export enum DamageType {
  Acid = "A", // Acid
  Bludgeoning = "B",
  Cold = "C", // Cold
  Force = "F", // Force
  Fire = "I", // Fire
  Lightning = "L", // Lightning
  Necrotic = "N",
  Poison = "O",
  Piercing = "P",
  Radiant = "R",
  Slashing = "S",
  Thunder = "T", // Thunder
  Psychic = "Y", // Psychic
}

export enum AltDamageType {
  Acid = "acid",
  Bludgeoning = "bludgeoning",
  Cold = "cold",
  Fire = "fire",
  Force = "force",
  Lightning = "lightning",
  Necrotic = "necrotic",
  Piercing = "piercing",
  Poison = "poison",
  Psychic = "psychic",
  Radiant = "radiant",
  Slashing = "slashing",
  Thunder = "thunder",
}

export const toAltDamageType = (dmgType: DamageType) => {
  switch (dmgType) {
    case DamageType.Acid:
      return AltDamageType.Acid;
    case DamageType.Bludgeoning:
      return AltDamageType.Bludgeoning;
    case DamageType.Cold:
      return AltDamageType.Cold;
    case DamageType.Fire:
      return AltDamageType.Fire;
    case DamageType.Force:
      return AltDamageType.Force;
    case DamageType.Lightning:
      return AltDamageType.Lightning;
    case DamageType.Necrotic:
      return AltDamageType.Necrotic;
    case DamageType.Piercing:
      return AltDamageType.Piercing;
    case DamageType.Poison:
      return AltDamageType.Poison;
    case DamageType.Psychic:
      return AltDamageType.Psychic;
    case DamageType.Radiant:
      return AltDamageType.Radiant;
    case DamageType.Slashing:
      return AltDamageType.Slashing;
    case DamageType.Thunder:
      return AltDamageType.Thunder;
  }
};

export const toDamageType = (altDmgType: AltDamageType) => {
  switch (altDmgType) {
    case AltDamageType.Acid:
      return DamageType.Acid;
    case AltDamageType.Bludgeoning:
      return DamageType.Bludgeoning;
    case AltDamageType.Cold:
      return DamageType.Cold;
    case AltDamageType.Fire:
      return DamageType.Fire;
    case AltDamageType.Force:
      return DamageType.Force;
    case AltDamageType.Lightning:
      return DamageType.Lightning;
    case AltDamageType.Necrotic:
      return DamageType.Necrotic;
    case AltDamageType.Piercing:
      return DamageType.Piercing;
    case AltDamageType.Poison:
      return DamageType.Poison;
    case AltDamageType.Psychic:
      return DamageType.Psychic;
    case AltDamageType.Radiant:
      return DamageType.Radiant;
    case AltDamageType.Slashing:
      return DamageType.Slashing;
    case AltDamageType.Thunder:
      return DamageType.Thunder;
  }
};
