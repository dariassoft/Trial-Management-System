import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';

@ApiTags('autenticacion')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión y obtener token JWT' })
  async login(@Body(ValidationPipe) loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // Endpoint para hashear la contraseña del seed (ej.: 123456) del usuario inicial
  // Úsalo una sola vez tras cargar el SQL de seed
  @Public()
  @Post('bootstrap-hash')
  @ApiOperation({ summary: 'Hashea la contraseña del usuario indicado (bootstrap del seed)' })
  async bootstrapHash(@Body('username') username: string) {
    return this.authService.bootstrapHash(username);
  }
}
