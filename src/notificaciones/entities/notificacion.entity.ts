import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../../entities/usuario.entity';

export enum TipoNotificacion {
  SIEMBRA = 'siembra',
  COSECHA = 'cosecha',
  MEDICION = 'medicion',
  INFO_INCOMPLETA = 'info_incompleta',
  RESUMEN_SEMANAL = 'resumen_semanal',
  GENERAL = 'general',
}

@Entity('notificaciones')
export class Notificacion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ type: 'varchar', length: 255 })
  titulo: string;

  @Column('text')
  descripcion: string;

  @Column({ default: false })
  leido: boolean;

  @Column({ type: 'varchar', length: 50, default: TipoNotificacion.GENERAL })
  tipo: string;

  @Column({ name: 'ensayo_id', type: 'int', nullable: true })
  ensayoId: number | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  link: string;
}
