import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Aplicacion } from './aplicacion.entity';
import { Bloque } from './bloque.entity';
import { Parcela } from './parcela.entity';
import { Laboratorio } from './laboratorio.entity';
import { TipoEnsayo } from './tipo-ensayo.entity';
import { Protocolo } from './protocolo.entity';
import { Usuario } from './usuario.entity';
import { Cultivo } from './cultivo.entity';
import { CultivoVariedad } from './cultivo-variedad.entity';
import { TipoSiembra } from './tipo-siembra.entity';
import { StatusEnsayo } from './status-ensayo.entity';

@Entity('Ensayo')
@Unique(['nombreEnsayo', 'protocolo'])
@Index('uq_ensayo_lab_codigo', ['laboratorio', 'codigoLabor'], { unique: true })
export class Ensayo {
  @PrimaryGeneratedColumn({ name: 'ensayo_id' })
  id: number;

  @ManyToOne(() => Laboratorio, { nullable: true })
  @JoinColumn({ name: 'lab_id_fk' })
  laboratorio?: Laboratorio | null;

  @Column({ name: 'codigo_labor', type: 'varchar', length: 50, nullable: true })
  codigoLabor?: string | null;

  @Column({ name: 'nombre_ensayo', type: 'varchar', length: 255 })
  nombreEnsayo: string;

  @ManyToOne(() => Protocolo, (protocolo) => protocolo.ensayos, { nullable: true })
  @JoinColumn({ name: 'protocolo_id_fk' })
  protocolo?: Protocolo | null;

  @ManyToOne(() => TipoEnsayo, { nullable: true })
  @JoinColumn({ name: 'tipo_ensayo_id_fk' })
  tipoEnsayo?: TipoEnsayo | null;

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'responsable_id' })
  responsable?: Usuario | null;

  // Ubicación
  @Column({ type: 'varchar', length: 100, nullable: true })
  provincia?: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  departamento?: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  establecimiento?: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  lote?: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitud?: number | null;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitud?: number | null;

  // --- Cultivo Fields Updated ---
  @ManyToOne(() => Cultivo, { nullable: true })
  @JoinColumn({ name: 'cultivo_id' })
  cultivo?: Cultivo | null;

  @ManyToOne(() => CultivoVariedad, { nullable: true })
  @JoinColumn({ name: 'variedad_id' })
  variedad?: CultivoVariedad | null;

  @ManyToOne(() => TipoSiembra, { nullable: true })
  @JoinColumn({ name: 'tipo_siembra_id' })
  tipoSiembra?: TipoSiembra | null;

  @Column({ name: 'dist_surcos_cm', type: 'decimal', precision: 5, scale: 2, nullable: true })
  distSurcosCm?: number | null;

  // --- Date Fields Updated ---
  @Column({ name: 'fecha_inicio', type: 'date', nullable: true })
  fechaInicio?: Date | null;

  @Column({ name: 'fecha_siembra', type: 'date', nullable: true })
  fechaSiembra?: Date | null;

  @Column({ name: 'fecha_cosecha', type: 'date', nullable: true })
  fechaCosecha?: Date | null;

  // Status - Relación con tabla StatusEnsayo
  @ManyToOne(() => StatusEnsayo, (status) => status.ensayos, { nullable: true, eager: true })
  @JoinColumn({ name: 'status_id_fk' })
  status?: StatusEnsayo | null;

  // Relaciones
  @OneToMany(() => Aplicacion, (aplicacion) => aplicacion.ensayo)
  aplicaciones: Aplicacion[];

  @OneToMany(() => Bloque, (bloque) => bloque.ensayo)
  bloques: Bloque[];

  @OneToMany(() => Parcela, (parcela) => parcela.ensayo)
  parcelas: Parcela[];
}
