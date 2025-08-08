import { Component, ElementRef, Input } from '@angular/core';
import { AppMenu } from './app.menu';
import { MenuConfig } from '../../../shared/interfaces/menu.interface';

@Component({
    selector: 'lib-sidebar',
    standalone: true,
    imports: [AppMenu],
    template: ` <div class="layout-sidebar">
        <app-menu [menuConfig]="menuConfig" [userPermissions]="userPermissions"></app-menu>
    </div>`
})
export class AppSidebar {
    @Input() menuConfig?: MenuConfig;
    @Input() userPermissions: string[] = ['admin.users.read', 'admin.settings.read', 'pages.crud.read'];

    constructor(public el: ElementRef) {}
}
