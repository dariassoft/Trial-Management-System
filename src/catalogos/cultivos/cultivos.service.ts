import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cultivo } from '../../entities/cultivo.entity';
import { CultivoVariedad } from '../../entities/cultivo-variedad.entity';
import { CreateCultivoDto } from './dto/create-cultivo.dto';
import { UpdateCultivoDto } from './dto/update-cultivo.dto';

@Injectable()
export class CultivosService {
  constructor(
    @InjectRepository(Cultivo)
    private readonly cultivoRepository: Repository<Cultivo>,
    @InjectRepository(CultivoVariedad)
    private readonly variedadRepository: Repository<CultivoVariedad>,
  ) {}

  create(createCultivoDto: CreateCultivoDto) {
    const cultivo = this.cultivoRepository.create(createCultivoDto);
    return this.cultivoRepository.save(cultivo);
  }

  async findAll(options: { page?: number; limit?: number; sort?: string; order?: 'ASC' | 'DESC'; q?: string } = {}) {
    const { page = 1, limit = 10, sort = 'nombre', order = 'ASC', q } = options;
    const allowedSort = ['id', 'nombre', 'ciclo_vegetativo'].includes(sort) ? sort : 'nombre';
    const skip = (page - 1) * limit;
    const qTrimmed = q?.trim();

    const qb = this.cultivoRepository.createQueryBuilder('c');
    if (qTrimmed) {
      qb.where('LOWER(c.nombre) LIKE LOWER(:q) OR LOWER(c.descripcion) LIKE LOWER(:q)', { q: `%${qTrimmed}%` });
    }
    const total = await qb.getCount();
    const data = await qb.orderBy(`c.${allowedSort}`, order as 'ASC' | 'DESC').skip(skip).take(limit).getMany();
    return { data, meta: { total, page, limit, pageCount: Math.ceil(total / limit) } };
  }

  findOne(id: number) {
    return this.cultivoRepository.findOne({ where: { id } });
  }

  findVariedadesPorCultivo(cultivo_id: number) {
    return this.variedadRepository.find({ where: { cultivo_id }, order: { nombre: 'ASC' } });
  }

  async update(id: number, updateCultivoDto: UpdateCultivoDto) {
    const cultivo = await this.cultivoRepository.preload({ id, ...(updateCultivoDto as any) });
    if (!cultivo) throw new NotFoundException(`Cultivo con ID #${id} no encontrado`);
    return this.cultivoRepository.save(cultivo);
  }

  async remove(id: number) {
    const cultivo = await this.findOne(id);
    if (!cultivo) throw new NotFoundException(`Cultivo con ID #${id} no encontrado`);
    return this.cultivoRepository.remove(cultivo);
  }
}
