import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Ensayo } from './ensayo.entity';
import { MomentoEvaluacion } from './momento-evaluacion.entity';

@Entity('Aplicacion')
export class Aplicacion {
  @PrimaryGeneratedColumn({ name: 'aplicacion_id' })
  id: number;

  @ManyToOne(() => Ensayo, (ensayo) => ensayo.aplicaciones, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ensayo_id_fk' })
  ensayo: Ensayo;

  @Column({ name: 'nombre_aplicacion', type: 'varchar', length: 100, default: 'Primera aplicación' })
  nombreAplicacion: string;

  @Column({ name: 'fecha_hora', type: 'datetime', nullable: true })
  fechaHora?: Date | null;

  @Column({ name: 'estadio_cultivo', type: 'varchar', length: 50, nullable: true })
  estadioCultivo?: string | null;

  // Condiciones
  @Column({ name: 'temp_c', type: 'decimal', precision: 4, scale: 1, nullable: true })
  tempC?: number | null;

  @Column({ name: 'humedad_pct', type: 'decimal', precision: 4, scale: 1, nullable: true })
  humedadPct?: number | null;

  @Column({ name: 'viento_kmh', type: 'decimal', precision: 4, scale: 1, nullable: true })
  vientoKmh?: number | null;

  // Equipo
  @Column({ name: 'equipo_info', type: 'varchar', length: 255, nullable: true })
  equipoInfo?: string | null;

  @Column({ name: 'pico_info', type: 'varchar', length: 100, nullable: true })
  picoInfo?: string | null;

  @Column({ name: 'presion_bar', type: 'decimal', precision: 4, scale: 2, nullable: true })
  presionBar?: number | null;

  // Relación: Una Aplicacion tiene muchos momentos de evaluación
  @OneToMany(() => MomentoEvaluacion, (momento) => momento.aplicacion)
  momentos: MomentoEvaluacion[];
}
