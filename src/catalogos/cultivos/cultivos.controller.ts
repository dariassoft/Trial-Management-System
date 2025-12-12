import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CultivosService } from './cultivos.service';
import { CreateCultivoDto } from './dto/create-cultivo.dto';
import { UpdateCultivoDto } from './dto/update-cultivo.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../entities/rol.entity';

@ApiTags('Catálogo - Cultivos')
@ApiBearerAuth()
@Controller('catalogos/cultivos')
export class CultivosController {
  constructor(private readonly cultivosService: CultivosService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Crear un nuevo cultivo' })
  @ApiResponse({ status: 201, description: 'Cultivo creado' })
  @ApiResponse({ status: 403, description: 'Forbidden (Sin permisos)' })
  create(@Body() createCultivoDto: CreateCultivoDto) {
    return this.cultivosService.create(createCultivoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de todos los cultivos' })
  findAll() {
    return this.cultivosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un cultivo por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cultivosService.findOne(id);
  }

  @Get(':id/variedades')
  @ApiOperation({ summary: 'Obtener todas las variedades de un cultivo específico' })
  findVariedadesPorCultivo(@Param('id', ParseIntPipe) id: number) {
    return this.cultivosService.findVariedadesPorCultivo(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Actualizar un cultivo' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCultivoDto: UpdateCultivoDto) {
    return this.cultivosService.update(id, updateCultivoDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({ summary: 'Eliminar un cultivo (y sus variedades)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cultivosService.remove(id);
  }
}
