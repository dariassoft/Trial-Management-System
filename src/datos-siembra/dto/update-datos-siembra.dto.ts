import { PartialType } from '@nestjs/swagger';
import { CreateDatosSiembraDto } from './create-datos-siembra.dto';

export class UpdateDatosSiembraDto extends PartialType(CreateDatosSiembraDto) {}

