import { PartialType } from '@nestjs/swagger';
import { CreateTratamientoProductoDto } from './create-tratamiento-producto.dto';

export class UpdateTratamientoProductoDto extends PartialType(CreateTratamientoProductoDto) {}
