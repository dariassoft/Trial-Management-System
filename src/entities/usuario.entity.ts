import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';
import { Rol } from './rol.entity';
import * as bcrypt from 'bcrypt';
import { UsuarioLaboratorio } from './usuario-laboratorio.entity';

@Entity('Usuario')
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'usuario_id' })
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  username: string; // email

  @Column({ type: 'varchar', length: 255, name: 'password_hash' })
  password: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nombre: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  apellido: string | null;

  @Column({ type: 'varchar', length: 50 })
  telefono: string;

  @Column({ type: 'date', nullable: true })
  fecha_nacimiento: Date | null;

  @Column({ type: 'boolean', default: true })
  esta_activo: boolean;

  @ManyToOne(() => Rol, (rol) => rol.usuarios)
  @JoinColumn({ name: 'rol_id_fk' })
  rol: Rol;

  @OneToMany(() => UsuarioLaboratorio, (ul) => ul.usuario)
  laboratoriosAsignados: UsuarioLaboratorio[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2')) {
      const saltRounds = 10;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
  }

  async validatePassword(plainPass: string): Promise<boolean> {
    return bcrypt.compare(plainPass, this.password);
  }
}
