import { Role } from '../entities/rol.entity';

export interface JwtPayload {
  sub: number; // user id
  username: string;
  rol: Role;
  rol_id: number; // ID del rol
  lab_ids: number[];
}
