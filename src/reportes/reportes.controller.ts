import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Res,
  Body,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Optional,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { Response } from 'express';
import { ReportesService } from './reportes.service';
import { ImportacionReportesService } from './importacion-reportes.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../entities/rol.entity';

@ApiTags('reportes')
@ApiBearerAuth()
@Controller('reportes')
export class ReportesController {
  constructor(
    private readonly reportesService: ReportesService,
    @Optional()
    private readonly importacionService: ImportacionReportesService,
  ) {}

  @Get('ensayo/:ensayoId/pdf')
  @ApiOperation({ summary: 'Generar reporte PDF completo de un ensayo' })
  @ApiParam({ name: 'ensayoId', type: Number })
  async generarReportePdf(
    @Param('ensayoId', ParseIntPipe) ensayoId: number,
    @Res() res: Response,
  ) {
    try {
      console.log(`📄 Generando PDF para ensayo ${ensayoId}`);

      // Usar generarPDFEnsayo que obtiene TODOS los datos incluyendo larvas_porurf
      const buffer = await this.reportesService.generarPDFEnsayo(ensayoId);

      if (!buffer) {
        return res.status(404).json({ error: 'No se pudo generar el PDF' });
      }

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

  @Post('importar')
  @Roles(Role.TECNICO, Role.ADMIN, Role.SUPERADMIN)
  @UseInterceptors(FileInterceptor('archivo'))
  @ApiOperation({ summary: 'Importar mediciones desde un Excel generado por el sistema' })
  async importarExcel(@UploadedFile() archivo: Express.Multer.File, @Body('ensayoId') ensayoId?: string) {
    if (!archivo?.buffer) throw new BadRequestException('Debe adjuntar un archivo Excel');
    return this.importacionService.importar(archivo.buffer, ensayoId ? Number(ensayoId) : undefined);
  }

  @Get('ensayo/:ensayoId/xls')
  @ApiOperation({ summary: 'Generar reporte Excel COMPLETO de un ensayo (igual que PDF)' })
  @ApiParam({ name: 'ensayoId', type: Number })
  async generarReporteXls(
    @Param('ensayoId', ParseIntPipe) ensayoId: number,
    @Res() res: Response,
  ) {
    try {
      console.log(`📊 Generando Excel para ensayo ${ensayoId}`);

      // Usar el nuevo método que genera Excel COMPLETO como el PDF
      const buffer = await this.reportesService.generarExcelEnsayo(ensayoId);

      if (!buffer) {
        return res.status(404).json({ error: 'No se pudo generar el Excel' });
      }

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

}
