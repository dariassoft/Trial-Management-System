import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Rol } from './rol.entity';

export enum AccionPermiso {
  VER = 'VER',
  CREAR = 'CREAR',
  EDITAR = 'EDITAR',
  ELIMINAR = 'ELIMINAR',
  LISTAR = 'LISTAR',
  EXPORTAR = 'EXPORTAR',
}

@Entity('Permiso')
export class Permiso {
  @PrimaryGeneratedColumn({ name: 'permiso_id' })
  id: number;

  @ManyToOne(() => Rol, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'rol_id_fk' })
  rol: Rol;

  @Column({ name: 'rol_id_fk' })
  rol_id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  recurso: string; // ej: 'laboratorios', 'usuarios', 'productos', 'cultivos', etc

  @Column({ type: 'varchar', length: 20, nullable: false })
  accion: AccionPermiso; // VER, CREAR, EDITAR, ELIMINAR, LISTAR, EXPORTAR

  @Column({ type: 'text', nullable: true })
  descripcion: string | null;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}

