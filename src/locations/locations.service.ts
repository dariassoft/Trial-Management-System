import { Injectable } from '@nestjs/common';
import { locationsData, provincias } from './data/locations.data';

@Injectable()
export class LocationsService {
  getProvincias(): string[] {
    return provincias;
  }

  getDepartamentosByProvincia(provincia: string): string[] {
    return locationsData[provincia] || [];
  }
}
