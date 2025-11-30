import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuConfig, MenuComponent } from "lib-common-angular";

@Component({
  selector: 'app-menu-demo-visual',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuComponent],
  template: `
    <div class="menu-demo-container">
      <h4>Vista previa del menú real:</h4>
      <div class="mock-menu-wrapper">
        <lib-menu 
          [menuConfig]="menuConfig" 
          [userPermissions]="userPermissions"
          class="demo-menu">
        </lib-menu>
      </div>
    </div>
  `,
  styles: [`
    .menu-demo-container {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 16px;
      margin: 16px 0;
      background: #f9f9f9;
      max-width: 300px;
      position: relative;
      overflow: hidden;
    }
    
    .mock-menu-wrapper {
      background: white;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      max-height: 400px;
      overflow-y: auto;
      position: relative;
      z-index: 1;
    }
    
    /* Aislar estilos del menú demo */
    .demo-menu {
      position: static !important;
      width: 100% !important;
      height: auto !important;
      box-shadow: none !important;
      border: none !important;
    }
    
    /* Evitar que afecte el layout principal */
    :host {
      contain: layout style;
      isolation: isolate;
    }
    
    /* Resetear cualquier posicionamiento absoluto del menú */
    .demo-menu ::ng-deep * {
      position: static !important;
    }
    
    .demo-menu ::ng-deep .layout-sidebar,
    .demo-menu ::ng-deep .sidebar {
      position: static !important;
      width: 100% !important;
      height: auto !important;
      transform: none !important;
    }
  `]
})
export class MenuDemoVisualComponent {
  @Input() menuConfig!: MenuConfig;
  @Input() userPermissions: string[] = [];
}