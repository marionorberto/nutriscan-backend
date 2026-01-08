import {
  ClinicalEvaluation,
  ClinicalProfile,
} from '../../diabeti-profiles/interfaces/interfaces';

export interface AIInput {
  food: string;
  nutrition: {
    calories: number;
    carbs: number;
    sugar: number;
    fiber: number;
  };
  clinical: ClinicalEvaluation;
  patient: ClinicalProfile;
}
