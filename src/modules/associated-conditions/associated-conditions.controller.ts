import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Req,
} from '@nestjs/common';
import { AssociatedConditionsService } from './associated-conditions.service';
import { CreateAssociatedConditionDto } from './dtos/create-associated-.conditions.dto';
import { UpdateAssociatedConditionDto } from './dtos/update-associated-conditions.dto';
import { AuthGuard } from '../../shared/auth/auth.guard';
import { Request } from 'express';

@Controller('associated-conditions')
export class AssociatedConditionsController {
  constructor(
    private readonly associatedConditionService: AssociatedConditionsService,
  ) {}

  @Get('all')
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll() {
    return await this.associatedConditionService.findAll();
  }

  @Get('associated-condition')
  async findByPk(@Param('id') id: string, @Req() request: Request) {
    return await this.associatedConditionService.findByPk(id, request);
  }

  @Post('create/associated-condition')
  create(@Body() createAssociatedConditionDto: CreateAssociatedConditionDto) {
    return this.associatedConditionService.create(createAssociatedConditionDto);
  }

  @UseGuards(AuthGuard)
  @Put('update/associated-condition')
  async updateOne(
    @Param('id') id: string,
    @Req() request: Request,
    @Body() updateAssociatedConditionDto: UpdateAssociatedConditionDto,
  ) {
    return await this.associatedConditionService.updateOne(
      id,
      request,
      updateAssociatedConditionDto,
    );
  }

  @UseGuards(AuthGuard)
  @Delete('delete/associated-condition/:id')
  async deleteOne(@Param('id') id: string, @Req() request: Request) {
    return await this.associatedConditionService.deleteOne(id, request);
  }
}
