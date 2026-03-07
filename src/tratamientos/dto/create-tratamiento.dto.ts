import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateTratamientoDto {
  @ApiProperty({ example: 1, description: 'ID del protocolo al que pertenece' })
  @IsInt()
  protocoloId: number; // Cambiado de ensayoId a protocoloId

  @ApiProperty({ example: 1, description: 'Número de tratamiento dentro del protocolo' })
  @IsInt()
  numeroTrat: number;


  @ApiPropertyOptional({ example: 'Descripción del tratamiento' })
  @IsOptional()
  @IsString()
  descripcion?: string | null;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  esTestigo?: boolean;
}
