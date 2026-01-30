import { Controller, Get, Patch, Param, Body, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { ProtocoloVariablesService } from './protocolo-variables.service';
import { UpdateProtocoloVariableDto } from './dto/update-protocolo-variable.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../entities/rol.entity';
import { ProtocoloVariable } from '../entities/protocolo-variable.entity';

@ApiTags('Protocolo - Variables')
@ApiBearerAuth()
@Controller('protocolo-variables')
export class ProtocoloVariablesController {
  constructor(private readonly service: ProtocoloVariablesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas las variables (opcional: filtrar por tipoEnsayoId)' })
  @ApiQuery({ name: 'tipoEnsayoId', required: false, type: Number, description: 'Filtrar por tipo de ensayo' })
  @ApiOkResponse({ type: ProtocoloVariable, isArray: true })
  findAll(@Query('tipoEnsayoId') tipoEnsayoId?: string) {
    if (tipoEnsayoId) {
      return this.service.findByTipoEnsayo(parseInt(tipoEnsayoId, 10));
    }
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una variable por ID' })
  @ApiOkResponse({ type: ProtocoloVariable })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Actualizar una variable de protocolo por su ID' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProtocoloVariableDto) {
    return this.service.update(id, dto);
  }
}
