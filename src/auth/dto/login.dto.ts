import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'Email del usuario', example: 'dariassoft@gmail.com' })
  @IsEmail()
  username: string;

  @ApiProperty({ description: 'Contraseña del usuario', example: '123456' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
