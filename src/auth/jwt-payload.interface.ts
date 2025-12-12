import { Role } from '../entities/rol.entity';

export interface JwtPayload {
  sub: number; // user id
  username: string;
  rol: Role;
  lab_ids: number[];
}
