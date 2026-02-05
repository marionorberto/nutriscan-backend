// src/controllers/MealAnalysis.controller.ts
import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MealAnalysisService } from './meal-analysis.service';
import { CreateAnalysisDto } from './dtos/create-meal-analysis.dto';
import { AuthGuard } from 'shared/auth/auth.guard';
import { Request } from 'express';
// import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

// @ApiBearerAuth()
@Controller('meal-analysis')
export class MealAnalysisController {
  constructor(private readonly mealAnalysisService: MealAnalysisService) {}

  @Post('save-analysis')
  // @ApiOperation({ summary: 'Salvar análise de refeição' })
  @UseGuards(AuthGuard)
  async saveAnalysis(
    @Req() request: Request,
    @Body() evaluationData: CreateAnalysisDto,
  ) {
    const { userId } = request['user'];
    const result = await this.mealAnalysisService.saveAnalysis(
      userId,
      evaluationData,
    );
    return {
      success: true,
      message: 'Análise salva com sucesso',
      data: result,
    };
  }

  // No seu backend, adicione este endpoint:
  @Get('history')
  @UseGuards(AuthGuard)
  async getHistory(
    @Req() request: Request,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const { userId } = request['user'];

    const history = await this.mealAnalysisService.getUserHistory(userId, {
      page,
      limit,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });

    return {
      success: true,
      data: history,
    };
  }

  @Get('daily-summary')
  @UseGuards(AuthGuard)
  async getDailySummary(
    @Req() request: Request,
    @Query('date') date?: string,
  ) {
    const { userId } = request['user'];
    const summary = await this.mealAnalysisService.getDailySummary(
      userId,
      date,
    );

    return {
      success: true,
      data: summary,
    };
  }
 

  @Get('statistics')
  // @ApiOperation({ summary: 'Obter estatísticas' })
  @UseGuards(AuthGuard)
  async getStatistics(
    @Req() request: Request,
    @Query('days') days: number = 30,
  ) {
    const { userId } = request['user'];
    const statistics = await this.mealAnalysisService.getStatistics(
      userId,
      days,
    );

    return {
      success: true,
      data: statistics,
    };
  }

  @Get('preferences')
  @UseGuards(AuthGuard)
  // @ApiOperation({ summary: 'Obter preferências alimentares do usuário' })
  async getPreferences(@Req() request: Request) {
    const { userId } = request['user'];
    const preferences =
      await this.mealAnalysisService.getUserFoodPreferences(userId);

    return {
      success: true,
      data: preferences,
    };
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  // @ApiOperation({ summary: 'Obter detalhes de uma análise específica' })
  async getAnalysisById(@Req() request: Request, @Param('id') id: string) {
    const { userId } = request['user'];
    const analysis = await this.mealAnalysisService.getAnalysisDetail(
      id,
      userId,
    );

    return {
      success: true,
      data: analysis,
    };
  }

  @Patch(':id/glucose')
  @UseGuards(AuthGuard)
  // @ApiOperation({ summary: 'Atualizar dados de glicemia' })
  async updateGlucoseData(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() glucoseData: any,
  ) {
    const { userId } = request['user'];
    const updated = await this.mealAnalysisService.updateWithGlucoseData(
      id,
      userId,
      glucoseData,
    );

    return {
      success: true,
      message: 'Dados de glicemia atualizados',
      data: updated,
    };
  }

  @Patch(':id/favorite')
  @UseGuards(AuthGuard)
  // @ApiOperation({ summary: 'Alternar favorito' })
  async toggleFavorite(@Req() request: Request, @Param('id') id: string) {
    const { userId } = request['user'];
    const updated = await this.mealAnalysisService.toggleFavorite(id, userId);

    return {
      success: true,
      message: 'Status de favorito atualizado',
      data: updated,
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  // @ApiOperation({ summary: 'Excluir análise' })
  async deleteAnalysis(@Req() request: Request, @Param('id') id: string) {
    const { userId } = request['user'];
    await this.mealAnalysisService.deleteAnalysis(id, userId);

    return {
      success: true,
      message: 'Análise excluída com sucesso',
    };
  }
}
