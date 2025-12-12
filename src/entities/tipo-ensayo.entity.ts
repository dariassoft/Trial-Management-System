import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TipoEnsayoVariable } from './tipo-ensayo-variable.entity';
import { TipoEnsayoEvaluacionDia } from './tipo-ensayo-evaluacion-dia.entity';

@Entity('Tipo_Ensayo')
export class TipoEnsayo {
  @PrimaryGeneratedColumn({ name: 'tipo_ensayo_id' })
  id: number;

  @Column({ type: 'varchar', length: 120, unique: true })
  nombre: string;

  @Column({ name: 'evaluacion_csv', type: 'varchar', length: 255, nullable: true })
  evaluacionCsv?: string | null;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => TipoEnsayoVariable, (tev) => tev.tipoEnsayo)
  variables: TipoEnsayoVariable[];

  @OneToMany(() => TipoEnsayoEvaluacionDia, (dia) => dia.tipoEnsayo)
  dias: TipoEnsayoEvaluacionDia[];
}
