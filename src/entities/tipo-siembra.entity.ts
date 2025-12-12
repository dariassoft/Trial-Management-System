import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('TipoSiembra')
export class TipoSiembra {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  nombre: string;
}
