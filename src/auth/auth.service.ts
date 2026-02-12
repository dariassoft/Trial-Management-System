import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './jwt-payload.interface';
import { Role } from '../entities/rol.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<Omit<Usuario, 'password'>> {
    const { username, password } = loginDto;
    const usuario = await this.usuarioRepo.findOne({
      where: { username, esta_activo: true },
      relations: ['rol', 'laboratoriosAsignados', 'laboratoriosAsignados.laboratorio'],
    });
    if (!usuario) {
      this.logger.warn(`Usuario no encontrado: ${username}`);
      throw new UnauthorizedException('Credenciales inválidas.');
    }
    const ok = await usuario.validatePassword(password);
    if (!ok) {
      this.logger.warn(`Contraseña incorrecta para: ${username}`);
      throw new UnauthorizedException('Credenciales inválidas.');
    }
    // ocultar hash en la respuesta
    (usuario as any).password = undefined;
    return usuario as any;
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string; user: any }> {
    const u = await this.validateUser(loginDto);
    const payload: JwtPayload = {
      sub: u.id,
      username: u.username,
      rol: u.rol?.nombre as Role,
      rol_id: u.rol?.id as number,
      lab_ids: (u.rol?.nombre === Role.INVITADO ? (u.laboratoriosAsignados || []).map((ul) => ul.laboratorio.id) : []) as number[],
    };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken, user: u };
  }

  /**
   * Endpoint/uso interno para convertir contraseñas en texto plano a hash bcrypt
   * para el usuario dado (por username). Útil para el seed inicial.
   */
  async bootstrapHash(username: string): Promise<{ updated: boolean }>{
    const usuario = await this.usuarioRepo.findOne({ where: { username } });
    if (!usuario) return { updated: false };
    if (usuario.password && !usuario.password.startsWith('$2')) {
      const saltRounds = 10;
      const hashed = await bcrypt.hash(usuario.password, saltRounds);
      usuario.password = hashed;
      await this.usuarioRepo.save(usuario);
      return { updated: true };
    }
    return { updated: false };
  }
}
