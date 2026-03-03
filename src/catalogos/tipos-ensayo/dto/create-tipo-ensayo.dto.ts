import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class CreateTipoEnsayoDto {
  @ApiProperty({ description: 'Nombre del tipo de ensayo', example: 'FUNGICIDA' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  nombre: string;

  @ApiPropertyOptional({ description: 'Descripción del tipo de ensayo', example: 'Fungicida para control de enfermedades fúngicas' })
  @IsOptional()
  @IsString()
  descripcion?: string | null;

  @ApiPropertyOptional({ description: 'Días de evaluación separados por coma (DDA)', example: '3,7,14,21,28' })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]+(,[0-9]+)*$/,{ message: 'evaluacionCsv debe ser una lista de enteros separada por comas' })
  evaluacionCsv?: string;

  @ApiPropertyOptional({ description: 'Si el tipo de ensayo está activo', default: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
