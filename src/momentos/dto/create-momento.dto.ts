import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateMomentoDto {
  @ApiProperty({ example: 1, description: 'ID de la aplicación a la que pertenece' })
  @IsInt()
  aplicacionId: number;

  @ApiProperty({ example: '7DDA', maxLength: 50 })
  @IsString()
  @MaxLength(50)
  nombreMomento: string;

  @ApiPropertyOptional({ example: 7 })
  @IsOptional()
  @IsInt()
  diasDespuesAplicacion?: number | null;

  @ApiPropertyOptional({ example: '2025-04-01' })
  @IsOptional()
  @IsDateString()
  fechaEvaluacion?: string | null;
}
