export interface StyleDefinition {
  fallbacks?: StyleDefinition[];
  [property: string]:
    | string
    | null
    | undefined
    | number
    | StyleDefinition
    | StyleDefinition[];
}

export interface StyleDefinitions {
  [key: string]: StyleDefinition;
}

export interface SheetDefinition {
  className: string;
  style: StyleDefinition;
  globals: StyleDefinitions;
}
export type SheetDefinitions = SheetDefinitionArray;

interface SheetDefinitionArray
  extends Array<
    SheetDefinitions | SheetDefinition | null | undefined | false
  > {}
