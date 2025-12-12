import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateLaboratorioDto {
  @ApiProperty({ example: 'ACME Agro Labs', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  nombre: string;
}
