import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MaxLength, IsBoolean } from 'class-validator';

export class CreateCultivoDto {
  @ApiProperty({
    description: 'Nombre del cultivo',
    example: 'Maíz',
    maxLength: 100
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @ApiPropertyOptional({
    description: 'Descripción del cultivo',
    example: 'Cultivo de maíz para grano',
    maxLength: 500
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  descripcion?: string | null;

  @ApiPropertyOptional({
    description: 'Ciclo vegetativo del cultivo',
    example: '120-140 días',
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  ciclo_vegetativo?: string | null;

  @ApiPropertyOptional({
    description: 'Cultivo activo',
    example: true,
    default: true
  })
  @IsOptional()
  @IsBoolean()
  esta_activo?: boolean;
}
