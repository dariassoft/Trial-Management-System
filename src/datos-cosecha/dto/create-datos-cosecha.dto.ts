import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateDatosCosechaDto {
  @ApiProperty({ example: 1, description: 'ID de la parcela' })
  @IsInt()
  parcelaId: number;

  @ApiPropertyOptional({ example: '2025-05-30' })
  @IsOptional()
  @IsDateString()
  fechaCosecha?: string | null;

  @ApiPropertyOptional({ example: 14.2, description: 'Humedad (%)' })
  @IsOptional()
  @IsNumber()
  humedadPct?: number | null;

  @ApiPropertyOptional({ example: 5200.5, description: 'kg/ha corregido' })
  @IsOptional()
  @IsNumber()
  kgHaCorregido?: number | null;

  @ApiPropertyOptional({ example: 123.45 })
  @IsOptional()
  @IsNumber()
  gie?: number | null;

  @ApiPropertyOptional({ example: 'Observaciones de la trilla', maxLength: 65535 })
  @IsOptional()
  @IsString()
  @MaxLength(65535)
  observaciones?: string | null;
}
