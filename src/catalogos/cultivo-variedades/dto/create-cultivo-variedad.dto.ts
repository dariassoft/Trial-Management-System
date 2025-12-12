import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, IsInt } from 'class-validator';

export class CreateCultivoVariedadDto {
  @ApiProperty({ description: 'Nombre de la variedad', example: 'Don Mario 40R21' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  nombre: string;

  @ApiProperty({ description: 'ID del Cultivo al que pertenece', example: 1 })
  @IsInt()
  @IsNotEmpty()
  cultivo_id: number;
}
