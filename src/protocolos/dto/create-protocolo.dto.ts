import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProtocoloDto {
  @ApiProperty({ description: 'Nombre del protocolo', example: 'Protocolo Herbicida Maíz' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  nombre: string;

  @ApiPropertyOptional({ description: 'Descripción detallada del protocolo', example: 'Protocolo para el control de malezas en maíz post-emergencia.' })
  @IsOptional()
  @IsString()
  descripcion?: string | null;
}
