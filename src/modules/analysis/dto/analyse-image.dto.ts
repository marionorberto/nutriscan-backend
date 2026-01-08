// analysis/dto/analyze-image.dto.ts
export class AnalyzeImageDto {
  patientId: string;

  patientProfile: {
    diabetesType: 'TYPE_1' | 'TYPE_2';
    maxCarbsPerMeal: number;
    maxSugar: number;
  };
}
