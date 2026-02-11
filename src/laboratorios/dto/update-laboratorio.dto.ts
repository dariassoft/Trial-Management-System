import { PartialType } from '@nestjs/swagger';
import { CreateLaboratorioDto } from './create-laboratorio.dto';
import { IsOptional } from 'class-validator';

export class UpdateLaboratorioDto extends PartialType(CreateLaboratorioDto) {
  // Este DTO hereda de PartialType y hace todos los campos opcionales
  // Pero rechaza propiedades no definidas
}
