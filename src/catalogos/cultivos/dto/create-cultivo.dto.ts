import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateCultivoDto {
  @ApiProperty({ description: 'Nombre del cultivo', example: 'Girasol' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  nombre: string;
}
