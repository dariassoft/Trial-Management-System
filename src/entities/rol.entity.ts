import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Usuario } from './usuario.entity';

export enum Role {
  SUPERADMIN = 'Superadministrador',
  ADMIN = 'Administrador',
  MANAGER = 'Manager',
  TECNICO = 'Tecnico',
  INVITADO = 'Invitado',
}

@Entity('Rol')
export class Rol {
  @PrimaryGeneratedColumn({ name: 'rol_id' })
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true, name: 'nombre_rol' })
  nombre: Role;

  @Column({ type: 'text', nullable: true })
  descripcion: string | null;

  @OneToMany(() => Usuario, (usuario) => usuario.rol)
  usuarios: Usuario[];
}
