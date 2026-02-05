import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { GlucoseService } from './glucose-log.service';
import {CreateGlucoseLogDto, GlucoseLogDto } from './dtos/create-glucose-log.dto';
import {
  GlucoseFilterDto,
  // UpdateGlucoseLogDto,
} from './dtos/update-glucose-log.dto';
import { AuthGuard } from 'shared/auth/auth.guard';
import { Request } from 'express';
import { GlucoseMetricsResponseDto } from './interfaces/interface';

@Controller('glucose')
@UseGuards(AuthGuard)
export class GlucoseController {
  constructor(private readonly glucoseService: GlucoseService) {}

  @Post('create')
  async create(@Req() req: Request, @Body() createDto: GlucoseLogDto) {
    const { userId } = req['user'];
    const glucoseLog = await this.glucoseService.create(userId, createDto);

    return {
      success: true,
      message: 'Leitura de glicemia registrada com sucesso',
      data: this.formatGlucoseLogResponse(glucoseLog),
    };
  }

  @Get()
  async findAll(@Req() req: Request, @Query() filter: GlucoseFilterDto) {
    const { userId } = req['user'];
    const { data, total } = await this.glucoseService.findAll(userId, filter);

    return {
      success: true,
      data: data.map((log) => this.formatGlucoseLogResponse(log)),
      pagination: {
        total,
        page: Math.floor((filter.offset || 0) / (filter.limit || 50)) + 1,
        limit: filter.limit || 50,
        totalPages: Math.ceil(total / (filter.limit || 50)),
      },
    };
  }

  @Get('metrics')
  async getMetrics(@Req() req: Request): Promise<GlucoseMetricsResponseDto> {
    try {
      const { userId } = req['user'];

      const metrics = await this.glucoseService.getMetrics(userId);

      return {
        success: true,
        data: metrics,
        message: 'Métricas calculadas com sucesso',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: `Erro ao calcular métricas: ${error.message}`,
      };
    }
  }

  @Get(':userId/period')
  async getPeriodMetrics(
    @Req() req: Request,
    @Query('days') days: string = '30',
  ) {
    const { userId } = req['user'];

    const daysNumber = parseInt(days, 10);

    if (isNaN(daysNumber) || daysNumber <= 0) {
      return {
        success: false,
        message: 'Parâmetro "days" deve ser um número positivo',
      };
    }

    const metrics = await this.glucoseService.getPeriodMetrics(userId, daysNumber);
    
    return {
      success: true,
      data: metrics,
      message: `Métricas dos últimos ${daysNumber} dias`,
    };
  }

  @Get(':userId/daily')
  async getDailySummary(
    @Req() req: Request,
    @Query('date') date?: string,
  ) {
    const { userId } = req['user'];

    const targetDate = date ? new Date(date) : new Date();
    
    const summary = await this.glucoseService.getDailySummary(userId, targetDate);
    
    return {
      success: true,
      data: summary,
      message: `Resumo do dia ${targetDate.toLocaleDateString('pt-BR')}`,
    };
  }

  @Get('trend')
  async getTrend(
    @Req() req: Request,

    @Query('days') days: string = '7',
  ) {
    const { userId } = req['user'];

    const daysNumber = parseInt(days, 10);

    const trend = await this.glucoseService.getTrend(userId, daysNumber);

    return {
      success: true,
      data: trend,
      message: `Tendência dos últimos ${daysNumber} dias`,
    };
  }

  @Get('overview')
  async getOverview(@Req() req: Request) {
    try {
      const { userId } = req['user'];

      // Busca múltiplas métricas em paralelo
      const [metrics, weekTrend, dailySummary] = await Promise.all([
        this.glucoseService.getMetrics(userId),
        this.glucoseService.getTrend(userId, 7),
        this.glucoseService.getDailySummary(userId),
      ]);

      return {
        success: true,
        data: {
          metrics,
          weekTrend,
          dailySummary,
          lastUpdated: new Date(),
        },
        message: 'Visão geral completa',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: `Erro ao buscar visão geral: ${error.message}`,
      };
    }
  }

  // @Get('statistics')
  // async getStatistics(@Req() req: Request) {
  //   const { userId } = req['user'];
  //   const statistics = await this.glucoseService.getStatistics(userId);

  //   return {
  //     success: true,
  //     data: {
  //       today: {
  //         ...statistics.today,
  //         lastReading: statistics.today.lastReading
  //           ? this.formatGlucoseLogResponse(statistics.today.lastReading)
  //           : null,
  //       },
  //       movingAverages: statistics.movingAverages,
  //       timeInRange: statistics.timeInRange,
  //       patterns: statistics.patterns,
  //     },
  //   };
  // }

  // @Get('daily-summaries')
  // async getDailySummaries(
  //   @Req() req: Request,
  //   @Query('days') days: number = 30,
  // ) {
  //   const { userId } = req['user'];
  //   const summaries = await this.glucoseService.getDailySummaries(userId, days);

  //   return {
  //     success: true,
  //     data: summaries.map((summary) =>
  //       this.formatDailySummaryResponse(summary),
  //     ),
  //   };
  // }

