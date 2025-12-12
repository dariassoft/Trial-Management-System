import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsInt, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

// Extend but explicitly omit username and laboratorioIds from updates via documentation/validation guidance
export class UpdateUserDto extends PartialType(CreateUserDto) {
  // Override username/password validations to clarify optionality on PATCH
  @ApiPropertyOptional({ description: 'Nueva contraseña (opcional). Si se envía, se vuelve a hashear.', minLength: 6 })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({ description: 'ID del rol (opcional)', example: 3 })
  @IsOptional()
  @IsInt()
  rolId?: number;

  @ApiPropertyOptional({ description: 'Nombre', example: 'Juan', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombre?: string | null;

  @ApiPropertyOptional({ description: 'Apellido', example: 'García', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  apellido?: string | null;

  @ApiPropertyOptional({ description: 'Teléfono', example: '3875000000', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  telefono?: string;

  @ApiPropertyOptional({ description: 'Fecha de nacimiento (YYYY-MM-DD)', example: '1992-01-31' })
  @IsOptional()
  @IsDateString()
  fecha_nacimiento?: string | null;

  @ApiPropertyOptional({ description: 'Usuario activo', example: true })
  @IsOptional()
  @IsBoolean()
  esta_activo?: boolean;
}
