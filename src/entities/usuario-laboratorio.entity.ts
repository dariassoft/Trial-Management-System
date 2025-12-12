import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Laboratorio } from './laboratorio.entity';

@Entity('Usuario_Laboratorio')
@Unique(['usuario', 'laboratorio'])
export class UsuarioLaboratorio {
  @PrimaryGeneratedColumn({ name: 'usuario_lab_id' })
  id: number;

  @ManyToOne(() => Usuario, (u) => u.laboratoriosAsignados, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id_fk' })
  usuario: Usuario;

  @ManyToOne(() => Laboratorio, (l) => l.usuariosAsignados, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lab_id_fk' })
  laboratorio: Laboratorio;
}
