import { PartialType } from '@nestjs/swagger';
import { CreateMomentoDto } from './create-momento.dto';

export class UpdateMomentoDto extends PartialType(CreateMomentoDto) {}
