import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';

class MedicionDto {
  @ApiProperty({ description: 'ID de la variable a medir', example: 1 })
  @IsInt()
  variable_id: number;

  @ApiProperty({ description: 'Valor registrado', example: '10.5' })
  @IsString()
  @IsNotEmpty()
  valor: string;
}

export class CreateDatosCampoDto {
  @ApiProperty({ description: 'ID de la Parcela', example: 12 })
  @IsInt()
  parcela_id_fk: number;

  @ApiProperty({ description: 'ID del Momento de Evaluación', example: 3 })
  @IsInt()
  momento_id_fk: number;

  @ApiPropertyOptional({ description: 'Observaciones generales de la visita' })
  @IsString()
  @IsOptional()
  @MaxLength(65535)
  observaciones?: string;

  @ApiProperty({ type: [MedicionDto], description: 'Lista de mediciones tomadas' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MedicionDto)
  mediciones: MedicionDto[];
}