  // @Get(':id')
  // async findOne(@Req() req: Request, @Param('id') id: string) {
  //   const { userId } = req['user'];
  //   const glucoseLog = await this.glucoseService.findOne(userId, id);

  //   return {
  //     success: true,
  //     data: this.formatGlucoseLogResponse(glucoseLog),
  //   };
  // }

  // @Put(':id')
  // async update(
  //   @Req() req,
  //   @Param('id') id: string,
  //   @Body() updateDto: UpdateGlucoseLogDto,
  // ) {
  //   const { userId } = req['user'];

  //   const glucoseLog = await this.glucoseService.update(userId, id, updateDto);

  //   return {
  //     success: true,
  //     message: 'Leitura atualizada com sucesso',
  //     data: this.formatGlucoseLogResponse(glucoseLog),
  //   };
  // }

  // @Delete(':id')
  // async remove(@Req() req: Request, @Param('id') id: string) {
  //   const { userId } = req['user'];

  //   await this.glucoseService.remove(userId, id);

  //   return {
  //     success: true,
  //     message: 'Leitura excluída com sucesso',
  //   };
  // }

  // Métodos auxiliares para formatação
  private formatGlucoseLogResponse(log: any) {
    const formatted = log.getFormattedData ? log.getFormattedData() : {};

    return {
      id: log.id,
      userId: log.userId,
      value: log.value,
      readingType: log.readingType,
      response: log.response,
      readingAt: log.readingAt.toISOString(),
      readingDate: log.readingDate.toISOString().split('T')[0],
      timeOfDay: log.timeOfDay,
      relatedMeal: log.relatedMeal,
      mealAnalysisId: log.mealAnalysisId,
      notes: log.notes,
      symptoms: log.symptoms,
      influencingFactors: log.influencingFactors,
      sevenDayAvg: log.sevenDayAvg,
      fourteenDayAvg: log.fourteenDayAvg,
      thirtyDayAvg: log.thirtyDayAvg,
      estimatedHbA1c: log.estimatedHbA1c,
      timeInRange: log.timeInRange,
      glycemicVariability: log.glycemicVariability,
      personalTarget: log.personalTarget,
      measurementDevice: log.measurementDevice,
      confidence: log.confidence,
      createdAt: log.createdAt.toISOString(),
      updatedAt: log.updatedAt.toISOString(),

      // Formatados
      formattedValue: formatted.value,
      typeDescription: formatted.type,
      responseDescription: formatted.response,
      timeOfDayDescription: formatted.timeOfDay,
      colorCode: formatted.color,
      icon: formatted.icon,
      isInTarget: formatted.isInTarget,
      isAlert: formatted.isAlert,
    };
  }

  private formatDailySummaryResponse(summary: any) {
    const status = summary.getDailyStatus
      ? summary.getDailyStatus()
      : { status: 'N/A', color: '#6B7280', icon: 'help-circle' };

    return {
      id: summary.id,
      userId: summary.userId,
      date: summary.date.toISOString().split('T')[0],
      totalReadings: summary.totalReadings,
      fastingReadings: summary.fastingReadings,
      preMealReadings: summary.preMealReadings,
      postMealReadings: summary.postMealReadings,
      averageGlucose: summary.averageGlucose,
      fastingAverage: summary.fastingAverage,
      preMealAverage: summary.preMealAverage,
      postMealAverage: summary.postMealAverage,
      hypoglycemicCount: summary.hypoglycemicCount,
      normalCount: summary.normalCount,
      hyperglycemicCount: summary.hyperglycemicCount,
      timeInRangePercent: summary.timeInRangePercent,
      highestGlucose: summary.highestGlucose,
      highestGlucoseTime: summary.highestGlucoseTime,
      lowestGlucose: summary.lowestGlucose,
      lowestGlucoseTime: summary.lowestGlucoseTime,
      standardDeviation: summary.standardDeviation,
      coefficientVariation: summary.coefficientVariation,
      estimatedAverageGlucose: summary.estimatedAverageGlucose,
      estimatedHbA1c: summary.estimatedHbA1c,
      dailyTargetAchieved: summary.dailyTargetAchieved,
      dailyScore: summary.dailyScore,
      notes: summary.notes,
      hadHypoglycemia: summary.hadHypoglycemia,
      hadHyperglycemia: summary.hadHyperglycemia,
      hadExercise: summary.hadExercise,
      wasSick: summary.wasSick,
      hadStress: summary.hadStress,
      sevenDayMovingAvg: summary.sevenDayMovingAvg,
      fourteenDayMovingAvg: summary.fourteenDayMovingAvg,
      thirtyDayMovingAvg: summary.thirtyDayMovingAvg,
      createdAt: summary.createdAt.toISOString(),
      updatedAt: summary.updatedAt.toISOString(),

      // Para frontend
      dayOfWeek: summary.getDayOfWeek ? summary.getDayOfWeek() : '',
      formattedDate: summary.getFormattedDate ? summary.getFormattedDate() : '',
      status,
    };
  }
}
