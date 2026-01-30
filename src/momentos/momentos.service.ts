import { Injectable, NotFoundException, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { Role } from '../entities/rol.entity';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MomentoEvaluacion } from '../entities/momento-evaluacion.entity';
import { CreateMomentoDto } from './dto/create-momento.dto';
import { UpdateMomentoDto } from './dto/update-momento.dto';
import { DatosCampo } from '../entities/datos-campo.entity';
import { Parcela } from '../entities/parcela.entity';

@Injectable({ scope: Scope.REQUEST })
export class MomentosService {
  constructor(
    @Inject(REQUEST) private readonly req: Request,
    @InjectRepository(MomentoEvaluacion)
    private readonly repo: Repository<MomentoEvaluacion>,
    @InjectRepository(DatosCampo)
    private readonly datosCampoRepo: Repository<DatosCampo>,
    @InjectRepository(Parcela)
    private readonly parcelaRepo: Repository<Parcela>,
  ) {}

  private get auth() {
    const user = (this.req as any)?.user as JwtPayload | undefined;
    const isInvitado = user?.rol === Role.INVITADO;
    const labIds = (user?.lab_ids || []) as number[];
    return { isInvitado, labIds };
  }

  create(dto: CreateMomentoDto) {
    const entity = this.repo.create({
      aplicacion: { id: dto.aplicacionId } as any,
      nombreMomento: dto.nombreMomento,
      diasDespuesAplicacion: dto.diasDespuesAplicacion,
      fechaEvaluacion: dto.fechaEvaluacion ? new Date(dto.fechaEvaluacion) : undefined,
    });
    return this.repo.save(entity);
  }

  async findAll(query?: { aplicacionId?: number }) {
    const { isInvitado, labIds } = this.auth;

    const qb = this.repo.createQueryBuilder('m')
      .leftJoinAndSelect('m.aplicacion', 'a')
      .leftJoinAndSelect('a.ensayo', 'e')
      .orderBy('m.diasDespuesAplicacion', 'ASC');

    if (query?.aplicacionId) {
      qb.andWhere('a.id = :aplicacionId', { aplicacionId: query.aplicacionId });
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

  /**
   * Obtener el progreso de un momento (parcelas medidas vs total)
   */
  async getProgreso(momentoId: number) {
    const momento = await this.repo.findOne({
      where: { id: momentoId },
      relations: ['aplicacion', 'aplicacion.ensayo'],
    });

    if (!momento) throw new NotFoundException(`Momento ${momentoId} no encontrado`);

    const ensayoId = momento.aplicacion.ensayo.id;

    // Contar parcelas totales del ensayo
    const totalParcelas = await this.parcelaRepo.count({
      where: { ensayo: { id: ensayoId } },
    });

    // Contar parcelas ya medidas en este momento
    const parcelasMedidas = await this.datosCampoRepo.count({
      where: { momento: { id: momentoId } },
    });

    // Obtener las parcelas pendientes
    const parcelasConMedicion = await this.datosCampoRepo.find({
      where: { momento: { id: momentoId } },
      relations: ['parcela'],
      select: { id: true, parcela: { id: true } },
    });

    const idsMedidas = parcelasConMedicion.map(dc => dc.parcela.id);

    return {
      momentoId,
      nombreMomento: momento.nombreMomento,
      diasDespuesAplicacion: momento.diasDespuesAplicacion,
      fechaEvaluacion: momento.fechaEvaluacion,
      totalParcelas,
      parcelasMedidas,
      parcelasPendientes: totalParcelas - parcelasMedidas,
      porcentaje: totalParcelas > 0 ? Math.round((parcelasMedidas / totalParcelas) * 100) : 0,
      estado: parcelasMedidas === 0 ? 'pendiente' : parcelasMedidas >= totalParcelas ? 'completado' : 'en_progreso',
      idsParcelasMedidas: idsMedidas,
    };
  }

  async findOne(id: number) {
    const { isInvitado, labIds } = this.auth;
    if (!isInvitado) {
      const entity = await this.repo.findOne({ where: { id }, relations: { aplicacion: true } });
      if (!entity) throw new NotFoundException(`Momento ${id} no encontrado`);
      return entity;
    }
    const qb = this.repo.createQueryBuilder('m')
      .leftJoinAndSelect('m.aplicacion', 'a')
      .leftJoin('a.ensayo', 'e')
      .leftJoin('e.tratamientos', 't')
      .leftJoin('t.productos', 'tp')
      .leftJoin('tp.producto', 'p')
      .leftJoin('p.laboratorio', 'l')
      .where('m.id = :id', { id })
      .andWhere('l.id IN (:...labIds)', { labIds })
      .distinct(true);
    const entity = await qb.getOne();
    if (!entity) throw new NotFoundException(`Momento ${id} no encontrado`);
    return entity;
  }

  async update(id: number, dto: UpdateMomentoDto) {
    const partial: Partial<MomentoEvaluacion> = {
      nombreMomento: dto.nombreMomento,
      diasDespuesAplicacion: dto.diasDespuesAplicacion,
      fechaEvaluacion: dto.fechaEvaluacion ? new Date(dto.fechaEvaluacion) : undefined,
    } as any;
    if (dto.aplicacionId !== undefined) (partial as any).aplicacion = { id: dto.aplicacionId } as any;
    await this.repo.update({ id }, partial);
    return this.findOne(id);
  }

  async remove(id: number) {
    const result = await this.repo.delete({ id });
    if (!result.affected) throw new NotFoundException(`Momento ${id} no encontrado`);
    return { deleted: true };
  }
}
