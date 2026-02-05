// src/services/Glucose.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  Between,
  FindOptionsWhere,
  MoreThan,
  LessThan,
} from 'typeorm';
import { CreateGlucoseLogDto, GlucoseLogDto, GlucoseResponse, TimeOfDay } from './dtos/create-glucose-log.dto';
// import { UpdateGlucoseLogDto } from './dtos/update-glucose-log.dto';
import { GlucoseFilterDto } from './dtos/update-glucose-log.dto';
import { GlucoseLog } from '@database/entities/glucose-control/glucose-control.entity';
import { DailyGlucoseSummary } from '@database/entities/daily-glucose-summaries/daily-glucose-summaries.entity';
import { GlucoseMetricsDto } from './interfaces/interface';

@Injectable()
export class GlucoseService {
  constructor(
    @InjectRepository(GlucoseLog)
    private glucoseLogRepository: Repository<GlucoseLog>,

    @InjectRepository(DailyGlucoseSummary)
    private dailySummaryRepository: Repository<DailyGlucoseSummary>,
  ) {}

  async create(userId: string, createDto: GlucoseLogDto): Promise<any> {
    console.log(createDto);
    // Defina valores padrão se não fornecidos
    const readingAt = createDto.readingAt
      ? new Date(createDto.readingAt)
      : new Date();
    // Formato date para MySQL (YYYY-MM-DD)
    const readingDate = new Date(
      readingAt.getFullYear(),
      readingAt.getMonth(),
      readingAt.getDate(),
    );

    const readingType = createDto.readingType || 'ALEATORIO';

    // Cria a instância com tipos compatíveis
    const glucoseLog = this.glucoseLogRepository.create({
      ...createDto,
      user: {
        id: userId,
      },
      readingDate,
      readingAt,
      timeOfDay: this.getTimeOfDay(readingAt),
      readingType,
    });

    const savedLog = await this.glucoseLogRepository.save(glucoseLog);

    // Atualiza estatísticas
    // await this.updateDailySummary(userId, glucoseLog.readingDate);
    // await this.updateMovingAverages(userId);

    return savedLog;
  }

