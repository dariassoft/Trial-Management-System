import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { Response } from 'express';
import { ReportesService } from './reportes.service';

@ApiTags('reportes')
@ApiBearerAuth()
@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Get('ensayo/:ensayoId/pdf')
  @ApiOperation({ summary: 'Generar reporte PDF de un ensayo' })
  @ApiParam({ name: 'ensayoId', type: Number })
  async generarReportePdf(
    @Param('ensayoId', ParseIntPipe) ensayoId: number,
    @Res() res: Response,
  ) {
    try {
      console.log(`📄 Generando PDF para ensayo ${ensayoId}`);

      // Obtener datos del ensayo desde la BD
      const { datosCampo, datosTrilla, metadadatos } =
        await this.reportesService.obtenerDatosEnsayo(ensayoId);

      console.log(`  ✅ Datos de campo: ${datosCampo.length} registros`);
      console.log(`  ✅ Datos de trilla: ${datosTrilla.length} registros`);
      console.log(`  ✅ Metadata: ${JSON.stringify(metadadatos).substring(0, 100)}...`);

      const buffer = await this.reportesService.generarPDF(
        datosCampo,
        datosTrilla,
        metadadatos,
      );

      console.log(`  ✅ PDF generado: ${buffer.length} bytes`);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="ensayo_${ensayoId}_${new Date().toISOString().split('T')[0]}.pdf"`,
      );
      res.send(buffer);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error('❌ Error generando PDF:', errorMessage);
      console.error('Stack:', error.stack);
      res
        .status(500)
        .json({ error: 'Error al generar PDF', details: errorMessage });
    }
  }

  @Get('ensayo/:ensayoId/xls')
  @ApiOperation({ summary: 'Generar reporte Excel de un ensayo' })
  @ApiParam({ name: 'ensayoId', type: Number })
  async generarReporteXls(
    @Param('ensayoId', ParseIntPipe) ensayoId: number,
    @Res() res: Response,
  ) {
    try {
      console.log(`📊 Generando Excel para ensayo ${ensayoId}`);

      // Obtener datos del ensayo desde la BD
      const { datosCampo, datosTrilla, metadadatos } =
        await this.reportesService.obtenerDatosEnsayo(ensayoId);

      console.log(`  ✅ Datos de campo: ${datosCampo.length} registros`);
      console.log(`  ✅ Datos de trilla: ${datosTrilla.length} registros`);

      const buffer = await this.reportesService.generarExcel(
        datosCampo,
        datosTrilla,
        metadadatos,
      );

      console.log(`  ✅ Excel generado: ${buffer.length} bytes`);

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="ensayo_${ensayoId}_${new Date().toISOString().split('T')[0]}.xlsx"`,
      );
      res.send(buffer);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error('❌ Error generando Excel:', errorMessage);
      console.error('Stack:', error.stack);
      res
        .status(500)
        .json({ error: 'Error al generar Excel', details: errorMessage });
    }
  }

  @Get('ensayo/:ensayoId/vista-previa')
  @ApiOperation({ summary: 'Vista previa de reporte con datos crudos' })
  @ApiParam({ name: 'ensayoId', type: Number })
  async vistaPreviaReporte(
    @Param('ensayoId', ParseIntPipe) ensayoId: number,
  ) {
    try {
      console.log(`👁️  Vista previa para ensayo ${ensayoId}`);

      // Obtener datos del ensayo desde la BD
      const { datosCampo, datosTrilla, metadadatos } =
        await this.reportesService.obtenerDatosEnsayo(ensayoId);

      const estadisticas =
        this.reportesService.calcularEstadisticasPorTratamiento(
          datosTrilla || [],
          'kgHa',
        );

      const resumen = this.reportesService.generarResumenEjecutivo(
        datosCampo || [],
        datosTrilla || [],
        metadadatos,
      );

      console.log(`  ✅ Vista previa generada`);

      return {
        ensayoId,
        estadisticas,
        resumen,
        datosCampoCount: datosCampo?.length || 0,
        datosTrillaCount: datosTrilla?.length || 0,
        metadata: metadadatos,
      };
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error('❌ Error en vista previa:', errorMessage);
      console.error('Stack:', error.stack);
      return { error: 'Error al procesar datos', details: errorMessage };
    }
  }
}
