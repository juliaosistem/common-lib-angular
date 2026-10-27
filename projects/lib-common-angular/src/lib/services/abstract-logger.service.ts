import { Injectable } from '@angular/core';

/** Logger del navegador; evita importar Winston/NestJS y sus transportes de archivos. */
@Injectable({ providedIn: 'root' })
export class AbstractLogger {
  logInfo(message: string, context: string): void {
    console.info(`[${context}] ${message}`);
  }

  logError(error: unknown, context: string): void {
    console.error(`[${context}]`, error instanceof Error ? error.message : 'Error de operación');
  }
}
