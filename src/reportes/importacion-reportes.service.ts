import { BadRequestException, Injectable, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import * as ExcelJS from 'exceljs';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Ensayo } from '../entities/ensayo.entity';
import { Parcela } from '../entities/parcela.entity';
import { DatosCampo } from '../entities/datos-campo.entity';
import { DatosCampoMedicion } from '../entities/datos-campo-medicion.entity';
import { DatosCosecha } from '../entities/datos-cosecha.entity';
import { ProtocoloVariable } from '../entities/protocolo-variable.entity';
import { MomentoEvaluacion } from '../entities/momento-evaluacion.entity';
import { ImportacionEnsayoLog } from '../entities/importacion-ensayo-log.entity';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import { TipoNotificacion } from '../notificaciones/entities/notificacion.entity';
import { JwtPayload } from '../auth/jwt-payload.interface';

const SHEETS = ['Resumen', 'Evaluaciones Fechas', 'Evaluaciones Detalle', 'Datos Campo', 'Datos Cosecha', 'Estadísticas', 'Análisis Gráfico'];
const CAMPO_HEADERS = ['Parcela', 'Tratamiento', 'Bloque', 'Momento', 'Variable', 'Valor'];
const COSECHA_HEADERS = ['Parcela', 'Tratamiento', 'Bloque', 'Humedad %', 'kg/ha (corregido)', 'Peso Grano (g)', 'Humedad Grano (%)', 'Superficie (m²)', 'GIE %', 'Larvas', 'Benéficos'];

@Injectable({ scope: Scope.REQUEST })
export class ImportacionReportesService {
  constructor(
    @Inject(REQUEST) private readonly req: Request,
    private readonly dataSource: DataSource,
    @InjectRepository(Ensayo) private readonly ensayoRepo: Repository<Ensayo>,
    @InjectRepository(Parcela) private readonly parcelaRepo: Repository<Parcela>,
    private readonly notificaciones: NotificacionesService,
  ) {}

  private value(cell: ExcelJS.Cell): any {
    const v: any = cell.value;
    if (v && typeof v === 'object' && 'result' in v) return v.result;
    if (v && typeof v === 'object' && 'text' in v) return v.text;
    return v;
  }

  private text(value: any): string { return String(value ?? '').trim(); }
  private number(value: any, row: number, column: string, required = false): number | null {
    if (value === null || value === undefined || this.text(value) === '') {
      if (required) throw new BadRequestException(`La hoja contiene un valor vacío en ${column}${row}`);
      return null;
    }
    const n = Number(this.text(value).replace('%', '').replace(',', '.').replace(/[^0-9.+-]/g, ''));
    if (!Number.isFinite(n)) throw new BadRequestException(`Valor numérico inválido en ${column}${row}`);
    return n;
  }

  private headers(sheet: ExcelJS.Worksheet, expected: string[]): void {
    const actual = expected.map((_, i) => this.text(this.value(sheet.getCell(1, i + 1))));
    if (actual.length !== expected.length || actual.some((h, i) => h !== expected[i])) {
      throw new BadRequestException(`Formato incompatible en la hoja "${sheet.name}": encabezados no válidos`);
    }
  }

