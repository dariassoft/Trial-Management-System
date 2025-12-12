import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AssignLabsDto {
  @ApiProperty({ type: [Number], example: [1, 2, 3], description: 'IDs de laboratorios a asignar' })
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Number)
  @IsInt({ each: true })
  @Min(1, { each: true })
  laboratorioIds: number[];
}
