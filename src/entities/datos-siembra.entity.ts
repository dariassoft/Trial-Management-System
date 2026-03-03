import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Parcela } from './parcela.entity';

@Entity('Datos_Siembra')
export class DatosSiembra {
  @PrimaryGeneratedColumn({ name: 'siembra_id' })
  id: number;

  // Relación uno a uno con Parcela
  @OneToOne(() => Parcela, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parcela_id_fk' })
  parcela: Parcela;

  @Column({ name: 'fecha_siembra', type: 'date', nullable: true })
  fechaSiembra?: Date | null;

  @Column({ name: 'semillas_por_metro', type: 'decimal', precision: 10, scale: 2, nullable: true })
  semillasPorMetro?: number | null;

  @Column({ name: 'densidad_siembra', type: 'decimal', precision: 10, scale: 2, nullable: true })
  densidadSiembra?: number | null;

  @Column({ name: 'germinacion_pct', type: 'decimal', precision: 5, scale: 2, nullable: true })
  germinacionPct?: number | null;

  @Column({ name: 'vigor_plantas_escala', type: 'int', nullable: true })
  vigorPlantasEscala?: number | null;

  @Column({ type: 'text', nullable: true })
  observaciones?: string | null;
}

