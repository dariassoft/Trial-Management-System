import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Tratamiento } from './tratamiento.entity';
import { Producto } from './producto.entity';

@Entity('Tratamiento_Producto')
@Unique(['tratamiento', 'producto'])
export class TratamientoProducto {
  @PrimaryGeneratedColumn({ name: 'trat_prod_id' })
  id: number;

  @ManyToOne(() => Tratamiento, (tratamiento) => tratamiento.productos, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tratamiento_id_fk' })
  tratamiento: Tratamiento;

  @ManyToOne(() => Producto, (producto) => producto.tratamientosProducto, { nullable: false })
  @JoinColumn({ name: 'producto_id_fk' })
  producto: Producto;

  @Column({ type: 'varchar', length: 50, nullable: true })
  dosis?: string | null;

  @Column({ name: 'unidad_dosis', type: 'varchar', length: 20, default: 'cc/ha' })
  unidadDosis: string;

  @Column({ type: 'varchar', length: 20, nullable: true, comment: 'Estadio de aplicación (V2, V3, V4, etc.)' })
  estadio?: string | null;
}
