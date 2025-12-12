import { PartialType } from '@nestjs/swagger';
import { CreateAplicacionDto } from './create-aplicacion.dto';

export class UpdateAplicacionDto extends PartialType(CreateAplicacionDto) {}
