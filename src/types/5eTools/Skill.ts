export interface Skill {
  arcana?: string;
  history?: string;
  perception?: string;
  athletics?: string;
  survival?: string;
  stealth?: string;
  performance?: string;
  intimidation?: string;
  insight?: string;
  persuasion?: string;
  investigation?: string;
  acrobatics?: string;
  "sleight of hand"?: string;
  medicine?: string;
  nature?: string;
  "animal handling"?: string;
  religion?: string;
  deception?: string;
  other?: {
    oneOf: {
      arcana: string;
      history: string;
      nature: string;
      religion: string;
    };
  }[];
}
