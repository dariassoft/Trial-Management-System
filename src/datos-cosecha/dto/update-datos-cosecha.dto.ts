import { PartialType } from '@nestjs/swagger';
import { CreateDatosCosechaDto } from './create-datos-cosecha.dto';

export class UpdateDatosCosechaDto extends PartialType(CreateDatosCosechaDto) {}
