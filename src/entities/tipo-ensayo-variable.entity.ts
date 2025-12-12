import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TipoEnsayo } from './tipo-ensayo.entity';
import { ProtocoloVariable } from './protocolo-variable.entity';

@Entity('Tipo_Ensayo_Variable')
export class TipoEnsayoVariable {
  @PrimaryGeneratedColumn({ name: 'tipo_ensayo_variable_id' })
  id: number;

  @ManyToOne(() => TipoEnsayo, (tipo) => tipo.variables, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tipo_ensayo_id_fk' })
  tipoEnsayo: TipoEnsayo;

  @ManyToOne(() => ProtocoloVariable, (pv) => pv.mediciones)
  @JoinColumn({ name: 'variable_id_fk' })
  variable: ProtocoloVariable;

  @Column({ type: 'int', nullable: true })
  orden?: number | null;

  @Column({ type: 'boolean', default: false })
  requerido: boolean;

  @Column({ name: 'unidad_override', type: 'varchar', length: 30, nullable: true })
  unidadOverride?: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  escala?: string | null;

  @Column({ name: 'rango_min', type: 'decimal', precision: 10, scale: 2, nullable: true })
  rangoMin?: string | null;

  @Column({ name: 'rango_max', type: 'decimal', precision: 10, scale: 2, nullable: true })
  rangoMax?: string | null;
}
