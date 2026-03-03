import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsNumber, IsDateString, MaxLength } from 'class-validator';

export class CreateDatosSiembraDto {
  @ApiProperty({ example: 1, description: 'ID de la parcela' })
  @IsInt()
  parcelaId: number;

  @ApiPropertyOptional({ example: '2026-03-01', description: 'Fecha de siembra' })
  @IsOptional()
  @IsDateString()
  fechaSiembra?: string;

  @ApiPropertyOptional({ example: 150, description: 'Semillas por metro cuadrado' })
  @IsOptional()
  @IsNumber()
  semillasPorMetro?: number;

  @ApiPropertyOptional({ example: 300000, description: 'Densidad de siembra (plantas/hectárea)' })
  @IsOptional()
  @IsNumber()
  densidadSiembra?: number;

  @ApiPropertyOptional({ example: 85.5, description: 'Porcentaje de germinación' })
  @IsOptional()
  @IsNumber()
  germinacionPct?: number;

  @ApiPropertyOptional({ example: 8, description: 'Vigor de plantas (escala 1-10)' })
  @IsOptional()
  @IsInt()
  vigorPlantasEscala?: number;

  @ApiPropertyOptional({ example: 'Observaciones sobre la siembra', description: 'Observaciones' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  observaciones?: string;
}

