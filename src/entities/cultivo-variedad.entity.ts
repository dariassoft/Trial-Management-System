import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Cultivo } from './cultivo.entity';

@Entity('Cultivo_Variedad')
export class CultivoVariedad {
  @PrimaryGeneratedColumn({ name: 'variedad_id' })
  id: number;

  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  caracteristicas: string | null;

  @Column({ type: 'boolean', default: true })
  esta_activo: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => Cultivo, (cultivo) => cultivo.variedades, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cultivo_id_fk' })
  cultivo: Cultivo;

  @Column({ name: 'cultivo_id_fk' })
  cultivo_id: number;
}
