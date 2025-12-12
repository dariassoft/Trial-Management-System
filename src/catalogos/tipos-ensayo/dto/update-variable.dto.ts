import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, MaxLength, Min, IsNumber } from 'class-validator';

export class UpdateVariableDto {
  @ApiPropertyOptional({ description: 'Orden de visualización', example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  orden?: number;

  @ApiPropertyOptional({ description: 'Si la variable es requerida' })
  @IsOptional()
  @IsBoolean()
  requerido?: boolean;

  @ApiPropertyOptional({ description: 'Unidad a mostrar (override)', example: 'N°/METRO', maxLength: 30 })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  unidadOverride?: string | null;

  @ApiPropertyOptional({ description: 'Escala (ej. 1-9, 0-100)', example: '1-9', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  escala?: string | null;

  @ApiPropertyOptional({ description: 'Rango mínimo permitido (numérico)' })
  @IsOptional()
  @IsNumber()
  rangoMin?: number | null;

  @ApiPropertyOptional({ description: 'Rango máximo permitido (numérico)' })
  @IsOptional()
  @IsNumber()
  rangoMax?: number | null;
}
