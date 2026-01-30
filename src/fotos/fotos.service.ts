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
    // Cargar visita con relaciones para obtener info de parcela, bloque y ensayo
    const visita = await this.visitaRepo.findOne({
      where: { id: idVisita },
      relations: ['parcela', 'parcela.bloque', 'parcela.ensayo', 'momento'],
    });
    if (!visita) throw new NotFoundException(`Visita (DatosCampo) ${idVisita} no encontrada`);

    // Extraer información para el nombre descriptivo
    const parcela = visita.parcela;
    const bloque = parcela?.bloque;
    const ensayo = parcela?.ensayo;
    const momento = visita.momento;

    // Construir nombre descriptivo del archivo
    // Formato: ensayo{id}_bloque{nombre}_parcela{nombre}_DDA{dias}_{timestamp}.{ext}
    const ensayoId = ensayo?.id || 0;
    const bloqueNombre = (bloque?.nombreBloque || 'X').replace(/[^a-zA-Z0-9]/g, '');
    const parcelaNombre = (parcela?.nombreParcela || 'X').replace(/[^a-zA-Z0-9\-\.]/g, '_');
    const dda = momento?.diasDespuesAplicacion ?? 0;
    const timestamp = Date.now();
    const ext = path.extname(file.originalname) || `.${file.mimetype?.split('/')[1] || 'bin'}`;
    const isVideo = file.mimetype?.startsWith('video/');
    const tipo = isVideo ? 'video' : 'foto';

    const nuevoNombre = `${tipo}_E${ensayoId}_B${bloqueNombre}_${parcelaNombre}_DDA${dda}_${timestamp}${ext}`;

    // Estructura de carpetas: /uploads/ensayo_{id}/bloque_{nombre}/
    const uploadsRoot = path.join(process.cwd(), 'uploads');
    const ensayoDir = path.join(uploadsRoot, `ensayo_${ensayoId}`);
    const bloqueDir = path.join(ensayoDir, `bloque_${bloqueNombre}`);

    // Crear carpetas si no existen
    const fs = require('fs');
    if (!fs.existsSync(ensayoDir)) fs.mkdirSync(ensayoDir, { recursive: true });
    if (!fs.existsSync(bloqueDir)) fs.mkdirSync(bloqueDir, { recursive: true });

    // Mover archivo a la nueva ubicación
    const nuevoPath = path.join(bloqueDir, nuevoNombre);
    fs.renameSync(file.path, nuevoPath);

    // Construir ruta relativa para servir vía HTTP
    const relative = path.relative(uploadsRoot, nuevoPath).split(path.sep).join('/');
    const file_path = `/uploads/${relative}`;

    const foto = this.fotoRepo.create({
      visita,
      file_name: nuevoNombre,
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
