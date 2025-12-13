import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StatusEnsayoService } from './status-ensayo.service';
import { StatusEnsayo } from '../entities/status-ensayo.entity';

@ApiTags('Status Ensayos')
@Controller('status-ensayos')
export class StatusEnsayoController {
  constructor(private readonly statusService: StatusEnsayoService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los estados de ensayo disponibles' })
  @ApiResponse({ status: 200, description: 'Lista de estados', type: [StatusEnsayo] })
  async findAll(): Promise<StatusEnsayo[]> {
    return this.statusService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un estado de ensayo por ID' })
  @ApiResponse({ status: 200, description: 'Estado encontrado', type: StatusEnsayo })
  @ApiResponse({ status: 404, description: 'Estado no encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<StatusEnsayo | null> {
    return this.statusService.findById(id);
  }
}

