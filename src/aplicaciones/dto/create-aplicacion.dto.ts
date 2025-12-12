import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateAplicacionDto {
  @ApiProperty({ example: 1, description: 'ID del ensayo al que pertenece la aplicación' })
  @IsInt()
  ensayoId: number;

  @ApiPropertyOptional({ example: 'Primera aplicación', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombreAplicacion?: string;

  @ApiPropertyOptional({ example: '2025-03-18T10:30:00.000Z' })
  @IsOptional()
  @IsDateString()
  fechaHora?: string;

  @ApiPropertyOptional({ example: 'V6', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  estadioCultivo?: string | null;

  @ApiPropertyOptional({ example: 25.5, description: 'Temperatura (°C)' })
  @IsOptional()
  @IsNumber()
  tempC?: number | null;

  @ApiPropertyOptional({ example: 60.0, description: 'Humedad relativa (%)' })
  @IsOptional()
  @IsNumber()
  humedadPct?: number | null;

  @ApiPropertyOptional({ example: 12.3, description: 'Viento (km/h)' })
  @IsOptional()
  @IsNumber()
  vientoKmh?: number | null;

  @ApiPropertyOptional({ example: 'Pulverizadora Jacto', maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  equipoInfo?: string | null;

  @ApiPropertyOptional({ example: 'Pico XR11002', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  picoInfo?: string | null;

  @ApiPropertyOptional({ example: 2.5, description: 'Presión (bar)' })
  @IsOptional()
  @IsNumber()
  presionBar?: number | null;
}
