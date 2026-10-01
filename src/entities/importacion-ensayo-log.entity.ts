import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Ensayo } from './ensayo.entity';
import { Usuario } from './usuario.entity';

@Entity('importaciones_ensayo_log')
export class ImportacionEnsayoLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Ensayo, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ensayo_id' })
  ensayo: Ensayo;

  @ManyToOne(() => Usuario, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ type: 'int', default: 0 })
  hojasModificadas: number;

  @Column({ type: 'text' })
  resumen: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}