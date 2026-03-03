import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne, JoinColumn, Unique, Index } from 'typeorm';
import { Ensayo } from './ensayo.entity';
import { Bloque } from './bloque.entity';
import { Tratamiento } from './tratamiento.entity';
import { DatosCampo } from './datos-campo.entity';
import { DatosCosecha } from './datos-cosecha.entity';
import { DatosSiembra } from './datos-siembra.entity';

@Entity('Parcela')
// Eliminado: @Unique(['bloque', 'tratamiento']) - Un tratamiento puede repetirse en diferentes parcelas del mismo bloque
@Unique('uq_parcela_ensayo_nombre', ['ensayo', 'nombreParcela'])
@Index('idx_parcela_nombre', ['nombreParcela'])
export class Parcela {
  @PrimaryGeneratedColumn({ name: 'parcela_id' })
  id: number;

  @ManyToOne(() => Ensayo, (ensayo) => ensayo.parcelas, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ensayo_id_fk' })
  ensayo: Ensayo;

  @ManyToOne(() => Bloque, (bloque) => bloque.parcelas, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bloque_id_fk' })
  bloque: Bloque;

  @ManyToOne(() => Tratamiento, (tratamiento) => tratamiento.parcelas, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tratamiento_id_fk' })
  tratamiento: Tratamiento;

  @Column({ name: 'nombre_parcela', type: 'varchar', length: 50, nullable: true })
  nombreParcela?: string | null;

  @Column({ name: 'pos_x_grid', type: 'int', nullable: true })
  posXGrid?: number | null;

  @Column({ name: 'pos_y_grid', type: 'int', nullable: true })
  posYGrid?: number | null;

  // Relación con datos de campo
  @OneToMany(() => DatosCampo, (dc) => dc.parcela)
  datosCampo: DatosCampo[];

  // Relación uno a uno con siembra (lado inverso; el dueño es DatosSiembra)
  @OneToOne(() => DatosSiembra, (siembra) => siembra.parcela)
  siembra?: DatosSiembra | null;

  // Relación uno a uno con cosecha (lado inverso; el dueño es DatosCosecha)
  @OneToOne(() => DatosCosecha, (cosecha) => cosecha.parcela)
  cosecha?: DatosCosecha | null;
}
