import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { DatosCampo } from './datos-campo.entity';
import { ProtocoloVariable } from './protocolo-variable.entity';

@Entity('Datos_Campo_Medicion')
export class DatosCampoMedicion {
  @PrimaryGeneratedColumn({ name: 'medicion_id' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  valor: string;

  @ManyToOne(() => DatosCampo, (visita) => visita.mediciones, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dato_campo_id_fk' })
  visita: DatosCampo;

  @ManyToOne(() => ProtocoloVariable, (variable) => variable.mediciones)
  @JoinColumn({ name: 'variable_id_fk' })
  variable: ProtocoloVariable;
}
