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

  findAll() {
    return this.cultivoRepository.find({ order: { nombre: 'ASC' } });
  }

  findOne(id: number) {
    return this.cultivoRepository.findOne({ where: { id } });
  }

  findVariedadesPorCultivo(cultivo_id: number) {
    return this.variedadRepository.find({ where: { cultivo_id }, order: { nombre: 'ASC' } });
  }

  async update(id: number, updateCultivoDto: UpdateCultivoDto) {
    const cultivo = await this.cultivoRepository.preload({ id, ...updateCultivoDto });
    if (!cultivo) throw new NotFoundException(`Cultivo con ID #${id} no encontrado`);
    return this.cultivoRepository.save(cultivo);
  }

  async remove(id: number) {
    const cultivo = await this.findOne(id);
    if (!cultivo) throw new NotFoundException(`Cultivo con ID #${id} no encontrado`);
    return this.cultivoRepository.remove(cultivo);
  }
}
