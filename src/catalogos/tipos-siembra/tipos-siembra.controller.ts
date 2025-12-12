import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TiposSiembraService } from './tipos-siembra.service';
import { CreateTipoSiembraDto } from './dto/create-tipo-siembra.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../entities/rol.entity';

@ApiTags('Catálogo - Tipos de Siembra')
@ApiBearerAuth()
@Controller('catalogos/tipos-siembra')
export class TiposSiembraController {
  constructor(private readonly service: TiposSiembraService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Crear un tipo de siembra' })
  @ApiResponse({ status: 201, description: 'Tipo de siembra creado' })
  create(@Body() dto: CreateTipoSiembraDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar tipos de siembra' })
  findAll() {
    return this.service.findAll();
  }
}
