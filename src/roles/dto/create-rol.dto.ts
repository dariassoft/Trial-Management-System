import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateRolDto {
  @ApiProperty({
    description: 'Nombre del rol (debe ser único)',
    example: 'Administrador',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  nombre: string;

  @ApiPropertyOptional({
    description: 'Descripción del rol',
    example: 'Acceso administrativo completo al sistema',
    maxLength: 500,
  })
  @IsString()
  @MaxLength(500)
  descripcion?: string | null;
}

