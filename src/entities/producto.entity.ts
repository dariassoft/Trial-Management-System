import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Laboratorio } from './laboratorio.entity';
import { TratamientoProducto } from './tratamiento-producto.entity';

@Entity('Producto')
export class Producto {
  @PrimaryGeneratedColumn({ name: 'producto_id' })
  id: number;

  @ManyToOne(() => Laboratorio, (laboratorio) => laboratorio.productos, { nullable: true })
  @JoinColumn({ name: 'lab_id_fk' })
  laboratorio?: Laboratorio | null;

  @Column({ type: 'varchar', length: 100 })
  nombre_comercial: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  principio_activo?: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  formulacion?: string | null;

  // Relación: productos usados en tratamientos (tabla intermedia con atributos)
  @OneToMany(() => TratamientoProducto, (tp) => tp.producto)
  tratamientosProducto: TratamientoProducto[];
}
