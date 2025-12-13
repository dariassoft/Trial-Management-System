import { Injectable, NotFoundException, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { Role } from '../entities/rol.entity';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ensayo } from '../entities/ensayo.entity';
import { CreateEnsayoDto } from './dto/create-ensayo.dto';
import { UpdateEnsayoDto } from './dto/update-ensayo.dto';
import { Laboratorio } from '../entities/laboratorio.entity';
import { TipoEnsayo } from '../entities/tipo-ensayo.entity';
import { Protocolo } from '../entities/protocolo.entity';
import { Usuario } from '../entities/usuario.entity';
import { Cultivo } from '../entities/cultivo.entity';
import { CultivoVariedad } from '../entities/cultivo-variedad.entity';
import { TipoSiembra } from '../entities/tipo-siembra.entity';
import { StatusEnsayo } from '../entities/status-ensayo.entity';

@Injectable({ scope: Scope.REQUEST })
export class EnsayosService {
  constructor(
    @Inject(REQUEST) private readonly req: Request,
    @InjectRepository(Ensayo) private readonly ensayoRepo: Repository<Ensayo>,
    @InjectRepository(Laboratorio) private readonly labRepo: Repository<Laboratorio>,
    @InjectRepository(TipoEnsayo) private readonly tipoRepo: Repository<TipoEnsayo>,
    @InjectRepository(Protocolo) private readonly protocoloRepo: Repository<Protocolo>,
    @InjectRepository(Usuario) private readonly usuarioRepo: Repository<Usuario>,
    @InjectRepository(Cultivo) private readonly cultivoRepo: Repository<Cultivo>,
    @InjectRepository(CultivoVariedad) private readonly variedadRepo: Repository<CultivoVariedad>,
    @InjectRepository(TipoSiembra) private readonly tipoSiembraRepo: Repository<TipoSiembra>,
    @InjectRepository(StatusEnsayo) private readonly statusRepo: Repository<StatusEnsayo>,
  ) {}

  private get auth() {
    const user = (this.req as any)?.user as JwtPayload | undefined;
    const isInvitado = user?.rol === Role.INVITADO;
    const labIds = (user?.lab_ids || []) as number[];
    return { isInvitado, labIds };
  }

  async create(dto: CreateEnsayoDto) {
    const { laboratorioId, tipoEnsayoId, protocoloId, responsableId, cultivoId, variedadId, tipoSiembraId, statusId, fechaInicio, fechaSiembra, fechaCosecha, ...restDto } = dto;

    const entity = this.ensayoRepo.create({
      ...restDto,
      ...(fechaInicio && { fechaInicio: new Date(fechaInicio) }),
      ...(fechaSiembra && { fechaSiembra: new Date(fechaSiembra) }),
      ...(fechaCosecha && { fechaCosecha: new Date(fechaCosecha) }),
      ...(laboratorioId && { laboratorio: { id: laboratorioId } as Laboratorio }),
      ...(tipoEnsayoId && { tipoEnsayo: { id: tipoEnsayoId } as TipoEnsayo }),
      ...(protocoloId && { protocolo: { id: protocoloId } as Protocolo }),
      ...(responsableId && { responsable: { id: responsableId } as Usuario }),
      ...(cultivoId && { cultivo: { id: cultivoId } as Cultivo }),
      ...(variedadId && { variedad: { id: variedadId } as CultivoVariedad }),
      ...(tipoSiembraId && { tipoSiembra: { id: tipoSiembraId } as TipoSiembra }),
      ...(statusId && { status: { id: statusId } as StatusEnsayo }),
    });

    return this.ensayoRepo.save(entity);
  }

  async findAll(query: { page?: number; limit?: number; sort?: string; order?: 'ASC'|'DESC'; q?: string; fechaSiembraStart?: string; fechaSiembraEnd?: string; laboratorio?: string; variedad?: string; }) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const sort = query.sort ?? 'id';
    const order = (query.order ?? 'ASC') as 'ASC'|'DESC';
    const { isInvitado, labIds } = this.auth;

    const qb = this.ensayoRepo.createQueryBuilder('e')
      .leftJoinAndSelect('e.responsable', 'responsable')
      .leftJoinAndSelect('e.laboratorio', 'laboratorio')
      .leftJoinAndSelect('e.variedad', 'variedad')
      .leftJoinAndSelect('e.cultivo', 'cultivo') // Ensure cultivo is joined for filtering
      .leftJoinAndSelect('e.tipoSiembra', 'tipoSiembra'); // Ensure tipoSiembra is joined for filtering

    if (query.q) {
      const searchTerm = `%${query.q}%`;
      qb.andWhere(`(
        LOWER(e.nombreEnsayo) LIKE LOWER(:q) OR
        LOWER(responsable.nombre) LIKE LOWER(:q) OR
        LOWER(responsable.apellido) LIKE LOWER(:q) OR
        LOWER(cultivo.nombre) LIKE LOWER(:q) OR
        LOWER(variedad.nombre) LIKE LOWER(:q) OR
        LOWER(tipoSiembra.nombre) LIKE LOWER(:q) OR
        LOWER(laboratorio.nombre) LIKE LOWER(:q) OR
        LOWER(e.status) LIKE LOWER(:q)
      )`, { q: searchTerm });
    }
    if (query.laboratorio) {
      qb.andWhere('LOWER(laboratorio.nombre) LIKE LOWER(:laboratorio)', { laboratorio: `%${query.laboratorio}%` });
    }
    if (query.variedad) {
      qb.andWhere('LOWER(variedad.nombre) LIKE LOWER(:variedad)', { variedad: `%${query.variedad}%` });
    }

