import { PartialType } from '@nestjs/swagger';
import { CreateCultivoVariedadDto } from './create-cultivo-variedad.dto';

export class UpdateCultivoVariedadDto extends PartialType(CreateCultivoVariedadDto) {}
