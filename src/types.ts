export interface StyleDefinition {
  [property: string]: string | number | StyleDefinition;
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