    if (query.fechaSiembraStart) {
      // Use DATE() function with proper column reference
      // TypeORM will handle the column name mapping automatically
      qb.andWhere('DATE(e.fechaSiembra) >= :fechaSiembraStart', { fechaSiembraStart: query.fechaSiembraStart });
    }
    if (query.fechaSiembraEnd) {
      // Use DATE() function with proper column reference
      // TypeORM will handle the column name mapping automatically
      qb.andWhere('DATE(e.fechaSiembra) <= :fechaSiembraEnd', { fechaSiembraEnd: query.fechaSiembraEnd });
    }

    let orderByField = `e.${sort}`;
    if (sort === 'responsable.nombre') {
      orderByField = 'responsable.nombre';
    } else if (sort === 'laboratorio.nombre') {
      orderByField = 'laboratorio.nombre';
    } else if (sort === 'variedad.nombre') {
      orderByField = 'variedad.nombre';
    } else if (sort === 'cultivo.nombre') {
      orderByField = 'cultivo.nombre';
    } else if (sort === 'tipoSiembra.nombre') {
      orderByField = 'tipoSiembra.nombre';
    }


    if (isInvitado) {
      qb.leftJoin('e.tratamientos', 't')
        .leftJoin('t.productos', 'tp')
        .leftJoin('tp.producto', 'p')
        .andWhere('p.laboratorio.id IN (:...labIds)', { labIds })
        .distinct(true);
    }

    const [data, total] = await qb
      .orderBy(orderByField, order)
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();


    return { data, meta: { total, page, limit, pageCount: Math.max(1, Math.ceil(total / limit)) } };
  }

  async findOne(id: number) {
    const relations = ['laboratorio', 'tipoEnsayo', 'protocolo', 'responsable', 'cultivo', 'variedad', 'tipoSiembra'];
    const entity = await this.ensayoRepo.findOne({ where: { id }, relations });
    if (!entity) throw new NotFoundException(`Ensayo ${id} no encontrado`);
    return entity;
  }

  async update(id: number, dto: UpdateEnsayoDto) {
    const {
        id: dtoId,
        laboratorioId, laboratorio,
        tipoEnsayoId, tipoEnsayo,
        protocoloId, protocolo,
        responsableId, responsable,
        cultivoId, cultivo,
        variedadId, variedad,
        tipoSiembraId, tipoSiembra,
        statusId,
        fechaInicio, fechaSiembra, fechaCosecha,
        ...restUpdateData
    } = dto;

    const partial: Partial<Ensayo> = { ...restUpdateData };

    if (fechaInicio !== undefined) partial.fechaInicio = fechaInicio ? new Date(fechaInicio) : null;
    if (fechaSiembra !== undefined) partial.fechaSiembra = fechaSiembra ? new Date(fechaSiembra) : null;
    if (fechaCosecha !== undefined) partial.fechaCosecha = fechaCosecha ? new Date(fechaCosecha) : null;

    const resolveRelationId = (objField: any, idField: any) => {
        if (idField !== undefined) return idField;
        if (objField !== undefined) return objField?.id ?? null;
        return undefined;
    };

    const resolvedLaboratorioId = resolveRelationId(laboratorio, laboratorioId);
    if (resolvedLaboratorioId !== undefined) {
        partial.laboratorio = resolvedLaboratorioId === null ? null : { id: resolvedLaboratorioId } as Laboratorio;
    }

    const resolvedTipoEnsayoId = resolveRelationId(tipoEnsayo, tipoEnsayoId);
    if (resolvedTipoEnsayoId !== undefined) {
        partial.tipoEnsayo = resolvedTipoEnsayoId === null ? null : { id: resolvedTipoEnsayoId } as TipoEnsayo;
    }

    const resolvedProtocoloId = resolveRelationId(protocolo, protocoloId);
    if (resolvedProtocoloId !== undefined) {
        partial.protocolo = resolvedProtocoloId === null ? null : { id: resolvedProtocoloId } as Protocolo;
    }

    const resolvedResponsableId = resolveRelationId(responsable, responsableId);
    if (resolvedResponsableId !== undefined) {
        partial.responsable = resolvedResponsableId === null ? null : { id: resolvedResponsableId } as Usuario;
    }

    const resolvedCultivoId = resolveRelationId(cultivo, cultivoId);
    if (resolvedCultivoId !== undefined) {
        partial.cultivo = resolvedCultivoId === null ? null : { id: resolvedCultivoId } as Cultivo;
    }

    const resolvedVariedadId = resolveRelationId(variedad, variedadId);
    if (resolvedVariedadId !== undefined) {
        partial.variedad = resolvedVariedadId === null ? null : { id: resolvedVariedadId } as CultivoVariedad;
    }

    const resolvedTipoSiembraId = resolveRelationId(tipoSiembra, tipoSiembraId);
    if (resolvedTipoSiembraId !== undefined) {
        partial.tipoSiembra = resolvedTipoSiembraId === null ? null : { id: resolvedTipoSiembraId } as TipoSiembra;
    }

    const resolvedStatusId = statusId;
    if (resolvedStatusId !== undefined) {
        partial.status = resolvedStatusId === null ? null : { id: resolvedStatusId } as StatusEnsayo;
    }

    await this.ensayoRepo.update({ id }, partial);
    return this.findOne(id);
  }

  async remove(id: number) {
    const result = await this.ensayoRepo.delete({ id });
    if (!result.affected) throw new NotFoundException(`Ensayo ${id} no encontrado`);
    return { deleted: true };
  }
}
