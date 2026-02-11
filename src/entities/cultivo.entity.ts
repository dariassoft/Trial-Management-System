import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CultivoVariedad } from './cultivo-variedad.entity';

@Entity('Cultivo')
export class Cultivo {
  @PrimaryGeneratedColumn({ name: 'cultivo_id' })
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  nombre: string;
  
  @Column({ type: 'text', nullable: true })
  descripcion: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ciclo_vegetativo: string | null;

  @Column({ type: 'boolean', default: true })
  esta_activo: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => CultivoVariedad, (variedad) => variedad.cultivo)
  variedades: CultivoVariedad[];
}
