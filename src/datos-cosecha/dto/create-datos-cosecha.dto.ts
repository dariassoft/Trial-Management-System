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

  // NUEVOS CAMPOS - Gramaje y composición
  @ApiPropertyOptional({ example: 0.045, description: 'Peso individual del grano (g)' })
  @IsOptional()
  @IsNumber()
  gramajePorGrano?: number | null;

  @ApiPropertyOptional({ example: 48500, description: 'Cantidad de granos por m²' })
  @IsOptional()
  @IsNumber()
  granosPorurf?: number | null;

  @ApiPropertyOptional({ example: 2182.5, description: 'Peso total de granos por m² (g)' })
  @IsOptional()
  @IsNumber()
  pesoGranosPorUrf?: number | null;

  @ApiPropertyOptional({ example: 4.2, description: '% de granos dañados' })
  @IsOptional()
  @IsNumber()
  granosDanados?: number | null;

  @ApiPropertyOptional({ example: 2.1, description: '% de granos verdes' })
  @IsOptional()
  @IsNumber()
  granosVerdes?: number | null;

  @ApiPropertyOptional({ example: 1.8, description: '% de granos vanos' })
  @IsOptional()
  @IsNumber()
  granosVanos?: number | null;

  // NUEVOS CAMPOS - Mediciones de parcela
  @ApiPropertyOptional({ example: 4850, description: 'Hojas por m²' })
  @IsOptional()
  @IsNumber()
  hojasPorUrf?: number | null;

  @ApiPropertyOptional({ example: 12, description: 'Larvas por m²' })
  @IsOptional()
  @IsNumber()
  larvasPorUrf?: number | null;

  @ApiPropertyOptional({ example: 28, description: 'Insectos benéficos por m²' })
  @IsOptional()
  @IsNumber()
  insectosBeneficiosPorUrf?: number | null;

  @ApiPropertyOptional({ example: 8.5, description: 'Diámetro de espiga (mm)' })
  @IsOptional()
  @IsNumber()
  diametroEspiga?: number | null;

  @ApiPropertyOptional({ example: 75.5, description: 'Altura de la parcela (cm)' })
  @IsOptional()
  @IsNumber()
  alturaParcela?: number | null;

  @ApiPropertyOptional({ example: 8.2, description: 'Densidad final de plantas (plantas/m²)' })
  @IsOptional()
  @IsNumber()
  densidadPlantasFinal?: number | null;

  @ApiPropertyOptional({ example: 'Observaciones de la trilla', maxLength: 65535 })
  @IsOptional()
  @IsString()
  @MaxLength(65535)
  observaciones?: string | null;
}
