import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, Unique } from 'typeorm';
import { Ensayo } from './ensayo.entity';
import { Parcela } from './parcela.entity';

@Entity('Bloque')
@Unique(['ensayo', 'nombreBloque'])
export class Bloque {
  @PrimaryGeneratedColumn({ name: 'bloque_id' })
  id: number;

  @ManyToOne(() => Ensayo, (ensayo) => ensayo.bloques, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ensayo_id_fk' })
  ensayo: Ensayo;

  @Column({ name: 'nombre_bloque', type: 'varchar', length: 10 })
  nombreBloque: string;

  @OneToMany(() => Parcela, (parcela) => parcela.bloque)
  parcelas: Parcela[];
}
