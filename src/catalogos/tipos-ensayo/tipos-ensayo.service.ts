import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { TipoEnsayo } from '../../entities/tipo-ensayo.entity';
import { CreateTipoEnsayoDto } from './dto/create-tipo-ensayo.dto';
import { UpdateTipoEnsayoDto } from './dto/update-tipo-ensayo.dto';
import { ProtocoloVariable } from '../../entities/protocolo-variable.entity';
import { TipoEnsayoVariable } from '../../entities/tipo-ensayo-variable.entity';
import { AddVariableDto } from './dto/add-variable.dto';
import { TipoEnsayoEvaluacionDia } from '../../entities/tipo-ensayo-evaluacion-dia.entity';
import { SetEvaluacionDto } from './dto/set-evaluacion.dto';

@Injectable()
export class TiposEnsayoService {
  constructor(
    @InjectRepository(TipoEnsayo)
    private readonly repository: Repository<TipoEnsayo>,
    @InjectRepository(TipoEnsayoVariable)
    private readonly tipoVarRepository: Repository<TipoEnsayoVariable>,
    @InjectRepository(ProtocoloVariable)
    private readonly varRepository: Repository<ProtocoloVariable>,
    @InjectRepository(TipoEnsayoEvaluacionDia)
    private readonly diaRepository: Repository<TipoEnsayoEvaluacionDia>,
  ) {}

  // ... (métodos CRUD de TipoEnsayo)

  async create(dto: CreateTipoEnsayoDto): Promise<TipoEnsayo> {
    const newTipo = this.repository.create(dto);
    return this.repository.save(newTipo);
  }

  async findAll(): Promise<TipoEnsayo[]> {
    return this.repository.find({ order: { nombre: 'ASC' } });
  }

  async findOne(id: number): Promise<TipoEnsayo> {
    const tipo = await this.repository.findOne({ where: { id } });
    if (!tipo) {
      throw new NotFoundException(`Tipo de ensayo con ID ${id} no encontrado.`);
    }
    return tipo;
  }

  async update(id: number, dto: UpdateTipoEnsayoDto): Promise<TipoEnsayo> {
    const tipo = await this.findOne(id);
    this.repository.merge(tipo, dto);
    return this.repository.save(tipo);
  }

  async remove(id: number): Promise<{ deleted: true }> {
    await this.findOne(id);
    await this.repository.delete(id);
    return { deleted: true };
  }

  // --- Variables ---
  async listVariables(tipoEnsayoId: number): Promise<ProtocoloVariable[]> {
    return this.varRepository.find({
      where: { tipoEnsayo: { id: tipoEnsayoId } },
      order: { nombre_variable: 'ASC' },
    });
  }

  async addVariable(tipoEnsayoId: number, dto: AddVariableDto): Promise<ProtocoloVariable> {
    const tipoEnsayo = await this.findOne(tipoEnsayoId);

    const newVar = this.varRepository.create({
      tipoEnsayo,
      nombre_variable: dto.nombre_variable,
      unidad_medida: dto.unidad_medida || null,
      descripcion: dto.descripcion || null,
    });

    return this.varRepository.save(newVar);
  }

  async updateVariable(variableId: number, dto: Partial<AddVariableDto>): Promise<ProtocoloVariable> {
    const variable = await this.varRepository.findOne({ where: { id: variableId } });
    if (!variable) {
      throw new NotFoundException(`Variable con ID ${variableId} no encontrada.`);
    }

    if (dto.nombre_variable) {
      variable.nombre_variable = dto.nombre_variable;
    }
    if (dto.unidad_medida !== undefined) {
      variable.unidad_medida = dto.unidad_medida;
    }
    if (dto.descripcion !== undefined) {
      variable.descripcion = dto.descripcion;
    }

    return this.varRepository.save(variable);
  }

  async removeVariable(tipoVarId: number): Promise<{ deleted: true }> {
    const variable = await this.varRepository.findOne({ where: { id: tipoVarId } });
    if (!variable) {
      throw new NotFoundException(`Variable con ID ${tipoVarId} no encontrada.`);
    }
    await this.varRepository.delete(tipoVarId);
    return { deleted: true };
  }

  // --- Días de Evaluación ---
  async getDias(tipoEnsayoId: number): Promise<TipoEnsayoEvaluacionDia[]> {
    return this.diaRepository.find({
      where: { tipoEnsayo: { id: tipoEnsayoId } },
      order: { dia: 'ASC' },
    });
  }

  async setEvaluacion(tipoEnsayoId: number, dto: SetEvaluacionDto): Promise<TipoEnsayo> {
    const tipoEnsayo = await this.findOne(tipoEnsayoId);
    
    tipoEnsayo.evaluacionCsv = Array.isArray(dto.dias) ? dto.dias.join(',') : dto.dias;
    await this.repository.save(tipoEnsayo);

    await this.diaRepository.delete({ tipoEnsayo: { id: tipoEnsayoId } });

    if (tipoEnsayo.evaluacionCsv) {
      const dias = tipoEnsayo.evaluacionCsv.split(',').map((d: string) => parseInt(d.trim(), 10)).filter((d: number) => !isNaN(d));
      const diasEntities = dias.map((dia: number) => this.diaRepository.create({ tipoEnsayo, dia }));
      await this.diaRepository.save(diasEntities);
    }

    return tipoEnsayo;
  }
}
