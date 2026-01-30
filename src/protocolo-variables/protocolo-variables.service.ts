import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProtocoloVariable } from '../entities/protocolo-variable.entity';
import { UpdateProtocoloVariableDto } from './dto/update-protocolo-variable.dto';

@Injectable()
export class ProtocoloVariablesService {
  constructor(
    @InjectRepository(ProtocoloVariable)
    private readonly repository: Repository<ProtocoloVariable>,
  ) {}

  async findAll(): Promise<ProtocoloVariable[]> {
    return this.repository.find({
      relations: ['tipoEnsayo'],
      order: { id: 'ASC' },
    });
  }

  async findByTipoEnsayo(tipoEnsayoId: number): Promise<ProtocoloVariable[]> {
    return this.repository.find({
      where: { tipoEnsayo: { id: tipoEnsayoId } },
      relations: ['tipoEnsayo'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<ProtocoloVariable> {
    const variable = await this.repository.findOne({
      where: { id },
      relations: ['tipoEnsayo'],
    });
    if (!variable) {
      throw new NotFoundException(`Variable con ID ${id} no encontrada.`);
    }
    return variable;
  }

  async update(id: number, dto: UpdateProtocoloVariableDto): Promise<ProtocoloVariable> {
    const variable = await this.repository.findOne({ where: { id } });
    if (!variable) {
      throw new NotFoundException(`Variable con ID ${id} no encontrada.`);
    }
    this.repository.merge(variable, dto);
    return this.repository.save(variable);
  }
}
