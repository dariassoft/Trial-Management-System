import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { DatosCampo } from './datos-campo.entity';

@Entity('Foto_Registro')
export class FotoRegistro {
  @PrimaryGeneratedColumn({ name: 'foto_id' })
  id: number;

  @ManyToOne(() => DatosCampo, (visita) => visita.fotos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dato_campo_id_fk' })
  visita: DatosCampo;

  @Column({ type: 'varchar', length: 255 })
  file_name: string;

  @Column({ type: 'varchar', length: 500 })
  file_path: string; // Ruta relativa accesible por HTTP (ServeStatic)

  @Column({ type: 'varchar', length: 100, nullable: true })
  mime_type: string | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_subida: Date;
}
