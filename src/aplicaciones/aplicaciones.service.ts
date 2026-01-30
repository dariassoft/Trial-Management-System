import { Injectable, NotFoundException, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { Role } from '../entities/rol.entity';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Aplicacion } from '../entities/aplicacion.entity';
import { CreateAplicacionDto } from './dto/create-aplicacion.dto';
import { UpdateAplicacionDto } from './dto/update-aplicacion.dto';
import { Ensayo } from '../entities/ensayo.entity';
import { TipoEnsayoEvaluacionDia } from '../entities/tipo-ensayo-evaluacion-dia.entity';
import { MomentoEvaluacion } from '../entities/momento-evaluacion.entity';

@Injectable({ scope: Scope.REQUEST })
export class AplicacionesService {
  constructor(
    @Inject(REQUEST) private readonly req: Request,
    @InjectRepository(Aplicacion)
    private readonly repo: Repository<Aplicacion>,
    @InjectRepository(Ensayo)
    private readonly ensayoRepo: Repository<Ensayo>,
    @InjectRepository(TipoEnsayoEvaluacionDia)
    private readonly diasRepo: Repository<TipoEnsayoEvaluacionDia>,
    @InjectRepository(MomentoEvaluacion)
    private readonly momentoRepo: Repository<MomentoEvaluacion>,
    private readonly dataSource: DataSource,
  ) {}

  private get auth() {
    const user = (this.req as any)?.user as JwtPayload | undefined;
    const isInvitado = user?.rol === Role.INVITADO;
    const labIds = (user?.lab_ids || []) as number[];
    return { isInvitado, labIds };
  }

  /**
   * Crear aplicación y generar momentos de evaluación automáticamente
   * según los días configurados en el tipo de ensayo
   */
  async create(dto: CreateAplicacionDto) {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      // Crear la aplicación
      const entity = this.repo.create({
        ensayo: { id: dto.ensayoId } as any,
        nombreAplicacion: dto.nombreAplicacion || 'Primera aplicación',
        fechaHora: dto.fechaHora ? new Date(dto.fechaHora) : undefined,
        estadioCultivo: dto.estadioCultivo,
        tempC: dto.tempC,
        humedadPct: dto.humedadPct,
        vientoKmh: dto.vientoKmh,
        equipoInfo: dto.equipoInfo,
        picoInfo: dto.picoInfo,
        presionBar: dto.presionBar,
      });
      const aplicacionGuardada = await qr.manager.save(entity);

      // Obtener el ensayo con su tipo de ensayo
      const ensayo = await this.ensayoRepo.findOne({
        where: { id: dto.ensayoId },
        relations: ['tipoEnsayo'],
      });

      if (ensayo?.tipoEnsayo?.id) {
        // Obtener los días de evaluación configurados para este tipo de ensayo
        const diasEvaluacion = await this.diasRepo.find({
          where: { tipoEnsayo: { id: ensayo.tipoEnsayo.id } },
          order: { dia: 'ASC' },
        });

        // Crear momentos de evaluación para cada día
        const fechaAplicacion = dto.fechaHora ? new Date(dto.fechaHora) : new Date();

        for (const diaConfig of diasEvaluacion) {
          const fechaEvaluacion = new Date(fechaAplicacion);
          fechaEvaluacion.setDate(fechaEvaluacion.getDate() + diaConfig.dia);

          const momento = this.momentoRepo.create({
            aplicacion: aplicacionGuardada,
            nombreMomento: `${diaConfig.dia} DDA`,
            diasDespuesAplicacion: diaConfig.dia,
            fechaEvaluacion: fechaEvaluacion,
          });
          await qr.manager.save(momento);
        }
      }

      await qr.commitTransaction();
      return this.findOne(aplicacionGuardada.id);
    } catch (e) {
      await qr.rollbackTransaction();
      throw e;
    } finally {
      await qr.release();
    }
  }

  async findAll(query?: { ensayoId?: number; page?: number; limit?: number }) {
    const { isInvitado, labIds } = this.auth;

    const qb = this.repo.createQueryBuilder('a')
      .leftJoinAndSelect('a.ensayo', 'e')
      .leftJoinAndSelect('a.momentos', 'm')
      .orderBy('a.fechaHora', 'DESC');

    if (query?.ensayoId) {
      qb.andWhere('e.id = :ensayoId', { ensayoId: query.ensayoId });
    }

    if (isInvitado) {
      qb.leftJoin('e.tratamientos', 't')
        .leftJoin('t.productos', 'tp')
        .leftJoin('tp.producto', 'p')
        .leftJoin('p.laboratorio', 'l')
        .andWhere('l.id IN (:...labIds)', { labIds })
        .distinct(true);
    }

    return qb.getMany();
  }

  async findOne(id: number) {
    const { isInvitado, labIds } = this.auth;

    const qb = this.repo.createQueryBuilder('a')
      .leftJoinAndSelect('a.ensayo', 'e')
      .leftJoinAndSelect('e.tipoEnsayo', 'te')
      .leftJoinAndSelect('a.momentos', 'm')
      .where('a.id = :id', { id })
      .orderBy('m.diasDespuesAplicacion', 'ASC');

    if (isInvitado) {
      qb.leftJoin('e.tratamientos', 't')
        .leftJoin('t.productos', 'tp')
        .leftJoin('tp.producto', 'p')
        .leftJoin('p.laboratorio', 'l')
        .andWhere('l.id IN (:...labIds)', { labIds })
        .distinct(true);
    }

    const entity = await qb.getOne();
    if (!entity) throw new NotFoundException(`Aplicacion ${id} no encontrada`);
    return entity;
  }

  async update(id: number, dto: UpdateAplicacionDto) {
    // Solo incluir campos que tienen valor definido
    const partial: Partial<Aplicacion> = {};

    if (dto.nombreAplicacion !== undefined) {
      partial.nombreAplicacion = dto.nombreAplicacion;
    }
    if (dto.fechaHora !== undefined) {
      partial.fechaHora = dto.fechaHora ? new Date(dto.fechaHora) : null;
    }
    if (dto.estadioCultivo !== undefined) {
      partial.estadioCultivo = dto.estadioCultivo;
    }
    if (dto.tempC !== undefined) {
      partial.tempC = dto.tempC;
    }
    if (dto.humedadPct !== undefined) {
      partial.humedadPct = dto.humedadPct;
    }
    if (dto.vientoKmh !== undefined) {
      partial.vientoKmh = dto.vientoKmh;
    }
    if (dto.equipoInfo !== undefined) {
      partial.equipoInfo = dto.equipoInfo;
    }
    if (dto.picoInfo !== undefined) {
      partial.picoInfo = dto.picoInfo;
    }
    if (dto.presionBar !== undefined) {
      partial.presionBar = dto.presionBar;
    }
    if (dto.ensayoId !== undefined) {
      (partial as any).ensayo = { id: dto.ensayoId };
    }

    if (Object.keys(partial).length > 0) {
      await this.repo.update({ id }, partial);
    }
    return this.findOne(id);
  }

  async remove(id: number) {
    const result = await this.repo.delete({ id });
    if (!result.affected) throw new NotFoundException(`Aplicacion ${id} no encontrada`);
    return { deleted: true };
  }
}
