import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNotificacionDto } from './dto/create-notificacion.dto';
import { UpdateNotificacionDto } from './dto/update-notificacion.dto';
import { Notificacion, TipoNotificacion } from './entities/notificacion.entity';
import { Usuario } from '../entities/usuario.entity';
import { Ensayo } from '../entities/ensayo.entity';

@Injectable()
export class NotificacionesService {
  private readonly logger = new Logger(NotificacionesService.name);

  constructor(
    @InjectRepository(Notificacion)
    private notificacionesRepository: Repository<Notificacion>,
    @InjectRepository(Ensayo)
    private ensayoRepository: Repository<Ensayo>,
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  // ──────────────────── CRUD ────────────────────

  async create(dto: CreateNotificacionDto): Promise<Notificacion> {
    const { usuarioId, ...rest } = dto;
    const entity = this.notificacionesRepository.create({
      ...rest,
      usuario: { id: usuarioId } as Usuario,
    });
    return this.notificacionesRepository.save(entity);
  }

  /**
   * Crea la notificación solo si no existe una igual para el mismo día.
   */
  async createIfNotExists(dto: CreateNotificacionDto): Promise<Notificacion | null> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existing = await this.notificacionesRepository
      .createQueryBuilder('n')
      .where('n.usuario_id = :userId', { userId: dto.usuarioId })
      .andWhere('n.titulo = :titulo', { titulo: dto.titulo })
      .andWhere('n.createdAt >= :today AND n.createdAt < :tomorrow', { today, tomorrow })
      .getOne();

    if (existing) return null;
    return this.create(dto);
  }

