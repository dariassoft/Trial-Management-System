import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique } from 'typeorm';
import { Tratamiento } from './tratamiento.entity';
import { Ensayo } from './ensayo.entity'; // Asegúrate de que esta línea exista

@Entity('Protocolo')
@Unique(['nombre'])
export class Protocolo {
  @PrimaryGeneratedColumn({ name: 'protocolo_id' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string | null;

  @OneToMany(() => Tratamiento, (tratamiento) => tratamiento.protocolo)
  tratamientos: Tratamiento[];

  @OneToMany(() => Ensayo, (ensayo) => ensayo.protocolo) // Asegúrate de que esta relación exista
  ensayos: Ensayo[];
}
        