  async importar(buffer: Buffer, ensayoEsperadoId?: number): Promise<{ ensayoId: number; cambios: Record<string, number>; totalCambios: number }> {
    const wb = new ExcelJS.Workbook();
    try { await wb.xlsx.load(buffer as any); } catch { throw new BadRequestException('El archivo no es un Excel XLSX válido'); }
    if (wb.worksheets.map(s => s.name).join('|') !== SHEETS.join('|')) {
      throw new BadRequestException('El archivo no es compatible: debe contener exactamente las hojas del reporte Excel');
    }
    const resumen = wb.getWorksheet('Resumen')!;
    if (this.text(this.value(resumen.getCell('A3'))) !== 'ID Ensayo') throw new BadRequestException('El archivo no es compatible: falta Resumen!A3');
    const ensayoId = this.number(this.value(resumen.getCell('B3')), 3, 'B', true)!;
    if (ensayoEsperadoId !== undefined && ensayoId !== ensayoEsperadoId) {
      throw new BadRequestException(`El archivo corresponde al ensayo ${ensayoId}, no al ensayo seleccionado ${ensayoEsperadoId}`);
    }
    const ensayo = await this.ensayoRepo.findOne({ where: { id: ensayoId }, relations: ['responsable', 'tipoEnsayo'] });
    if (!ensayo) throw new BadRequestException(`El ensayo ${ensayoId} indicado en Resumen!B3 no existe`);
    const campo = wb.getWorksheet('Datos Campo')!;
    const cosecha = wb.getWorksheet('Datos Cosecha')!;
    this.headers(campo, CAMPO_HEADERS); this.headers(cosecha, COSECHA_HEADERS);

    const parcelas = await this.parcelaRepo.find({ where: { ensayo: { id: ensayoId } }, relations: ['bloque', 'tratamiento'] });
    const parcelaMap = new Map(parcelas.map(p => [this.text(p.nombreParcela), p]));
    const cambios: Record<string, number> = { 'Datos Campo': 0, 'Datos Cosecha': 0 };
    const qr = this.dataSource.createQueryRunner(); await qr.connect(); await qr.startTransaction();
    try {
      for (let r = 2; r <= campo.rowCount; r++) {
        const row = campo.getRow(r); if (this.text(this.value(row.getCell(1))) === '') continue;
        const parcela = parcelaMap.get(this.text(this.value(row.getCell(1))));
        if (!parcela) throw new BadRequestException(`Parcela inválida en Datos Campo fila ${r}`);
        if (this.text(this.value(row.getCell(2))) !== this.text(parcela.tratamiento?.numeroTrat) || this.text(this.value(row.getCell(3))) !== this.text(parcela.bloque?.nombreBloque)) throw new BadRequestException(`Identificación inconsistente en Datos Campo fila ${r}`);
        const momento = await qr.manager.getRepository(MomentoEvaluacion).createQueryBuilder('m')
          .leftJoinAndSelect('m.aplicacion', 'a')
          .leftJoin('a.ensayo', 'e')
          .where('m.nombre_momento = :nombre', { nombre: this.text(this.value(row.getCell(4))) })
          .andWhere('e.ensayo_id = :ensayoId', { ensayoId })
          .getOne();
        if (!momento) throw new BadRequestException(`Momento inválido en Datos Campo fila ${r}`);
        const variable = await qr.manager.getRepository(ProtocoloVariable).createQueryBuilder('v')
          .leftJoin('v.tipoEnsayo', 'te')
          .where('v.nombre_variable = :nombre', { nombre: this.text(this.value(row.getCell(5))) })
          .andWhere('te.tipo_ensayo_id = :tipoId', { tipoId: (ensayo.tipoEnsayo as any)?.id })
          .getOne();
        if (!variable) throw new BadRequestException(`Variable inválida en Datos Campo fila ${r}`);
        let visita = await qr.manager.getRepository(DatosCampo).findOne({ where: { parcela: { id: parcela.id }, momento: { id: momento.id } }, relations: ['mediciones', 'mediciones.variable'] });
        let medicion = visita?.mediciones?.find(m => m.variable?.id === variable.id);
        const valor = this.value(row.getCell(6));
        if (!visita) { visita = qr.manager.create(DatosCampo, { parcela: { id: parcela.id } as any, momento: { id: momento.id } as any }); visita = await qr.manager.save(visita); }
        if (!medicion) medicion = qr.manager.create(DatosCampoMedicion, { visita, variable: { id: variable.id } as any });
        const nuevo = valor === null || valor === undefined || this.text(valor) === '' ? '' : this.text(valor);
        if (medicion.valor !== nuevo) { medicion.valor = nuevo; await qr.manager.save(medicion); cambios['Datos Campo']++; }
      }
      for (let r = 2; r <= cosecha.rowCount; r++) {
        const row = cosecha.getRow(r); if (this.text(this.value(row.getCell(1))) === '') continue;
        const parcela = parcelaMap.get(this.text(this.value(row.getCell(1))));
        if (!parcela) throw new BadRequestException(`Parcela inválida en Datos Cosecha fila ${r}`);
        if (this.text(this.value(row.getCell(2))) !== this.text(parcela.tratamiento?.numeroTrat) || this.text(this.value(row.getCell(3))) !== this.text(parcela.bloque?.nombreBloque)) throw new BadRequestException(`Identificación inconsistente en Datos Cosecha fila ${r}`);
        const input = { humedadPct: this.number(this.value(row.getCell(4)), r, 'D'), pesoGranoCosechado: this.number(this.value(row.getCell(6)), r, 'F'), humedadGranoCosechado: this.number(this.value(row.getCell(7)), r, 'G'), superficieCosechadaM2: this.number(this.value(row.getCell(8)), r, 'H'), gie: this.number(this.value(row.getCell(9)), r, 'I'), larvasPorUrf: this.number(this.value(row.getCell(10)), r, 'J'), insectosBeneficiosPorUrf: this.number(this.value(row.getCell(11)), r, 'K') };
        const kgHa = input.pesoGranoCosechado != null && input.superficieCosechadaM2 && input.superficieCosechadaM2 > 0 ? ((input.pesoGranoCosechado / 1000) / input.superficieCosechadaM2 * 10000) * (input.humedadGranoCosechado == null ? 1 : 1 - ((input.humedadGranoCosechado - 13.5) / 86.5)) : null;
        let entity = await qr.manager.findOne(DatosCosecha, { where: { parcela: { id: parcela.id } } });
        if (!entity) entity = qr.manager.create(DatosCosecha, { parcela: { id: parcela.id } as any });
        const kgHaImportado = this.number(this.value(row.getCell(5)), r, 'E');
        const nuevosValores = { ...input, kgHaCorregido: kgHa == null ? kgHaImportado : kgHa };
        const cambio = Object.entries(nuevosValores).some(([key, value]) => Number((entity as any)[key]) !== Number(value));
        Object.assign(entity, nuevosValores);
        await qr.manager.save(entity);
        if (cambio) cambios['Datos Cosecha']++;
      }
      const changedSheets = Object.entries(cambios).filter(([, n]) => n > 0);
      const user = (this.req as any).user as JwtPayload;
      const resumenCambios = changedSheets.map(([sheet, count]) => `${sheet}: ${count} fila(s)`).join('; ') || 'Sin cambios';
      await qr.manager.save(ImportacionEnsayoLog, { ensayo: { id: ensayoId } as any, usuario: { id: user.sub } as any, hojasModificadas: changedSheets.length, resumen: resumenCambios });
      await qr.commitTransaction();
      const destinatarios = new Set<number>([user.sub, ensayo.responsable?.id].filter(Boolean) as number[]);
      for (const usuarioId of destinatarios) await this.notificaciones.create({ usuarioId, titulo: `Importación Excel - Ensayo #${ensayoId}`, descripcion: `Se importaron mediciones en ${resumenCambios}. Usuario: ${user.username}.`, tipo: TipoNotificacion.GENERAL, ensayoId, link: `/ensayos/${ensayoId}` });
      return { ensayoId, cambios, totalCambios: Object.values(cambios).reduce((a, b) => a + b, 0) };
    } catch (error) { await qr.rollbackTransaction(); throw error; } finally { await qr.release(); }
  }
}