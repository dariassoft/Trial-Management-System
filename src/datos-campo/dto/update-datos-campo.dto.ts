import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

// DTO anidado para una sola medición (reemplaza las existentes)
class MedicionDto {
  @ApiProperty({ description: 'ID de la variable a medir', example: 1 })
  @IsInt()
  variable_id: number;

  @ApiProperty({ description: 'Valor registrado', example: '10.5' })
  @IsString()
  @IsNotEmpty()
  valor: string;
}

export class UpdateDatosCampoDto {
  @ApiProperty({ description: 'Observaciones generales de la visita', required: false })
  @IsString()
  @IsOptional()
  observaciones?: string;

  @ApiProperty({
    type: [MedicionDto],
    required: false,
    description: 'Lista COMPLETA de mediciones. Reemplazará las existentes si se envía.'
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MedicionDto)
  @IsOptional()
  mediciones?: MedicionDto[];
}
