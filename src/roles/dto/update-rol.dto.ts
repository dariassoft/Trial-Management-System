import { PartialType } from '@nestjs/swagger';
import { CreateRolDto } from './create-rol.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateRolDto extends PartialType(CreateRolDto) {
  @ApiPropertyOptional({
    description: 'Nombre del rol',
    example: 'Gerente',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  nombre?: string;

  @ApiPropertyOptional({
    description: 'Descripción del rol',
    example: 'Acceso a módulos específicos',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  descripcion?: string | null;
}

