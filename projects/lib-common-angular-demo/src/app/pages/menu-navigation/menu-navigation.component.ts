import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="menu-navigation">
      <h2>Navegación de Menús</h2>
      <p>Selecciona una ruta para ver diferentes configuraciones de menú:</p>
      
      <div class="navigation-buttons">
        <a routerLink="/" class="nav-button">
          <i class="pi pi-home"></i>
          <span>Menú por Defecto</span>
        </a>
        
        <a routerLink="/admin" class="nav-button">
          <i class="pi pi-cog"></i>
          <span>Menú de Administrador</span>
        </a>
        
        <a routerLink="/minimal" class="nav-button">
          <i class="pi pi-list"></i>
          <span>Menú Minimalista</span>
        </a>
        
        <a routerLink="/user" class="nav-button">
          <i class="pi pi-user"></i>
          <span>Menú de Usuario</span>
        </a>
        
        <a routerLink="/pages/crud" class="nav-button">
          <i class="pi pi-pencil"></i>
          <span>Página CRUD</span>
        </a>
       

        <a routerLink="/menu-demo" class="nav-button">
          <i class="pi pi-bars"></i>
          <span>Demo del Menú</span>
        </a>
        
        <a routerLink="/dashboard-demo" class="nav-button">
          <i class="pi pi-chart-line"></i>
          <span>Demo del Dashboard</span>
        </a>
      </div>
      
      <div class="info-panel">
        <h3>Información de Configuración</h3>
        <p><strong>Ruta actual:</strong> {{ currentRoute }}</p>
        <p><strong>Configuración de menú:</strong> Se carga automáticamente desde los datos de la ruta</p>
        <p><strong>Permisos:</strong> Se aplican según el tipo de usuario</p>
      </div>
    </div>
  `,
  styles: [`
    .menu-navigation {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }
    
    h2 {
      color: #495057;
      margin-bottom: 1rem;
    }
    
    .navigation-buttons {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin: 2rem 0;
    }
    
    .nav-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      background: #ffffff;
      border: 1px solid #dee2e6;
      border-radius: 0.5rem;
      text-decoration: none;
      color: #495057;
      transition: all 0.2s ease;
    }
    
    .nav-button:hover {
      background: #f8f9fa;
      border-color: #3b82f6;
      color: #3b82f6;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    .nav-button i {
      font-size: 1.2rem;
    }
    
    .info-panel {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 0.5rem;
      margin-top: 2rem;
    }
    
    .info-panel h3 {
      color: #495057;
      margin-bottom: 1rem;
    }
    
    .info-panel p {
      margin: 0.5rem 0;
      color: #6c757d;
    }
    
    .info-panel strong {
      color: #495057;
    }
  `]
})
export class MenuNavigationComponent {
  currentRoute = window.location.pathname;
} 