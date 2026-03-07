import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, Unique } from 'typeorm';
import { Protocolo } from './protocolo.entity'; // Importar Protocolo
import { Parcela } from './parcela.entity';
import { TratamientoProducto } from './tratamiento-producto.entity';

@Entity('Tratamiento')
@Unique(['protocolo', 'numeroTrat']) // Restaurado
export class Tratamiento {
  @PrimaryGeneratedColumn({ name: 'tratamiento_id' })
  id: number;

  @ManyToOne(() => Protocolo, (protocolo) => protocolo.tratamientos, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'protocolo_id_fk' }) // Nueva FK
  protocolo: Protocolo;

  @Column({ name: 'numero_trat', type: 'int' })
  numeroTrat: number;


  @Column({ type: 'text', nullable: true })
  descripcion?: string | null;

  @Column({ name: 'es_testigo', type: 'boolean', default: false })
  esTestigo: boolean;

  @OneToMany(() => Parcela, (parcela) => parcela.tratamiento)
  parcelas: Parcela[];

  @OneToMany(() => TratamientoProducto, (tp) => tp.tratamiento)
  productos: TratamientoProducto[];
}
