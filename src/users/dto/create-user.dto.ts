import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, ArrayNotEmpty, IsBoolean, IsDateString, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({ description: 'Email del usuario (único)', example: 'user@example.com' })
  @IsEmail()
  username: string;

  @ApiProperty({ description: 'Contraseña en texto plano (será hasheada)', example: 'S3gura123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'ID del rol a asignar', example: 2 })
  @IsInt()
  rolId: number;

  @ApiPropertyOptional({ description: 'Nombre', example: 'María', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombre?: string | null;

  @ApiPropertyOptional({ description: 'Apellido', example: 'Pérez', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  apellido?: string | null;

  @ApiProperty({ description: 'Teléfono', example: '3875789133', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  telefono: string;

  @ApiPropertyOptional({ description: 'Fecha de nacimiento (YYYY-MM-DD)', example: '1990-05-21' })
  @IsOptional()
  @IsDateString()
  fecha_nacimiento?: string | null;

  @ApiPropertyOptional({ description: 'Usuario activo', example: true, default: true })
  @IsOptional()
  @IsBoolean()
  esta_activo?: boolean;

  @ApiPropertyOptional({ description: 'IDs de laboratorios asignados', example: [1,2,3], type: [Number] })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  laboratorioIds?: number[];
}
