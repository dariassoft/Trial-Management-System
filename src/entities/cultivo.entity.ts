import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CultivoVariedad } from './cultivo-variedad.entity';

@Entity('Cultivo')
export class Cultivo {
  @PrimaryGeneratedColumn({ name: 'cultivo_id' })
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  nombre: string;
  
  @OneToMany(() => CultivoVariedad, (variedad) => variedad.cultivo)
  variedades: CultivoVariedad[];
}
