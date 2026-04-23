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

  // NUEVOS CAMPOS - Gramaje y composición de grano
  @Column({ name: 'gramaje_por_grano', type: 'decimal', precision: 8, scale: 6, nullable: true })
  gramajePorGrano?: number | null;

  @Column({ name: 'granos_porurf', type: 'decimal', precision: 10, scale: 1, nullable: true })
  granosPorurf?: number | null;

  @Column({ name: 'peso_granos_porurf', type: 'decimal', precision: 8, scale: 2, nullable: true })
  pesoGranosPorUrf?: number | null;

  @Column({ name: 'granos_danados', type: 'decimal', precision: 5, scale: 2, nullable: true })
  granosDanados?: number | null;

  @Column({ name: 'granos_verdes', type: 'decimal', precision: 5, scale: 2, nullable: true })
  granosVerdes?: number | null;

  @Column({ name: 'granos_vanos', type: 'decimal', precision: 5, scale: 2, nullable: true })
  granosVanos?: number | null;

  // NUEVOS CAMPOS - Mediciones de parcela (plagas, hojas, altura, etc)
  @Column({ name: 'hojas_porurf', type: 'decimal', precision: 10, scale: 1, nullable: true })
  hojasPorUrf?: number | null;

  @Column({ name: 'larvas_porurf', type: 'decimal', precision: 8, scale: 2, nullable: true })
  larvasPorUrf?: number | null;

  @Column({ name: 'insectos_beneficios_porurf', type: 'decimal', precision: 8, scale: 2, nullable: true })
  insectosBeneficiosPorUrf?: number | null;

  @Column({ name: 'diametro_espiga', type: 'decimal', precision: 5, scale: 2, nullable: true })
  diametroEspiga?: number | null;

  @Column({ name: 'altura_parcela', type: 'decimal', precision: 5, scale: 1, nullable: true })
  alturaParcela?: number | null;

  @Column({ name: 'densidad_plantas_final', type: 'decimal', precision: 6, scale: 2, nullable: true })
  densidadPlantasFinal?: number | null;

  // CAMPOS DE PESO Y HUMEDAD DE GRANO (para cálculo dinámico de kg/ha corregido)
  @Column({ name: 'peso_grano_cosechado', type: 'decimal', precision: 10, scale: 2, nullable: true })
  pesoGranoCosechado?: number | null;

  @Column({ name: 'humedad_grano_cosechado', type: 'decimal', precision: 5, scale: 2, nullable: true })
  humedadGranoCosechado?: number | null;

  @Column({ name: 'superficie_cosechada_m2', type: 'decimal', precision: 8, scale: 2, nullable: true })
  superficieCosechadaM2?: number | null;

  @Column({ type: 'text', nullable: true })
  observaciones?: string | null;
}
