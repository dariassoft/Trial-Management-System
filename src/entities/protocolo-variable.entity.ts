import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { DatosCampoMedicion } from './datos-campo-medicion.entity';
import { TipoEnsayo } from './tipo-ensayo.entity';

@Entity('Protocolo_Variable')
export class ProtocoloVariable {
  @PrimaryGeneratedColumn({ name: 'variable_id' })
  id: number;

  @ManyToOne(() => TipoEnsayo, { nullable: false })
  @JoinColumn({ name: 'tipo_ensayo_id_fk' })
  tipoEnsayo: TipoEnsayo;

  @Column({ type: 'varchar', length: 100, unique: true })
  nombre_variable: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  unidad_medida: string | null;

  @Column({ type: 'text', nullable: true })
  descripcion: string | null;

  @OneToMany(() => DatosCampoMedicion, (medicion) => medicion.variable)
  mediciones: DatosCampoMedicion[];
}
