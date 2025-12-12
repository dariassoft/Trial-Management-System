import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, Unique } from 'typeorm';
import { Aplicacion } from './aplicacion.entity';
import { DatosCampo } from './datos-campo.entity';

@Entity('Momento_Evaluacion')
@Unique(['aplicacion', 'nombreMomento'])
export class MomentoEvaluacion {
  @PrimaryGeneratedColumn({ name: 'momento_id' })
  id: number;

  @ManyToOne(() => Aplicacion, (aplicacion) => aplicacion.momentos, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'aplicacion_id_fk' })
  aplicacion: Aplicacion;

  @Column({ name: 'nombre_momento', type: 'varchar', length: 50 })
  nombreMomento: string;

  @Column({ name: 'dias_despues_aplicacion', type: 'int', nullable: true })
  diasDespuesAplicacion?: number | null;

  @Column({ name: 'fecha_evaluacion', type: 'date', nullable: true })
  fechaEvaluacion?: Date | null;

  @OneToMany(() => DatosCampo, (dc) => dc.momento)
  datosCampo: DatosCampo[];
}
