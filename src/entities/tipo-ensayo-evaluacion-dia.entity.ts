import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TipoEnsayo } from './tipo-ensayo.entity';

@Entity('Tipo_Ensayo_EvaluacionDia')
export class TipoEnsayoEvaluacionDia {
  @PrimaryGeneratedColumn({ name: 'tipo_eval_dia_id' })
  id: number;

  @ManyToOne(() => TipoEnsayo, (tipo) => tipo.dias, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tipo_ensayo_id_fk' })
  tipoEnsayo: TipoEnsayo;

  @Column({ type: 'int' })
  dia: number;
}
