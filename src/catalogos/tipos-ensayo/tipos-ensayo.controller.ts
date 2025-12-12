import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TiposEnsayoService } from './tipos-ensayo.service';
import { CreateTipoEnsayoDto } from './dto/create-tipo-ensayo.dto';
import { UpdateTipoEnsayoDto } from './dto/update-tipo-ensayo.dto';
import { AddVariableDto } from './dto/add-variable.dto';
import { SetEvaluacionDto } from './dto/set-evaluacion.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../entities/rol.entity';

@ApiTags('Catálogo - Tipos de Ensayo')
@ApiBearerAuth()
@Controller('catalogos/tipos-ensayo')
export class TiposEnsayoController {
  constructor(private readonly service: TiposEnsayoService) {}

  // CRUD Tipos de Ensayo
  @Post()
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Crear un tipo de ensayo' })
  @ApiResponse({ status: 201, description: 'Tipo de ensayo creado' })
  create(@Body() dto: CreateTipoEnsayoDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar tipos de ensayo' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un tipo de ensayo por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Actualizar un tipo de ensayo' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTipoEnsayoDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({ summary: 'Eliminar un tipo de ensayo' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  // Variables vinculadas al tipo
  @Get(':id/variables')
  @ApiOperation({ summary: 'Listar variables asociadas a un tipo de ensayo' })
  listVars(@Param('id', ParseIntPipe) id: number) {
    return this.service.listVariables(id);
  }

  @Post(':id/variables')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Agregar una variable al tipo de ensayo' })
  addVar(@Param('id', ParseIntPipe) id: number, @Body() dto: AddVariableDto) {
    return this.service.addVariable(id, dto);
  }

  @Delete('variables/:tevId')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Quitar una variable del tipo de ensayo' })
  removeVar(@Param('tevId', ParseIntPipe) tevId: number) {
    return this.service.removeVariable(tevId);
  }

  // Días de evaluación
  @Get(':id/dias')
  @ApiOperation({ summary: 'Listar días de evaluación normalizados (DDA)' })
  getDias(@Param('id', ParseIntPipe) id: number) {
    return this.service.getDias(id);
  }

  @Put(':id/evaluacion')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Establecer días de evaluación (acepta CSV o arreglo de enteros). Sincroniza evaluacion_csv y tabla normalizada.' })
  setEvaluacion(@Param('id', ParseIntPipe) id: number, @Body() dto: SetEvaluacionDto) {
    return this.service.setEvaluacion(id, dto);
  }
}
