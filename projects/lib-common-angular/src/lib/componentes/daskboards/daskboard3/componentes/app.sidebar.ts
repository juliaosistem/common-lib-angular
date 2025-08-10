import { Component, ElementRef, Input } from '@angular/core';
import { LibMenu3 } from '../moleculas/menu/menu3.component';
import { MenuConfig } from '../../../shared/interfaces/menu.interface';

@Component({
    selector: 'lib-sidebar',
    standalone: true,
    imports: [LibMenu3],
    template: ` <div class="layout-sidebar">
        <lib-menu3 [menuConfig]="menuConfig" [userPermissions]="userPermissions"></lib-menu3>
    </div>`
})
export class AppSidebar {
    @Input() menuConfig?: MenuConfig;
    @Input() userPermissions: string[] = ['admin.users.read', 'admin.settings.read', 'pages.crud.read'];

    constructor(public el: ElementRef) {}
}
