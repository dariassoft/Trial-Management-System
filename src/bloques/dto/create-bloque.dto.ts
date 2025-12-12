import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, MaxLength } from 'class-validator';

export class CreateBloqueDto {
  @ApiProperty({ example: 1, description: 'ID del ensayo' })
  @IsInt()
  ensayoId: number;

  @ApiProperty({ example: 'A', maxLength: 10, description: 'Nombre del bloque' })
  @IsString()
  @MaxLength(10)
  nombreBloque: string;
}
