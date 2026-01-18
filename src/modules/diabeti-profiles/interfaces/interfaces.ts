export enum EnumDiabetiType {
  tipo1 = 'tipo1',
  tipo2 = 'tipo2',
  gestacional = 'gestacional',
  preDiabete = 'preDiabete',
}

export enum EnumCurrentStatus {
  controlada = 'controlada',
  descontrolada = 'descontrolada',
}

export enum EnumHypoGlycemiaFrequency {
  baixa = 'baixa',
  media = 'media',
  alta = 'alta',
}

export enum EnumHyperGlycemiaFrequency {
  baixa = 'baixa',
  media = 'media',
  alta = 'alta',
}

//////////////////
//////////////////
//////////////////
//////////////////
//////////////////
// ver oque se passa abaixo:

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
