import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProtocoloVariableDto {
  @ApiProperty({ description: 'Nombre único de la variable', example: 'Altura de planta' })
  @IsString()
  @MaxLength(100)
  nombre_variable: string;

  @ApiPropertyOptional({ description: 'Unidad de medida', example: 'cm' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  unidad_medida?: string | null;

  @ApiPropertyOptional({ description: 'Descripción de la variable', example: 'Altura promedio por planta' })
  @IsOptional()
  @IsString()
  descripcion?: string | null;
}
