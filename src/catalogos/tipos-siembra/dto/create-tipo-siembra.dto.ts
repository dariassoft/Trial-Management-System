import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTipoSiembraDto {
  @ApiProperty({ example: 'Siembra Directa' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  nombre: string;
}
