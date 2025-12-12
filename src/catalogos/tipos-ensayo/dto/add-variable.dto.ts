import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength, Min, ValidateIf, IsNumber } from 'class-validator';

export class AddVariableDto {
  @ApiProperty({ description: 'ID de la variable del diccionario (Protocolo_Variable)', example: 12 })
  @IsInt()
  @IsPositive()
  variableId: number;

  @ApiPropertyOptional({ description: 'Orden de visualización', example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  orden?: number;

  @ApiPropertyOptional({ description: 'Si la variable es requerida', default: false })
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
