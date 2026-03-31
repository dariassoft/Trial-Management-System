import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoSiembra } from '../../entities/tipo-siembra.entity';
import { CreateTipoSiembraDto } from './dto/create-tipo-siembra.dto';

@Injectable()
export class TiposSiembraService {
  constructor(
    @InjectRepository(TipoSiembra)
    private readonly repository: Repository<TipoSiembra>,
  ) {}

  async create(dto: CreateTipoSiembraDto): Promise<TipoSiembra> {
    const newTipo = this.repository.create(dto);
    return this.repository.save(newTipo);
  }

  async findAll(options: { page?: number; limit?: number; sort?: string; order?: 'ASC' | 'DESC'; q?: string } = {}) {
    const { page = 1, limit = 10, sort = 'nombre', order = 'ASC', q } = options;
    const allowedSort = ['id', 'nombre'].includes(sort) ? sort : 'nombre';
    const skip = (page - 1) * limit;
    const qTrimmed = q?.trim();

    const qb = this.repository.createQueryBuilder('t');
    if (qTrimmed) {
      qb.where('LOWER(t.nombre) LIKE LOWER(:q) OR LOWER(t.descripcion) LIKE LOWER(:q)', { q: `%${qTrimmed}%` });
    }
    const [data, total] = await qb.orderBy(`t.${allowedSort}`, order as 'ASC' | 'DESC').skip(skip).take(limit).getManyAndCount();
    return { data, meta: { total, page, limit, pageCount: Math.ceil(total / limit) } };
  }

  async findOne(id: number): Promise<TipoSiembra> {
    const tipo = await this.repository.findOne({ where: { id } });
    if (!tipo) throw new NotFoundException(`Tipo de siembra con ID #${id} no encontrado`);
    return tipo;
  }

  async update(id: number, dto: Partial<CreateTipoSiembraDto>): Promise<TipoSiembra> {
    const tipo = await this.findOne(id);
    Object.assign(tipo, dto);
    return this.repository.save(tipo);
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const tipo = await this.findOne(id);
    await this.repository.remove(tipo);
    return { deleted: true };
  }
}
