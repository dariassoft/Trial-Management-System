import { Injectable, NotFoundException, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { Role } from '../entities/rol.entity';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { DatosCampo } from '../entities/datos-campo.entity';
import { CreateDatosCampoDto } from './dto/create-datos-campo.dto';
import { UpdateDatosCampoDto } from './dto/update-datos-campo.dto';
import { DatosCampoMedicion } from '../entities/datos-campo-medicion.entity';

@Injectable({ scope: Scope.REQUEST })
export class DatosCampoService {
  constructor(
    @Inject(REQUEST) private readonly req: Request,
    @InjectRepository(DatosCampo)
    private readonly repo: Repository<DatosCampo>,
    @InjectRepository(DatosCampoMedicion)
    private readonly medicionRepo: Repository<DatosCampoMedicion>,
    private readonly dataSource: DataSource,
  ) {}

  private get auth() {
    const user = (this.req as any)?.user as JwtPayload | undefined;
    const isInvitado = user?.rol === Role.INVITADO;
    const labIds = (user?.lab_ids || []) as number[];
    return { isInvitado, labIds };
  }

  async create(dto: CreateDatosCampoDto) {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      // Buscar si ya existe un registro para esta parcela+momento
      const existente = await this.repo.findOne({
        where: {
          parcela: { id: dto.parcela_id_fk },
          momento: { id: dto.momento_id_fk },
        },
        relations: ['mediciones'],
      });

      let visitaGuardada: DatosCampo;

      if (existente) {
        // ACTUALIZAR existente
        existente.observaciones = dto.observaciones;
        visitaGuardada = await qr.manager.save(existente);

        // Eliminar mediciones anteriores y crear nuevas
        if (existente.mediciones?.length) {
          await qr.manager.delete(DatosCampoMedicion, { visita: { id: existente.id } });
        }
      } else {
        // CREAR nuevo
        const visita = this.repo.create({
          parcela: { id: dto.parcela_id_fk } as any,
          momento: { id: dto.momento_id_fk } as any,
          observaciones: dto.observaciones,
        });
        visitaGuardada = await qr.manager.save(visita);
      }

      // Guardar mediciones
      const mediciones: DatosCampoMedicion[] = (dto.mediciones || []).map((m) => {
        const med = new DatosCampoMedicion();
        med.visita = visitaGuardada;
        med.variable = { id: m.variable_id } as any;
        med.valor = m.valor;
        return med;
      });
      if (mediciones.length) {
        await qr.manager.save(DatosCampoMedicion, mediciones);
      }
      await qr.commitTransaction();
      return this.findOne(visitaGuardada.id);
    } catch (e) {
      await qr.rollbackTransaction();
      throw e;
    } finally {
      await qr.release();
    }
  }

  async findAll(query?: { page?: number; limit?: number; parcelaId?: number; momentoId?: number; sort?: string; order?: 'ASC'|'DESC' }) {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;
    const sort = query?.sort ?? 'id';
    const order = (query?.order ?? 'ASC') as 'ASC'|'DESC';
    const { isInvitado, labIds } = this.auth;
    const qb = this.repo.createQueryBuilder('dc')
      .leftJoinAndSelect('dc.parcela', 'parcela')
      .leftJoinAndSelect('dc.momento', 'momento')
      .leftJoinAndSelect('dc.mediciones', 'mediciones')
      .leftJoinAndSelect('mediciones.variable', 'variable');
    if (query?.parcelaId) qb.andWhere('parcela.id = :parcelaId', { parcelaId: query.parcelaId });
    if (query?.momentoId) qb.andWhere('momento.id = :momentoId', { momentoId: query.momentoId });
    if (isInvitado) {
      qb.leftJoin('parcela.tratamiento', 'trat')
        .leftJoin('trat.productos', 'tp')
        .leftJoin('tp.producto', 'prod')
        .leftJoin('prod.laboratorio', 'lab')
        .andWhere('lab.id IN (:...labIds)', { labIds })
        .distinct(true);
    }
    const [data, total] = await qb
      .orderBy(`dc.${sort}`, order)
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    return { data, meta: { total, page, limit, pageCount: Math.max(1, Math.ceil(total / limit)) } };
  }

  async findOne(id: number) {
    const { isInvitado, labIds } = this.auth;
    if (!isInvitado) {
      const entity = await this.repo.findOne({ where: { id }, relations: ['parcela', 'momento', 'mediciones', 'mediciones.variable'] });
      if (!entity) throw new NotFoundException(`DatosCampo ${id} no encontrado`);
      return entity;
    }
    const qb = this.repo.createQueryBuilder('dc')
      .leftJoinAndSelect('dc.parcela', 'parcela')
      .leftJoinAndSelect('dc.momento', 'momento')
      .leftJoinAndSelect('dc.mediciones', 'mediciones')
      .leftJoinAndSelect('mediciones.variable', 'variable')
      .leftJoin('parcela.tratamiento', 'trat')
      .leftJoin('trat.productos', 'tp')
      .leftJoin('tp.producto', 'prod')
      .leftJoin('prod.laboratorio', 'lab')
      .where('dc.id = :id', { id })
      .andWhere('lab.id IN (:...labIds)', { labIds })
      .distinct(true);
    const entity = await qb.getOne();
    if (!entity) throw new NotFoundException(`DatosCampo ${id} no encontrado`);
    return entity;
  }

  async update(id: number, dto: UpdateDatosCampoDto) {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      // 1) Cargar la visita existente y validar
      const visita = await qr.manager.findOne(DatosCampo, { where: { id } });
      if (!visita) throw new NotFoundException(`DatosCampo ${id} no encontrado`);

      // 2) Actualizar solo campos simples permitidos (NO cambiar parcela/momento)
      if (dto.observaciones !== undefined) {
        visita.observaciones = dto.observaciones;
        await qr.manager.save(DatosCampo, visita);
      }

      // 3) Reemplazar mediciones si se envía el arreglo completo
      if (dto.mediciones) {
        await qr.manager.delete(DatosCampoMedicion, { visita: { id } as any });
        const mediciones: DatosCampoMedicion[] = dto.mediciones.map((m) => {
          const med = new DatosCampoMedicion();
          med.visita = { id } as any;
          med.variable = { id: m.variable_id } as any;
          med.valor = m.valor;
          return med;
        });
        if (mediciones.length) await qr.manager.save(DatosCampoMedicion, mediciones);
      }

      await qr.commitTransaction();
      return this.findOne(id);
    } catch (e) {
      await qr.rollbackTransaction();
      throw e;
    } finally {
      await qr.release();
    }
  }

  async remove(id: number) {
    const result = await this.repo.delete({ id });
    if (!result.affected) throw new NotFoundException(`DatosCampo ${id} no encontrado`);
    return { deleted: true };
  }

  async findMedicionesByVariable(variableId: number, query?: { page?: number; limit?: number; sort?: string; order?: 'ASC'|'DESC' }) {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;
    const sort = query?.sort ?? 'id';
    const order = (query?.order ?? 'ASC') as 'ASC' | 'DESC';
    const { isInvitado, labIds } = this.auth;
    const qb = this.medicionRepo.createQueryBuilder('m')
      .leftJoinAndSelect('m.variable', 'variable')
      .leftJoinAndSelect('m.visita', 'visita')
      .leftJoinAndSelect('visita.parcela', 'parcela')
      .leftJoinAndSelect('visita.momento', 'momento')
      .where('variable.id = :variableId', { variableId });
    if (isInvitado) {
      qb.leftJoin('parcela.tratamiento', 'trat')
        .leftJoin('trat.productos', 'tp')
        .leftJoin('tp.producto', 'prod')
        .leftJoin('prod.laboratorio', 'lab')
        .andWhere('lab.id IN (:...labIds)', { labIds })
        .distinct(true);
    }
    const [data, total] = await qb
      .orderBy(`m.${sort}`, order)
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    return { data, meta: { total, page, limit, pageCount: Math.max(1, Math.ceil(total / limit)) } };
  }

  async findMedicionesByVisita(visitaId: number, query?: { page?: number; limit?: number; sort?: string; order?: 'ASC'|'DESC' }) {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;
    const sort = query?.sort ?? 'id';
    const order = (query?.order ?? 'ASC') as 'ASC' | 'DESC';
    const { isInvitado, labIds } = this.auth;
    const qb = this.medicionRepo.createQueryBuilder('m')
      .leftJoinAndSelect('m.variable', 'variable')
      .leftJoinAndSelect('m.visita', 'visita')
      .leftJoinAndSelect('visita.parcela', 'parcela')
      .leftJoinAndSelect('visita.momento', 'momento')
      .where('visita.id = :visitaId', { visitaId });
    if (isInvitado) {
      qb.leftJoin('parcela.tratamiento', 'trat')
        .leftJoin('trat.productos', 'tp')
        .leftJoin('tp.producto', 'prod')
        .leftJoin('prod.laboratorio', 'lab')
        .andWhere('lab.id IN (:...labIds)', { labIds })
        .distinct(true);
    }
    const [data, total] = await qb
      .orderBy(`m.${sort}`, order)
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    return { data, meta: { total, page, limit, pageCount: Math.max(1, Math.ceil(total / limit)) } };
  }
}
