import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error interno del servidor';
    let error: any = {};

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        error = exceptionResponse;
        message =
          (exceptionResponse as any).message || exception.message || message;
      } else {
        message = exceptionResponse.toString();
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      error = { name: exception.name, message: exception.message };
      this.logger.error(exception.stack);
    } else {
      // Caso extremo: exception no es ni HttpException ni Error
      message = 'Error desconocido';
      error = { raw: String(exception) };
      this.logger.error('Exception desconocida:', exception);
    }

    // Loguear el error
    this.logger.error({
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      status,
      message,
      error,
    });

    // Asegurar que la respuesta siempre sea JSON válido
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message || 'Error desconocido',
      error: error || {},
    };

    // Enviar respuesta JSON válida
    response.status(status).json(errorResponse);
  }
}