  private getTimeOfDay(date: Date): TimeOfDay {
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) return 'MANHA';
    if (hour >= 12 && hour < 17) return 'TARDE';
    if (hour >= 17 && hour < 22) return 'NOITE';
    return 'MADRUGA';
  }

  // Método para classificar a resposta glicêmica
  private classifyGlucoseResponse(value: number): GlucoseResponse {
    if (value < 70) return 'HIPOGLICEMIA';
    if (value < 100) return 'BAIXO';
    if (value < 140) return 'NORMAL';
    if (value < 180) return 'ELEVADO';
    if (value < 250) return 'ALTO';
    if (value < 300) return 'MUITO_ALTO';
    return 'CRITICO';
  }

  async findAll(
    userId: string,
    filter: GlucoseFilterDto,
  ): Promise<{ data: GlucoseLog[]; total: number }> {
    const where: FindOptionsWhere<GlucoseLog> = {
      user: {
        id: userId,
      },
    };

    // Aplica filtros
    if (filter.startDate && filter.endDate) {
      where.readingAt = Between(filter.startDate, filter.endDate);
    } else if (filter.startDate) {
      where.readingAt = MoreThan(filter.startDate);
    } else if (filter.endDate) {
      where.readingAt = LessThan(filter.endDate);
    }

    if (filter.readingType) {
      where.readingType = filter.readingType as any;
    }

    if (filter.response) {
      where.response = filter.response as any;
    }

    const [data, total] = await this.glucoseLogRepository.findAndCount({
      where,
      order: { readingAt: 'DESC' },
      take: filter.limit || 50,
      skip: filter.offset || 0,
    });

    return { data, total };
  }

  async findOne(userId: string, id: string): Promise<GlucoseLog> {
    const log = await this.glucoseLogRepository.findOne({
      where: {
        id,
        user: {
          id: userId,
        },
      },
    });

    if (!log) {
      throw new NotFoundException('Registro de glicemia não encontrado');
    }

    return log;
  }

  async getMetrics(userId: string): Promise<GlucoseMetricsDto> {
    const now = new Date();

    // Busca logs dos últimos 30 dias para todos os cálculos
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const logs = await this.glucoseLogRepository.find({
      where: {
        user: { id: userId },
        readingAt: Between(thirtyDaysAgo, now),
      },
      order: { readingAt: 'DESC' },
    });

    if (logs.length === 0) {
      return this.getEmptyMetrics();
    }

    // Calcula todas as métricas
    const sevenDayAvg = this.calculatePeriodAverage(logs, 7);
    const fourteenDayAvg = this.calculatePeriodAverage(logs, 14);
    const thirtyDayAvg = this.calculateAverage(logs);
    const timeInRange = this.calculateTimeInRange(logs);
    const glycemicVariability = this.calculateGlycemicVariability(logs);
    const estimatedHbA1c = this.calculateEstimatedHbA1c(thirtyDayAvg);

    return {
      sevenDayAvg,
      fourteenDayAvg,
      thirtyDayAvg,
      estimatedHbA1c,
      timeInRange,
      glycemicVariability,
      totalReadings: logs.length,
      periodStart: thirtyDaysAgo,
      periodEnd: now,
      calculatedAt: new Date(),
    };
  }

  async getPeriodMetrics(userId: string, days: number): Promise<any> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await this.glucoseLogRepository.find({
      where: {
        user: { id: userId },
        readingAt: Between(startDate, endDate),
      },
      order: { readingAt: 'ASC' },
    });

    if (logs.length === 0) {
      return {
        average: null,
        timeInRange: null,
        variability: null,
        readings: [],
        period: `${days}d`,
        startDate,
        endDate,
      };
    }

    const glucoseValues = logs.map((log) => parseFloat(log.value.toString()));

    return {
      average: this.calculateAverage(logs),
      timeInRange: this.calculateTimeInRange(logs),
      variability: this.calculateGlycemicVariability(logs),
      estimatedHbA1c: this.calculateEstimatedHbA1c(this.calculateAverage(logs)),
      readings: glucoseValues,
      readingsCount: logs.length,
      period: `${days}d`,
      startDate,
      endDate,
      // Estatísticas adicionais
      min: Math.min(...glucoseValues),
      max: Math.max(...glucoseValues),
      median: this.calculateMedian(glucoseValues),
    };
  }

  async getDailySummary(userId: string, date?: Date): Promise<any> {
    const targetDate = date || new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const logs = await this.glucoseLogRepository.find({
      where: {
        user: { id: userId },
        readingAt: Between(startOfDay, endOfDay),
      },
      order: { readingAt: 'ASC' },
    });

    return {
      date: targetDate,
      totalReadings: logs.length,
      average: this.calculateAverage(logs),
      readings: logs.map((log) => ({
        time: log.readingAt,
        value: log.value,
        type: log.readingType,
      })),
      timeInRange: this.calculateTimeInRange(logs),
    };
  }

  async getTrend(userId: string, days: number = 7): Promise<any[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await this.glucoseLogRepository.find({
      where: {
        user: { id: userId },
        readingAt: Between(startDate, endDate),
      },
      order: { readingAt: 'ASC' },
    });

    // Agrupa por dia
    const dailyData = this.groupByDay(logs);

    return dailyData.map((day) => ({
      date: day.date,
      average: day.average,
      readings: day.readings,
      timeInRange: day.timeInRange,
    }));
  }

  private calculatePeriodAverage(logs: GlucoseLog[], days: number): number {
    const recentLogs = logs.slice(0, days);
    return this.calculateAverage(recentLogs);
  }

  private calculateAverage(logs: GlucoseLog[]): number {
    if (logs.length === 0) return 0;
    const sum = logs.reduce(
      (acc, log) => acc + parseFloat(log.value.toString()),
      0,
    );
    return parseFloat((sum / logs.length).toFixed(1));
  }

  private calculateTimeInRange(logs: GlucoseLog[]): number {
    if (logs.length === 0) return 0;

    const inRangeCount = logs.filter((log) => {
      const value = parseFloat(log.value.toString());
      // Valores alvo: 70-180 mg/dL
      return value >= 70 && value <= 180;
    }).length;

    return parseFloat(((inRangeCount / logs.length) * 100).toFixed(2));
  }

  private calculateGlycemicVariability(logs: GlucoseLog[]): number {
    if (logs.length < 2) return 0;

    const values = logs.map((log) => parseFloat(log.value.toString()));
    const mean = this.calculateAverage(logs);

    const squaredDiffs = values.map((value) => Math.pow(value - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b) / values.length;
    const stdDev = Math.sqrt(variance);

    const cv = (stdDev / mean) * 100;
    return parseFloat(cv.toFixed(2));
  }

  private calculateEstimatedHbA1c(averageGlucose: number): number {
    if (!averageGlucose || averageGlucose === 0) return 0;
    // Fórmula: (média glicêmica + 46.7) / 28.7
    const hba1c = (averageGlucose + 46.7) / 28.7;
    return parseFloat(hba1c.toFixed(1));
  }

  private calculateMedian(values: number[]): number {
    if (values.length === 0) return 0;

    const sorted = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
      return (sorted[middle - 1] + sorted[middle]) / 2;
    }

    return sorted[middle];
  }

  private groupByDay(logs: GlucoseLog[]): any[] {
    const grouped = new Map<string, GlucoseLog[]>();

    logs.forEach((log) => {
      console.log(log.readingDate);
      const dateKey = log.readingDate.toString();

      if (!grouped.has(dateKey.toString())) {
        grouped.set(dateKey, []);
      }

      grouped.get(dateKey).push(log);
    });

    return Array.from(grouped.entries()).map(([date, dayLogs]) => ({
      date,
      average: this.calculateAverage(dayLogs),
      readings: dayLogs.length,
      timeInRange: this.calculateTimeInRange(dayLogs),
    }));
  }

  private getEmptyMetrics(): GlucoseMetricsDto {
    return {
      sevenDayAvg: 0,
      fourteenDayAvg: 0,
      thirtyDayAvg: 0,
      estimatedHbA1c: 0,
      timeInRange: 0,
      glycemicVariability: 0,
      totalReadings: 0,
      periodStart: new Date(),
      periodEnd: new Date(),
      calculatedAt: new Date(),
    };
  }

  // async update(
  //   userId: string,
  //   id: string,
  //   updateDto: UpdateGlucoseLogDto,
  // ): Promise<GlucoseLog> {
  //   const log = await this.findOne(userId, id);

  //   Object.assign(log, updateDto);

  //   const updatedLog = await this.glucoseLogRepository.save(log);

  //   // Recalcula estatísticas
  //   await this.updateDailySummary(userId, log.readingDate);

  //   return updatedLog;
  // }

  // async remove(userId: string, id: string): Promise<void> {
  //   const log = await this.findOne(userId, id);

  //   await this.glucoseLogRepository.remove(log);

  //   // Recalcula estatísticas
  //   await this.updateDailySummary(userId, log.readingDate);
  // }

  // async getTodaySummary(userId: string) {
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);
  //   const tomorrow = new Date(today);
  //   tomorrow.setDate(tomorrow.getDate() + 1);

  //   const todayLogs = await this.glucoseLogRepository.find({
  //     where: {
  //       user: {
  //         id: userId,
  //       },
  //       readingAt: Between(today, tomorrow),
  //     },
  //     order: { readingAt: 'DESC' },
  //   });

  //   if (todayLogs.length === 0) {
  //     return {
  //       average: 0,
  //       readings: 0,
  //       highest: 0,
  //       lowest: 0,
  //       timeInRange: 0,
  //       lastReading: null,
  //     };
  //   }

  //   const values = todayLogs.map((log) => log.value);
  //   const average = values.reduce((a, b) => a + b, 0) / values.length;
  //   const highest = Math.max(...values);
  //   const lowest = Math.min(...values);

  //   const inRangeCount = todayLogs.filter(
  //     (log) => log.response === 'NORMAL' || log.response === 'BAIXO',
  //   ).length;

  //   const timeInRange = (inRangeCount / todayLogs.length) * 100;

  //   return {
  //     average: parseFloat(average.toFixed(1)),
  //     readings: todayLogs.length,
  //     highest,
  //     lowest,
  //     timeInRange: parseFloat(timeInRange.toFixed(1)),
  //     lastReading: todayLogs[0],
  //   };
  // }

  // async getMovingAverages(userId: string) {
  //   const thirtyDaysAgo = new Date();
  //   thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  //   const recentLogs = await this.glucoseLogRepository.find({
  //     where: {
  //       user: {
  //         id: userId,
  //       },
  //       readingAt: MoreThan(thirtyDaysAgo),
  //     },
  //     select: ['value', 'readingAt'],
  //   });

  //   if (recentLogs.length === 0) {
  //     return {
  //       sevenDay: 0,
  //       fourteenDay: 0,
  //       thirtyDay: 0,
  //       estimatedHbA1c: 0,
  //     };
  //   }

  //   const sevenDayLogs = recentLogs.filter((log) => {
  //     const sevenDaysAgo = new Date();
  //     sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  //     return log.readingAt > sevenDaysAgo;
  //   });

  //   const fourteenDayLogs = recentLogs.filter((log) => {
  //     const fourteenDaysAgo = new Date();
  //     fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
  //     return log.readingAt > fourteenDaysAgo;
  //   });

  //   const calculateAverage = (logs: GlucoseLog[]) => {
  //     if (logs.length === 0) return 0;
  //     const sum = logs.reduce((acc, log) => acc + log.value, 0);
  //     return parseFloat((sum / logs.length).toFixed(1));
  //   };

  //   const sevenDayAvg = calculateAverage(sevenDayLogs);
  //   const fourteenDayAvg = calculateAverage(fourteenDayLogs);
  //   const thirtyDayAvg = calculateAverage(recentLogs);

  //   // Fórmula: (Glicemia média + 46.7) / 28.7
  //   const estimatedHbA1c = parseFloat(
  //     ((thirtyDayAvg + 46.7) / 28.7).toFixed(1),
  //   );

  //   return {
  //     sevenDay: sevenDayAvg,
  //     fourteenDay: fourteenDayAvg,
  //     thirtyDay: thirtyDayAvg,
  //     estimatedHbA1c,
  //   };
  // }

  // async getTimeInRange(userId: string, days: number = 14) {
  //   const startDate = new Date();
  //   startDate.setDate(startDate.getDate() - days);

  //   const logs = await this.glucoseLogRepository.find({
  //     where: {
  //       user: {
  //         id: userId,
  //       },
  //       readingAt: MoreThan(startDate),
  //     },
  //     select: ['response'],
  //   });

  //   const total = logs.length;
  //   if (total === 0) {
  //     return { inRange: 0, low: 0, high: 0, total: 0 };
  //   }

  //   const inRange = logs.filter(
  //     (log) => log.response === 'NORMAL' || log.response === 'BAIXO',
  //   ).length;

  //   const low = logs.filter((log) => log.response === 'HIPOGLICEMIA').length;
  //   const high = logs.filter((log) =>
  //     ['ELEVADO', 'ALTO', 'MUITO_ALTO', 'CRITICO'].includes(log.response),
  //   ).length;

  //   return {
  //     inRange: parseFloat(((inRange / total) * 100).toFixed(1)),
  //     low: parseFloat(((low / total) * 100).toFixed(1)),
  //     high: parseFloat(((high / total) * 100).toFixed(1)),
  //     total,
  //   };
  // }

  // async getPatterns(userId: string, days: number = 30) {
  //   const startDate = new Date();
  //   startDate.setDate(startDate.getDate() - days);

  //   const logs = await this.glucoseLogRepository.find({
  //     where: {
  //       user: {
  //         id: userId,
  //       },
  //       readingAt: MoreThan(startDate),
  //     },
  //     select: ['value', 'timeOfDay', 'readingType', 'relatedMeal'],
  //   });

  //   // Agrupa por período do dia
  //   const byTimeOfDay: Record<string, number[]> = {};
  //   logs.forEach((log) => {
  //     if (log.timeOfDay) {
  //       if (!byTimeOfDay[log.timeOfDay]) {
  //         byTimeOfDay[log.timeOfDay] = [];
  //       }
  //       byTimeOfDay[log.timeOfDay].push(log.value);
  //     }
  //   });

  //   // Agrupa por tipo de leitura
  //   const byReadingType: Record<string, number[]> = {};
  //   logs.forEach((log) => {
  //     if (log.readingType) {
  //       if (!byReadingType[log.readingType]) {
  //         byReadingType[log.readingType] = [];
  //       }
  //       byReadingType[log.readingType].push(log.value);
  //     }
  //   });

  //   // Agrupa por refeição
  //   const byMeal: Record<string, number[]> = {};
  //   logs.forEach((log) => {
  //     if (log.relatedMeal) {
  //       if (!byMeal[log.relatedMeal]) {
  //         byMeal[log.relatedMeal] = [];
  //       }
  //       byMeal[log.relatedMeal].push(log.value);
  //     }
  //   });

  //   // Calcula médias
  //   const calculateAverage = (values: number[]) => {
  //     if (values.length === 0) return 0;
  //     const sum = values.reduce((a, b) => a + b, 0);
  //     return parseFloat((sum / values.length).toFixed(1));
  //   };

  //   return {
  //     byTimeOfDay: Object.fromEntries(
  //       Object.entries(byTimeOfDay).map(([key, values]) => [
  //         key,
  //         calculateAverage(values),
  //       ]),
  //     ),
  //     byReadingType: Object.fromEntries(
  //       Object.entries(byReadingType).map(([key, values]) => [
  //         key,
  //         calculateAverage(values),
  //       ]),
  //     ),
  //     byMeal: Object.fromEntries(
  //       Object.entries(byMeal).map(([key, values]) => [
  //         key,
  //         calculateAverage(values),
  //       ]),
  //     ),
  //   };
  // }

  // async getStatistics(userId: string) {
  //   const [todaySummary, movingAverages, timeInRange, patterns] =
  //     await Promise.all([
  //       this.getTodaySummary(userId),
  //       this.getMovingAverages(userId),
  //       this.getTimeInRange(userId, 14),
  //       this.getPatterns(userId, 30),
  //     ]);

  //   return {
  //     today: todaySummary,
  //     movingAverages,
  //     timeInRange,
  //     patterns,
  //   };
  // }

  // async getDailySummaries(userId: string, days: number = 30) {
  //   const startDate = new Date();
  //   startDate.setDate(startDate.getDate() - days);

  //   const summaries = await this.dailySummaryRepository.find({
  //     where: {
  //       userId,
  //       date: MoreThan(startDate),
  //     },
  //     order: { date: 'DESC' },
  //   });

  //   return summaries;
  // }

  // private async updateDailySummary(userId: string, date: Date) {
  //   const today = new Date(date.toDateString());

  //   const todayLogs = await this.glucoseLogRepository.find({
  //     where: {
  //       user: {
  //         id: userId,
  //       },
  //       readingAt: Between(today, new Date(today.getTime() + 86400000)),
  //     },
  //   });

  //   if (todayLogs.length === 0) {
  //     // Remove summary se não houver leituras
  //     const existing = await this.dailySummaryRepository.findOne({
  //       where: { userId, date: today },
  //     });
  //     if (existing) {
  //       await this.dailySummaryRepository.remove(existing);
  //     }
  //     return;
  //   }

  //   const values = todayLogs.map((log) => log.value);
  //   const average = values.reduce((a, b) => a + b, 0) / values.length;
  //   const highest = Math.max(...values);
  //   const lowest = Math.min(...values);

  //   const highestLog = todayLogs.find((log) => log.value === highest);
  //   const lowestLog = todayLogs.find((log) => log.value === lowest);

  //   const hypoglycemicCount = todayLogs.filter((log) =>
  //     log.isHypoglycemic(),
  //   ).length;
  //   const hyperglycemicCount = todayLogs.filter((log) =>
  //     log.isHyperglycemic(),
  //   ).length;
  //   const normalCount = todayLogs.filter((log) => log.isInTargetRange()).length;

  //   const timeInRangePercent = (normalCount / todayLogs.length) * 100;

  //   // Calcula desvio padrão
  //   const mean = average;
  //   const squareDiffs = values.map((value) => Math.pow(value - mean, 2));
  //   const avgSquareDiff =
  //     squareDiffs.reduce((a, b) => a + b, 0) / values.length;
  //   const standardDeviation = Math.sqrt(avgSquareDiff);
  //   const coefficientVariation = (standardDeviation / mean) * 100;

  //   const existingSummary = await this.dailySummaryRepository.findOne({
  //     where: { userId, date: today },
  //   });

  //   const summaryData = {
  //     userId,
  //     date: today,
  //     totalReadings: todayLogs.length,
  //     averageGlucose: parseFloat(average.toFixed(1)),
  //     highestGlucose: highest,
  //     highestGlucoseTime: highestLog?.readingAt.toTimeString().slice(0, 5),
  //     lowestGlucose: lowest,
  //     lowestGlucoseTime: lowestLog?.readingAt.toTimeString().slice(0, 5),
  //     hypoglycemicCount,
  //     hyperglycemicCount,
  //     normalCount,
  //     timeInRangePercent: parseFloat(timeInRangePercent.toFixed(1)),
  //     standardDeviation: parseFloat(standardDeviation.toFixed(2)),
  //     coefficientVariation: parseFloat(coefficientVariation.toFixed(2)),
  //     estimatedAverageGlucose: parseFloat(average.toFixed(1)),
  //     estimatedHbA1c: parseFloat(((average + 46.7) / 28.7).toFixed(1)),
  //     dailyTargetAchieved: timeInRangePercent >= 70,
  //     dailyScore: 0,
  //     hadHypoglycemia: hypoglycemicCount > 0,
  //     hadHyperglycemia: hyperglycemicCount > 0,
  //   };

  //   if (existingSummary) {
  //     await this.dailySummaryRepository.update(existingSummary.id, summaryData);
  //   } else {
  //     const newSummary = new DailyGlucoseSummary(summaryData);
  //     newSummary.dailyScore = newSummary.calculateDailyScore();
  //     await this.dailySummaryRepository.save(newSummary);
  //   }
  // }

  // private async updateMovingAverages(userId: string) {
  //   const logs = await this.glucoseLogRepository.find({
  //     where: {
  //       user: {
  //         id: userId,
  //       },
  //     },
  //     order: { readingAt: 'DESC' },
  //     take: 100,
  //   });

  //   if (logs.length === 0) return;

  //   const movingAverages = await this.getMovingAverages(userId);

  //   const thirtyDaysAgo = new Date();
  //   thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  //   const recentLogs = logs.filter((log) => log.readingAt > thirtyDaysAgo);

  //   for (const log of recentLogs) {
  //     await this.glucoseLogRepository.update(log.id, {
  //       sevenDayAvg: movingAverages.sevenDay,
  //       fourteenDayAvg: movingAverages.fourteenDay,
  //       thirtyDayAvg: movingAverages.thirtyDay,
  //       estimatedHbA1c: movingAverages.estimatedHbA1c,
  //     });
  //   }
  // }
}
