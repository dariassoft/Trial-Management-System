import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class AddVariableDto {
  @ApiProperty({ description: 'Nombre de la variable', example: 'PORCENTAJE DE CONTROL GENERAL (BARBECHO)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre_variable: string;

  @ApiPropertyOptional({ description: 'Unidad de medida de la variable', example: '%' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  unidad_medida?: string | null;

  @ApiPropertyOptional({ description: 'Descripción de la variable', example: 'Medición del control en barbecho' })
  @IsOptional()
  @IsString()
  descripcion?: string | null;
}
