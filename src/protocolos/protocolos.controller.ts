// typescript
// Archivo: `src/protocolos/protocolos.controller.ts`
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProtocolosService } from './protocolos.service';
import { CreateProtocoloDto } from './dto/create-protocolo.dto';
import { UpdateProtocoloDto } from './dto/update-protocolo.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../entities/rol.entity';
import { Protocolo } from '../entities/protocolo.entity';

@ApiTags('Protocolos')
@ApiBearerAuth()
@Controller('protocolos')
export class ProtocolosController {
  constructor(private readonly service: ProtocolosService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Crear un nuevo protocolo' })
  @ApiResponse({ status: 201, description: 'Protocolo creado', type: Protocolo })
  create(@Body() dto: CreateProtocoloDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de todos los protocolos' })
  @ApiResponse({ status: 200, description: 'Lista de protocolos', type: [Protocolo] })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un protocolo por ID' })
  @ApiResponse({ status: 200, description: 'Protocolo encontrado', type: Protocolo })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Actualizar un protocolo' })
  @ApiResponse({ status: 200, description: 'Protocolo actualizado', type: Protocolo })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProtocoloDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({ summary: 'Eliminar un protocolo' })
  @ApiResponse({ status: 200, description: 'Protocolo eliminado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
