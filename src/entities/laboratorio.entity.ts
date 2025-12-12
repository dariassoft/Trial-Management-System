import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Producto } from './producto.entity';
import { UsuarioLaboratorio } from './usuario-laboratorio.entity';

@Entity('Laboratorio')
export class Laboratorio {
  @PrimaryGeneratedColumn({ name: 'lab_id' })
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  nombre: string;

  // Relación: Un Laboratorio tiene muchos Productos
  @OneToMany(() => Producto, (producto) => producto.laboratorio)
  productos: Producto[];

  // Relación inversa: usuarios asignados a este laboratorio (clientes/invitados)
  @OneToMany(() => UsuarioLaboratorio, (ul) => ul.laboratorio)
  usuariosAsignados: UsuarioLaboratorio[];
}
