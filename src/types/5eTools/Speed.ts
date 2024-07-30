export interface Speed {
  walk?:
    | {
        number: number;
        condition: string;
      }
    | number;
  climb?:
    | {
        number: number;
        condition: string;
      }
    | number;
  fly?:
    | {
        number: number;
        condition: string;
      }
    | number;
  canHover?: boolean;
  burrow?:
    | {
        number: number;
        condition: string;
      }
    | number;
  swim?:
    | {
        number: number;
        condition: string;
      }
    | number;
  alternate?: {
    walk: {
      number: number;
      condition: string;
    }[];
    climb?: {
      number: number;
      condition: string;
    }[];
    fly?: {
      number: number;
      condition: string;
    }[];
  };
}
