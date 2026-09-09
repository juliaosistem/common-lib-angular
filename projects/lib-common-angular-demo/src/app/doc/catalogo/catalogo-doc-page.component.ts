import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PrimegModule, Terminal } from 'lib-common-angular';
import { CatalogDataItem, COMPONENT_CATALOG } from './catalog-data';

interface CatalogSection {
  key: string;
  title: string;
  items: CatalogDataItem[];
}

@Component({
  selector: 'app-catalogo-doc-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PrimegModule, Terminal],
  templateUrl: './catalogo-doc-page.component.html',
  styleUrl: './catalogo-doc-page.component.scss'
})
export class CatalogoDocPageComponent {
  searchTerm = '';
  scope = 'all';

  readonly allItems: CatalogDataItem[] = COMPONENT_CATALOG;
  readonly totalItems = this.allItems.length;
  readonly totalComponents = this.allItems.filter(item => !!item.selector).length;
  readonly totalServices = this.countByPath('/services/');
  readonly totalInterfaces = this.countByPath('/interfaces/');

  sections: CatalogSection[] = [];
  selectedItem: CatalogDataItem | null = null;
  selectedSnippet = '';

  constructor() {
    this.applyFilters();
  }

  setScope(scope: string) {
    this.scope = scope;
    this.applyFilters();
  }

  onSearchChange(term: string) {
    this.searchTerm = term || '';
    this.applyFilters();
  }

  selectItem(item: CatalogDataItem) {
    this.selectedItem = item;
    this.selectedSnippet = this.buildSnippet(item);
  }

  trackByPath(_: number, item: CatalogDataItem) {
    return item.path;
  }

  private countByPath(segment: string) {
    return this.allItems.filter(item => item.path.includes(segment)).length;
  }

  private applyFilters() {
    const filtered = this.allItems
      .filter(item => this.matchesScope(item))
      .filter(item => this.matchesSearch(item));

    this.sections = this.buildSections(filtered);
    const firstItem = this.sections[0]?.items[0] || null;
    this.selectedItem = firstItem;
    this.selectedSnippet = firstItem ? this.buildSnippet(firstItem) : '';
  }

  private matchesScope(item: CatalogDataItem) {
    if (this.scope === 'all') return true;
    return item.path.startsWith(`${this.scope}/`);
  }

  private matchesSearch(item: CatalogDataItem) {
    if (!this.searchTerm.trim()) return true;
    const value = `${item.path} ${item.className} ${item.selector}`.toLowerCase();
    return value.includes(this.searchTerm.toLowerCase());
  }

  private buildSections(items: CatalogDataItem[]) {
    const grouped = new Map<string, CatalogDataItem[]>();
    items.forEach(item => {
      const key = this.resolveSectionKey(item.path);
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)?.push(item);
    });

    return Array.from(grouped.entries())
      .map(([key, groupItems]) => ({ key, title: this.resolveSectionTitle(key), items: groupItems }))
      .sort((a, b) => a.title.localeCompare(b.title));
  }

  private resolveSectionKey(path: string) {
    const parts = path.split('/');
    return parts.slice(0, 2).join('/');
  }

  private resolveSectionTitle(key: string) {
    const titleMap: Record<string, string> = {
      'shared/atoms': 'Shared Atoms',
      'shared/molecules': 'Shared Molecules',
      'shared/pages': 'Shared Pages',
      'shared/services': 'Shared Services',
      'shared/interfaces': 'Shared Interfaces',
      'shared/terminal': 'Shared Terminal',
      'landingPages/atoms': 'Landing Ecommerce Atoms',
      'landingPages/molecules': 'Landing Ecommerce Molecules',
      'landingPages/pages': 'Landing Ecommerce Pages',
      'daskboards/daskboard1': 'Dashboard 1',
      'daskboards/daskboard2': 'Dashboard 2',
      'daskboards/daskboard3': 'Dashboard 3'
    };
    return titleMap[key] || key;
  }

  private buildSnippet(item: CatalogDataItem) {
    const importBlock = `import { ${item.className} } from 'lib-common-angular';`;
    if (!item.selector) return `${importBlock}\n\n// Tipo no visual (servicio/interfaz)`;
    if (item.selector.startsWith('[')) {
      return `${importBlock}\n\n<div ${item.selector.replace('[', '').replace(']', '')}></div>`;
    }
    return `${importBlock}\n\n<${item.selector}></${item.selector}>`;
  }
}
