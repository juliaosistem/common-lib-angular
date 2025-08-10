import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuConfig, MenuEvent } from '../../../../shared/interfaces/menu.interface';
import { MenuComponent } from '../../../../shared/pages/menu/menu.component';
import { DynamicMenuService } from '../../../../shared/services/dynamic-menu.service';
import { DASHBOARD3_MENU_CONFIG } from '../../componentes/dashboard3-menu.config';

@Component({
    selector: 'lib-menu3',
    standalone: true,
    imports: [CommonModule, RouterModule, MenuComponent],
    templateUrl: './menu3.component.html',
    styleUrls: ['./menu3.component.scss'],
})
export class LibMenu3 implements OnInit {
    
    @Input() menuConfig?: MenuConfig;
    @Input() userPermissions: string[] = ['admin.users.read', 'admin.settings.read', 'pages.crud.read'];
    
    menuId = 'dashboard3-menu';

    constructor(private menuService: DynamicMenuService) {}

    ngOnInit() {
        // Usar la configuración proporcionada o la configuración por defecto
        if (this.menuConfig) {
            this.menuId = this.menuConfig.id || 'dashboard3-menu';
        }
        
        // Inicializar el menú dinámico
        this.initializeDynamicMenu();
    }

    private initializeDynamicMenu() {
        // Configurar el menú dinámico para el dashboard3
        this.menuService.updateMenuConfig(this.menuId, this.menuConfig!);
    }

    onMenuEvent(event: MenuEvent) {
        // Manejar eventos del menú del dashboard
        console.log('Dashboard Menu Event:', event);
    }

    onMenuLoaded(config: MenuConfig) {
        console.log('Dashboard Menu Loaded:', config);
    }

    onMenuError(error: string) {
        console.error('Dashboard Menu Error:', error);
    }
}
