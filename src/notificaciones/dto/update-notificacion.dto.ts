
import { PartialType } from '@nestjs/swagger';
import { CreateNotificacionDto } from './create-notificacion.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNotificacionDto extends PartialType(CreateNotificacionDto) {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    leido?: boolean;
}
