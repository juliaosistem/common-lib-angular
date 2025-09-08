import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

import { ExcelExportConfig } from '@juliaosistem/core-dtos'; // Assuming you have a model for the config

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {

  constructor(private messageService: MessageService) {}

  async exportToExcel(config: ExcelExportConfig): Promise<void> {
    if (!config.data?.length) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Data',
        detail: 'No data available to export',
        life: 3000,
      });
      return;
    }

    await this.performExcelExport(config);
  }

  private async performExcelExport(config: ExcelExportConfig): Promise<void> {
    try {
      const XLSX = await import('xlsx');
      const exportData = this.prepareDataForExport(config);
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Data');
      
      const fileName = this.generateFileName(config.fileName);
      XLSX.writeFile(wb, fileName);
      
      this.messageService.add({
        severity: 'success',
        summary: 'Export Successful',
        detail: `Data exported to ${fileName}`,
        life: 3000,
      });
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: 'Export Failed',
        detail: 'Could not load Excel export library',
        life: 3000,
      });
    }
  }

  private prepareDataForExport(config: ExcelExportConfig): Record<string, unknown>[] {
    return config.data.map(item => {
      const exportItem: Record<string, unknown> = {};
      const fields = config.fieldOrder.length ? config.fieldOrder : 
                    Object.keys(item).filter(key => !config.excludeFields.includes(key));
      
      fields.forEach(field => {
        const label = config.fieldLabels[field] || field;
        const value = item[field];
        exportItem[label] = this.formatValue(value);
      });
      
      return exportItem;
    });
  }

  private formatValue(value: unknown): string | number | boolean | null {
    if (value === null || value === undefined) return null;
    if (typeof value === 'boolean' || typeof value === 'number') return value;
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'object') return JSON.stringify(value);
    if (value instanceof Date) return value.toLocaleDateString();
    return String(value);
  }

  private generateFileName(customFileName?: string): string {
    const dateSuffix = new Date().toISOString().split('T')[0];
    return `${customFileName || 'export'}_${dateSuffix}.xlsx`;
  }
}
