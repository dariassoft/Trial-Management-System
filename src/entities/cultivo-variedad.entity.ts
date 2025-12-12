import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Cultivo } from './cultivo.entity';

@Entity('Cultivo_Variedad')
export class CultivoVariedad {
  @PrimaryGeneratedColumn({ name: 'variedad_id' })
  id: number;

  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  @ManyToOne(() => Cultivo, (cultivo) => cultivo.variedades, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cultivo_id_fk' })
  cultivo: Cultivo;

  // Guardamos el ID del cultivo para facilitar la creación
  @Column({ name: 'cultivo_id_fk' })
  cultivo_id: number;
}
