export enum EnumDiabetiType {
  type1 = 'TYPE1',
  type2 = 'TYPE2',
  gestacional = 'GESTACIONAL',
  preDiabetis = 'PRE-DIABETIS',
}

export enum EnumCurrentStatus {
  controlled = 'CONTROLLED',
  uncontrolled = 'UNCONTROLLED',
}

export enum EnumHypoGlycemiaFrequency {
  low = 'LOW',
  medium = 'MEDIUM',
  high = 'HIGH',
}

export enum EnumHyperGlycemiaFrequency {
  low = 'LOW',
  medium = 'MEDIUM',
  high = 'HIGH',
}

export interface ClinicalProfile {
  diabetesType: 'TYPE_1' | 'TYPE_2';
  dailyCarbLimit: number; // g
  insulinDependent: boolean;
}

export interface FoodClinicalInput {
  name: string;
  carbs: number; // g / 100g
  sugar: number; // g / 100g
  fiber: number; // g / 100g
  glycemicIndex?: number; // opcional
}

export interface ClinicalEvaluation {
  food: string;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
  glycemicImpact: 'LOW' | 'MEDIUM' | 'HIGH';
  alerts: string[];
}
