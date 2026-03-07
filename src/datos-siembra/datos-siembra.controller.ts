import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DatosSiembraService } from './datos-siembra.service';
import { CreateDatosSiembraDto } from './dto/create-datos-siembra.dto';
import { UpdateDatosSiembraDto } from './dto/update-datos-siembra.dto';

@ApiBearerAuth()
@ApiTags('Datos de Siembra')
@Controller('datos-siembra')
export class DatosSiembraController {
  constructor(private readonly service: DatosSiembraService) {}

  @Post()
  create(@Body() dto: CreateDatosSiembraDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiQuery({ name: 'parcelaId', type: Number, required: false })
  findAll(@Query('parcelaId') parcelaId?: string) {
    if (parcelaId) {
      return this.service.findByParcelaId(parseInt(parcelaId, 10));
    }
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDatosSiembraDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}

