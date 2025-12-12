import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional, IsString, Matches, ArrayNotEmpty, ArrayMinSize, Min } from 'class-validator';

export class SetEvaluacionDto {
  @ApiPropertyOptional({ description: 'Días de evaluación como CSV (e.g., "3,7,14")' })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]+(,[0-9]+)*$/,{ message: 'evaluacionCsv debe ser una lista de enteros separada por comas' })
  evaluacionCsv?: string;

  @ApiPropertyOptional({ description: 'Días de evaluación como arreglo de enteros', type: [Number] })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @Min(0, { each: true })
  dias?: number[];
}
