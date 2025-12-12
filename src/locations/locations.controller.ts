import { Controller, Get, Param } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('locations')
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('provincias')
  @ApiOperation({ summary: 'Obtener listado de provincias' })
  @ApiResponse({ status: 200, description: 'Listado de provincias', type: [String] })
  getProvincias() {
    return this.locationsService.getProvincias();
  }

  @Get('provincias/:provincia/departamentos')
  @ApiOperation({ summary: 'Obtener listado de departamentos para una provincia' })
  @ApiParam({ name: 'provincia', description: 'Nombre de la provincia' })
  @ApiResponse({ status: 200, description: 'Listado de departamentos', type: [String] })
  getDepartamentosByProvincia(@Param('provincia') provincia: string) {
    return this.locationsService.getDepartamentosByProvincia(provincia);
  }
}
