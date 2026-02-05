// src/interfaces/glucose/GlucoseLog.interface.ts
export interface GlucoseLogResponse {
  id: string;
  userId: string;
  value: number;
  readingType: string;
  response: string;
  readingAt: string;
  readingDate: string;
  timeOfDay: string;
  relatedMeal?: string;
  mealAnalysisId?: string;
  notes?: string;
  symptoms?: string[];
  influencingFactors?: {
    stress?: number;
    exercise?: {
      type: string;
      duration: number;
      intensity: string;
    };
    medication?: {
      type: string;
      dose: number;
      takenAt: string;
    };
    illness?: boolean;
    alcohol?: boolean;
    sleepHours?: number;
  };
  sevenDayAvg?: number;
  fourteenDayAvg?: number;
  thirtyDayAvg?: number;
  estimatedHbA1c?: number;
  timeInRange?: number;
  glycemicVariability?: number;
  personalTarget?: number;
  measurementDevice?: string;
  confidence: string;
  createdAt: string;
  updatedAt: string;

  // Calculados no frontend
  formattedValue: string;
  typeDescription: string;
  responseDescription: string;
  timeOfDayDescription: string;
  colorCode: string;
  icon: string;
  isInTarget: boolean;
  isAlert: boolean;
}

// src/interfaces/glucose/DailySummary.interface.ts
export interface DailyGlucoseSummaryResponse {
  id: string;
  userId: string;
  date: string;
  totalReadings: number;
  fastingReadings: number;
  preMealReadings: number;
  postMealReadings: number;
  averageGlucose: number;
  fastingAverage?: number;
  preMealAverage?: number;
  postMealAverage?: number;
  hypoglycemicCount: number;
  normalCount: number;
  hyperglycemicCount: number;
  timeInRangePercent?: number;
  highestGlucose?: number;
  highestGlucoseTime?: string;
  lowestGlucose?: number;
  lowestGlucoseTime?: string;
  standardDeviation?: number;
  coefficientVariation?: number;
  estimatedAverageGlucose?: number;
  estimatedHbA1c?: number;
  dailyTargetAchieved: boolean;
  dailyScore?: number;
  notes?: string;
  hadHypoglycemia: boolean;
  hadHyperglycemia: boolean;
  hadExercise: boolean;
  wasSick: boolean;
  hadStress: boolean;
  sevenDayMovingAvg?: number;
  fourteenDayMovingAvg?: number;
  thirtyDayMovingAvg?: number;
  createdAt: string;
  updatedAt: string;

  // Para frontend
  dayOfWeek: string;
  formattedDate: string;
  status: {
    status: string;
    color: string;
    icon: string;
  };
}

// src/interfaces/glucose/GlucoseStatistics.interface.ts
export interface GlucoseStatisticsResponse {
  today: {
    average: number;
    readings: number;
    highest: number;
    lowest: number;
    timeInRange: number;
    lastReading?: GlucoseLogResponse;
  };
  movingAverages: {
    sevenDay: number;
    fourteenDay: number;
    thirtyDay: number;
    estimatedHbA1c: number;
  };
  timeInRange: {
    inRange: number;
    low: number;
    high: number;
    total: number;
  };
  patterns: {
    byTimeOfDay: Record<string, number>;
    byReadingType: Record<string, number>;
    byMeal: Record<string, number>;
  };
}

// dto/glucose-metrics.dto.ts
export class GlucoseMetricsDto {
  sevenDayAvg: number;
  fourteenDayAvg: number;
  thirtyDayAvg: number;
  estimatedHbA1c: number;
  timeInRange: number;
  glycemicVariability: number;
  totalReadings: number;
  periodStart: Date;
  periodEnd: Date;
  calculatedAt: Date;
}

export class GlucoseMetricsResponseDto {
  success: boolean;
  data: GlucoseMetricsDto;
  message?: string;
}
