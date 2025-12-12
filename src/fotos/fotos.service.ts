import { Injectable, NotFoundException, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { Role } from '../entities/rol.entity';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FotoRegistro } from '../entities/foto-registro.entity';
import { DatosCampo } from '../entities/datos-campo.entity';
import * as path from 'path';

@Injectable({ scope: Scope.REQUEST })
export class FotosService {
  constructor(
    @Inject(REQUEST) private readonly req: Request,
    @InjectRepository(FotoRegistro)
    private readonly fotoRepo: Repository<FotoRegistro>,
    @InjectRepository(DatosCampo)
    private readonly visitaRepo: Repository<DatosCampo>,
  ) {}

  private get auth() {
    const user = (this.req as any)?.user as JwtPayload | undefined;
    const isInvitado = user?.rol === Role.INVITADO;
    const labIds = (user?.lab_ids || []) as number[];
    return { isInvitado, labIds };
  }

  async create(idVisita: number, file: any) {
    const visita = await this.visitaRepo.findOne({ where: { id: idVisita } });
    if (!visita) throw new NotFoundException(`Visita (DatosCampo) ${idVisita} no encontrada`);

    // Construir ruta relativa a /uploads para servirla vía HTTP
    const uploadsRoot = path.join(process.cwd(), 'uploads');
    let relative = path.relative(uploadsRoot, file.path).split(path.sep).join('/');
    if (!relative || relative.startsWith('..')) {
      // Fallback al nombre del archivo en raíz si por alguna razón no coincide
      relative = file.filename;
    }
    const file_path = `/uploads/${relative}`;

    const foto = this.fotoRepo.create({
      visita,
      file_name: file.originalname,
      file_path,
      mime_type: file.mimetype,
    });
    return this.fotoRepo.save(foto);
  }

  async findOne(id: number) {
    const { isInvitado, labIds } = this.auth;
    if (!isInvitado) {
      const foto = await this.fotoRepo.findOne({ where: { id }, relations: { visita: true } });
      if (!foto) throw new NotFoundException(`Foto ${id} no encontrada`);
      return foto;
    }
    const qb = this.fotoRepo.createQueryBuilder('f')
      .leftJoinAndSelect('f.visita', 'visita')
      .leftJoin('visita.parcela', 'parcela')
      .leftJoin('parcela.tratamiento', 'trat')
      .leftJoin('trat.productos', 'tp')
      .leftJoin('tp.producto', 'prod')
      .leftJoin('prod.laboratorio', 'lab')
      .where('f.id = :id', { id })
      .andWhere('lab.id IN (:...labIds)', { labIds })
      .distinct(true);
    const foto = await qb.getOne();
    if (!foto) throw new NotFoundException(`Foto ${id} no encontrada`);
    return foto;
  }

  async remove(id: number) {
    const result = await this.fotoRepo.delete({ id });
    if (!result.affected) throw new NotFoundException(`Foto ${id} no encontrada`);
    return { deleted: true };
  }

  async findByVisita(visitaId: number, query?: { page?: number; limit?: number; sort?: string; order?: 'ASC'|'DESC' }) {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;
    const sort = query?.sort ?? 'id';
    const order = (query?.order ?? 'ASC') as 'ASC'|'DESC';
    const { isInvitado, labIds } = this.auth;
    const qb = this.fotoRepo.createQueryBuilder('f')
      .leftJoinAndSelect('f.visita', 'visita')
      .leftJoin('visita.parcela', 'parcela')
      .leftJoin('parcela.tratamiento', 'trat')
      .leftJoin('trat.productos', 'tp')
      .leftJoin('tp.producto', 'prod')
      .leftJoin('prod.laboratorio', 'lab')
      .where('visita.id = :visitaId', { visitaId });
    if (isInvitado) qb.andWhere('lab.id IN (:...labIds)', { labIds }).distinct(true);
    const [data, total] = await qb
      .orderBy(`f.${sort}`, order)
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    return { data, meta: { total, page, limit, pageCount: Math.max(1, Math.ceil(total / limit)) } };
  }
}
