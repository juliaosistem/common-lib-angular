import { Component, Renderer2, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule, ActivatedRoute } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AppTopbar } from './moleculas/app.topbar';
import { AppFooter } from './moleculas/app.footer';
import { LayoutService } from '../../shared/services/layout.service';
import { MenuConfig } from '@juliaosistem/core-dtos';
import { MenuComponent } from "./moleculas/menu/menu.component";

@Component({
    selector: 'lib-daskboard3',
    standalone: true,
    imports: [CommonModule, AppTopbar, RouterModule, AppFooter,  MenuComponent],
    template: `<div class="layout-wrapper" [ngClass]="containerClass">
        <lib-topbar3></lib-topbar3>
        <lib-menu [menuConfig]="menuConfig" [userPermissions]="userPermissions"></lib-menu>
        <div class="layout-main-container">
            <div class="layout-main">
                <router-outlet></router-outlet>
            </div>
            <lib-footer3></lib-footer3>
        </div>
        <div class="layout-mask animate-fadein"></div>
    </div> `
})
export class DaskBoard3 implements OnInit {
    @Input() menuConfig?: MenuConfig;
    @Input() userPermissions: string[] = ['admin.users.read', 'admin.settings.read', 'pages.crud.read'];
    
    overlayMenuOpenSubscription: Subscription;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    menuOutsideClickListener: any;



    constructor(
        public layoutService: LayoutService,
        public renderer: Renderer2,
        public router: Router,
        private route: ActivatedRoute
    ) {
        this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
            if (!this.menuOutsideClickListener) {
                this.menuOutsideClickListener = this.renderer.listen('document', 'click', (event) => {
                    if (this.isOutsideClicked(event)) {
                        this.hideMenu();
                    }
                });
            }

            if (this.layoutService.layoutState().staticMenuMobileActive) {
                this.blockBodyScroll();
            }
        });

        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
            this.hideMenu();
        });
    }

    ngOnInit() {
        // Leer datos de la ruta y permitir que sobrescriban los inputs si vienen definidos en la ruta
        this.route.data.subscribe(data => {
            if (data['menuConfig']) {
                this.menuConfig = data['menuConfig'];
                // eslint-disable-next-line no-console
                console.log('Dashboard3: MenuConfig cargado desde datos de ruta:', this.menuConfig);
            }
            
            if (data['userPermissions']) {
                this.userPermissions = data['userPermissions'];
                console.log('Dashboard3: UserPermissions cargados desde datos de ruta:', this.userPermissions);
            }
        });

        // Listener explícito para cerrar al hacer click en la máscara en móviles
        const maskEl = document.querySelector('.layout-mask');
        if (maskEl) {
            this.renderer.listen(maskEl, 'click', () => this.hideMenu());
        }

        // Si no se proporciona menuConfig, usar configuración por defecto
        if (!this.menuConfig) {
            console.warn('Dashboard3: No se proporcionó menuConfig, usando configuración por defecto');
        }
    }

    isOutsideClicked(event: MouseEvent) {
        const sidebarEl = document.querySelector('.layout-sidebar');
        const topbarEl = document.querySelector('.layout-menu-button');
        const eventTarget = event.target as Node;

        return !(sidebarEl?.isSameNode(eventTarget) || sidebarEl?.contains(eventTarget) || topbarEl?.isSameNode(eventTarget) || topbarEl?.contains(eventTarget));
    }

    hideMenu() {
        this.layoutService.layoutState.update((prev) => ({ ...prev, overlayMenuActive: false, staticMenuMobileActive: false, menuHoverActive: false }));
        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
            this.menuOutsideClickListener = null;
        }
        this.unblockBodyScroll();
    }

    blockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        } else {
            document.body.className += ' blocked-scroll';
        }
    }

    unblockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        } else {
            document.body.className = document.body.className.replace(new RegExp('(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    get containerClass() {
        return {
            'layout-wrapper': true,
            'layout-overlay': this.layoutService.layoutConfig().menuMode === 'overlay',
            'layout-static': this.layoutService.layoutConfig().menuMode === 'static',
            'layout-static-inactive': this.layoutService.layoutState().staticMenuDesktopInactive && this.layoutService.layoutConfig().menuMode === 'static',
            'layout-overlay-active': this.layoutService.layoutState().overlayMenuActive,
            'layout-mobile-active': this.layoutService.layoutState().staticMenuMobileActive
        };
    }

    ngOnDestroy() {
        if (this.overlayMenuOpenSubscription) {
            this.overlayMenuOpenSubscription.unsubscribe();
        }

        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
        }
    }
}
