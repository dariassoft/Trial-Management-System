import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index } from 'typeorm';
import { Ensayo } from './ensayo.entity';

@Entity('StatusEnsayo')
@Index('idx_status_nombre', ['nombre'], { unique: true })
export class StatusEnsayo {
  @PrimaryGeneratedColumn({ name: 'status_id' })
  id: number;

  @Column({ type: 'varchar', length: 50 })
  nombre: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcion?: string | null;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => Ensayo, (ensayo) => ensayo.status)
  ensayos: Ensayo[];
}

