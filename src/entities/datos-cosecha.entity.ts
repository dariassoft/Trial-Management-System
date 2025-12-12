import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Parcela } from './parcela.entity';

@Entity('Datos_Cosecha')
export class DatosCosecha {
  @PrimaryGeneratedColumn({ name: 'cosecha_id' })
  id: number;

  // Relación uno a uno con Parcela (este lado es el dueño de la relación)
  @OneToOne(() => Parcela, (parcela) => parcela.cosecha, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parcela_id_fk' })
  parcela: Parcela;

  @Column({ name: 'fecha_cosecha', type: 'date', nullable: true })
  fechaCosecha?: Date | null;

  @Column({ name: 'humedad_pct', type: 'decimal', precision: 5, scale: 2, nullable: true })
  humedadPct?: number | null;

  @Column({ name: 'kg_ha_corregido', type: 'decimal', precision: 10, scale: 2, nullable: true })
  kgHaCorregido?: number | null;

  @Column({ name: 'gie', type: 'decimal', precision: 10, scale: 2, nullable: true })
  gie?: number | null;

  @Column({ type: 'text', nullable: true })
  observaciones?: string | null;
}
