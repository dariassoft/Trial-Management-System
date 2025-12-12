import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, Unique } from 'typeorm';
import { Parcela } from './parcela.entity';
import { MomentoEvaluacion } from './momento-evaluacion.entity';
import { DatosCampoMedicion } from './datos-campo-medicion.entity';
import { FotoRegistro } from './foto-registro.entity';

@Entity('Datos_Campo')
@Unique(['parcela', 'momento'])
export class DatosCampo {
  @PrimaryGeneratedColumn({ name: 'dato_campo_id' })
  id: number;

  @ManyToOne(() => Parcela, (parcela) => parcela.datosCampo, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parcela_id_fk' })
  parcela: Parcela;

  @ManyToOne(() => MomentoEvaluacion, (momento) => momento.datosCampo, { nullable: false })
  @JoinColumn({ name: 'momento_id_fk' })
  momento: MomentoEvaluacion;

  @Column({ type: 'text', nullable: true })
  observaciones?: string | null;

  @OneToMany(() => DatosCampoMedicion, (medicion) => medicion.visita, { cascade: true })
  mediciones: DatosCampoMedicion[];

  // Relación: una visita puede tener muchas fotos
  @OneToMany(() => FotoRegistro, (foto) => foto.visita)
  fotos: FotoRegistro[];
}