  findAll(usuarioId: number): Promise<Notificacion[]> {
    return this.notificacionesRepository.find({
      where: { usuario: { id: usuarioId } },
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: number, usuarioId: number): Promise<Notificacion | null> {
    return this.notificacionesRepository.findOne({
      where: { id, usuario: { id: usuarioId } },
    });
  }

  async update(id: number, dto: UpdateNotificacionDto, usuarioId: number): Promise<Notificacion | null> {
    const notificacion = await this.findOne(id, usuarioId);
    if (!notificacion) return null;
    await this.notificacionesRepository.update(id, dto);
    return this.findOne(id, usuarioId);
  }

  async remove(id: number, usuarioId: number): Promise<void> {
    const notificacion = await this.findOne(id, usuarioId);
    if (!notificacion) return;
    await this.notificacionesRepository.delete(id);
  }

  async countUnread(usuarioId: number): Promise<number> {
    return this.notificacionesRepository.count({
      where: { usuario: { id: usuarioId }, leido: false },
    });
  }

  async markAllAsRead(usuarioId: number): Promise<void> {
    await this.notificacionesRepository
      .createQueryBuilder()
      .update(Notificacion)
      .set({ leido: true })
      .where('usuario_id = :usuarioId AND leido = false', { usuarioId })
      .execute();
  }

  // ──────────────────── GENERACIÓN ────────────────────

  /**
   * Genera notificaciones para un usuario específico.
   * - Busca TODOS los ensayos (el usuario puede ser Admin/Manager supervisando).
   * - Crea notificaciones para el usuario que solicita.
   * - También crea notificaciones para el responsable del ensayo (si es distinto).
   */
  async generateForUser(userId: number): Promise<void> {
    const ensayos = await this.ensayoRepository.find({
      relations: [
        'responsable',
        'aplicaciones',
        'aplicaciones.momentos',
        'parcelas',
        'parcelas.siembra',
        'parcelas.cosecha',
      ],
    });

    this.logger.log(`Generando notificaciones para usuario ${userId}, evaluando ${ensayos.length} ensayo(s)`);

    const hoy = new Date();
    const esLunes = hoy.getDay() === 1;

    for (const ensayo of ensayos) {
      // Determinar a quién notificar: al usuario solicitante y al responsable (sin duplicar)
      const destinatarios = new Set<number>();
      destinatarios.add(userId);
      if (ensayo.responsable?.id && ensayo.responsable.id !== userId) {
        destinatarios.add(ensayo.responsable.id);
      }

      for (const destUserId of destinatarios) {
        await this.checkFechasClave(ensayo, destUserId, hoy);
        await this.checkMomentosEvaluacion(ensayo, destUserId, hoy);
        await this.checkInfoIncompleta(ensayo, destUserId);
        if (esLunes) {
          await this.generarResumenSemanal(ensayo, destUserId, hoy);
        }
      }
    }
  }

  /**
   * Genera notificaciones para TODOS los ensayos, notificando a cada responsable.
   * Se ejecuta desde el cron job diario.
   */
  async generateForAllUsers(): Promise<void> {
    const ensayos = await this.ensayoRepository.find({
      relations: [
        'responsable',
        'aplicaciones',
        'aplicaciones.momentos',
        'parcelas',
        'parcelas.siembra',
        'parcelas.cosecha',
      ],
    });

    this.logger.log(`Cron: evaluando ${ensayos.length} ensayo(s) para generar notificaciones`);

    const hoy = new Date();
    const esLunes = hoy.getDay() === 1;

    for (const ensayo of ensayos) {
      if (!ensayo.responsable?.id) continue;
      const userId = ensayo.responsable.id;

      await this.checkFechasClave(ensayo, userId, hoy);
      await this.checkMomentosEvaluacion(ensayo, userId, hoy);
      await this.checkInfoIncompleta(ensayo, userId);
      if (esLunes) {
        await this.generarResumenSemanal(ensayo, userId, hoy);
      }
    }
  }

  // ──────────────────── Helpers privados ────────────────────

  private async checkFechasClave(ensayo: Ensayo, userId: number, hoy: Date): Promise<void> {
    const hoyStr = this.toDateStr(hoy);

    if (ensayo.fechaSiembra) {
      const str = this.toDateStr(new Date(ensayo.fechaSiembra));
      if (hoyStr === str) {
        await this.createIfNotExists({
          usuarioId: userId,
          titulo: `Siembra - Ensayo #${ensayo.id}: ${ensayo.nombreEnsayo}`,
          descripcion: `Hoy ${str} es la fecha programada para la siembra del ensayo "${ensayo.nombreEnsayo}".`,
          link: `/siembra?ensayoId=${ensayo.id}`,
          tipo: TipoNotificacion.SIEMBRA,
          ensayoId: ensayo.id,
        });
      }
    }

    if (ensayo.fechaCosecha) {
      const str = this.toDateStr(new Date(ensayo.fechaCosecha));
      if (hoyStr === str) {
        await this.createIfNotExists({
          usuarioId: userId,
          titulo: `Cosecha - Ensayo #${ensayo.id}: ${ensayo.nombreEnsayo}`,
          descripcion: `Hoy ${str} es la fecha programada para la cosecha del ensayo "${ensayo.nombreEnsayo}".`,
          link: `/cosecha?ensayoId=${ensayo.id}`,
          tipo: TipoNotificacion.COSECHA,
          ensayoId: ensayo.id,
        });
      }
    }

    if (ensayo.fechaInicio) {
      const str = this.toDateStr(new Date(ensayo.fechaInicio));
      if (hoyStr === str) {
        await this.createIfNotExists({
          usuarioId: userId,
          titulo: `Inicio - Ensayo #${ensayo.id}: ${ensayo.nombreEnsayo}`,
          descripcion: `Hoy ${str} es la fecha de inicio del ensayo "${ensayo.nombreEnsayo}".`,
          link: `/ensayos/${ensayo.id}`,
          tipo: TipoNotificacion.GENERAL,
          ensayoId: ensayo.id,
        });
      }
    }
  }

  private async checkMomentosEvaluacion(ensayo: Ensayo, userId: number, hoy: Date): Promise<void> {
    if (!ensayo.aplicaciones) return;
    const hoyStr = this.toDateStr(hoy);

    for (const aplicacion of ensayo.aplicaciones) {
      if (!aplicacion.momentos) continue;

      for (const momento of aplicacion.momentos) {
        let fechaEvalStr: string | null = null;

        if (momento.fechaEvaluacion) {
          fechaEvalStr = this.toDateStr(new Date(momento.fechaEvaluacion));
        } else if (momento.diasDespuesAplicacion != null && aplicacion.fechaHora) {
          const fechaApp = new Date(aplicacion.fechaHora);
          fechaApp.setDate(fechaApp.getDate() + momento.diasDespuesAplicacion);
          fechaEvalStr = this.toDateStr(fechaApp);
        }

        if (fechaEvalStr && hoyStr === fechaEvalStr) {
          const ddaLabel = momento.diasDespuesAplicacion != null
            ? ` (DDA ${momento.diasDespuesAplicacion})`
            : '';
          await this.createIfNotExists({
            usuarioId: userId,
            titulo: `Medición${ddaLabel} - Ensayo #${ensayo.id}: ${ensayo.nombreEnsayo}`,
            descripcion: `Hoy corresponde tomar mediciones "${momento.nombreMomento}" (${aplicacion.nombreAplicacion})${ddaLabel} en el ensayo "${ensayo.nombreEnsayo}".`,
            link: `/mediciones?ensayoId=${ensayo.id}`,
            tipo: TipoNotificacion.MEDICION,
            ensayoId: ensayo.id,
          });
        }
      }
    }
  }

  private async checkInfoIncompleta(ensayo: Ensayo, userId: number): Promise<void> {
    const pendientes: string[] = [];

    if (!ensayo.fechaSiembra) pendientes.push('fecha de siembra');
    if (!ensayo.fechaCosecha) pendientes.push('fecha de cosecha');
    if (!ensayo.fechaInicio) pendientes.push('fecha de inicio');

    if (ensayo.parcelas && ensayo.parcelas.length > 0) {
      const sinSiembra = ensayo.parcelas.filter(p => !p.siembra).length;
      if (sinSiembra > 0) {
        pendientes.push(`datos de siembra en ${sinSiembra} parcela(s)`);
      }
      if (ensayo.fechaCosecha && new Date(ensayo.fechaCosecha) <= new Date()) {
        const sinCosecha = ensayo.parcelas.filter(p => !p.cosecha).length;
        if (sinCosecha > 0) {
          pendientes.push(`datos de cosecha en ${sinCosecha} parcela(s)`);
        }
      }
    }

    if (pendientes.length > 0) {
      await this.createIfNotExists({
        usuarioId: userId,
        titulo: `Info incompleta - Ensayo #${ensayo.id}: ${ensayo.nombreEnsayo}`,
        descripcion: `El ensayo "${ensayo.nombreEnsayo}" tiene información pendiente: ${pendientes.join(', ')}.`,
        link: `/ensayos/${ensayo.id}`,
        tipo: TipoNotificacion.INFO_INCOMPLETA,
        ensayoId: ensayo.id,
      });
    }
  }

  private async generarResumenSemanal(ensayo: Ensayo, userId: number, hoy: Date): Promise<void> {
    const tareas: string[] = [];
    const inicio = new Date(hoy);
    inicio.setHours(0, 0, 0, 0);
    const fin = new Date(inicio);
    fin.setDate(inicio.getDate() + 6);

    if (ensayo.fechaSiembra) {
      const d = new Date(ensayo.fechaSiembra);
      if (d >= inicio && d <= fin) tareas.push(`Siembra programada para ${this.toDateStr(d)}`);
    }
    if (ensayo.fechaCosecha) {
      const d = new Date(ensayo.fechaCosecha);
      if (d >= inicio && d <= fin) tareas.push(`Cosecha programada para ${this.toDateStr(d)}`);
    }

    if (ensayo.aplicaciones) {
      for (const app of ensayo.aplicaciones) {
        if (!app.momentos) continue;
        for (const m of app.momentos) {
          let fechaEval: Date | null = null;
          if (m.fechaEvaluacion) {
            fechaEval = new Date(m.fechaEvaluacion);
          } else if (m.diasDespuesAplicacion != null && app.fechaHora) {
            fechaEval = new Date(app.fechaHora);
            fechaEval.setDate(fechaEval.getDate() + m.diasDespuesAplicacion);
          }
          if (fechaEval && fechaEval >= inicio && fechaEval <= fin) {
            tareas.push(`Medición "${m.nombreMomento}" el ${this.toDateStr(fechaEval)}`);
          }
        }
      }
    }

    if (tareas.length > 0) {
      await this.createIfNotExists({
        usuarioId: userId,
        titulo: `Resumen semanal - Ensayo #${ensayo.id}: ${ensayo.nombreEnsayo}`,
        descripcion: `Tareas de la semana para "${ensayo.nombreEnsayo}": ${tareas.join('; ')}.`,
        link: `/ensayos/${ensayo.id}`,
        tipo: TipoNotificacion.RESUMEN_SEMANAL,
        ensayoId: ensayo.id,
      });
    }
  }

  private toDateStr(d: Date): string {
    return d.toISOString().split('T')[0];
  }
}
