import { PartialType } from '@nestjs/swagger';
import { CreateTipoEnsayoDto } from './create-tipo-ensayo.dto';

export class UpdateTipoEnsayoDto extends PartialType(CreateTipoEnsayoDto) {}
