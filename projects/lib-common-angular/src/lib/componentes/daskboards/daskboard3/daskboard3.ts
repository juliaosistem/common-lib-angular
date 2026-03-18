import { Component, Renderer2, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule, ActivatedRoute } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AppTopbar } from './moleculas/app.topbar';
import { AppFooter } from './moleculas/app.footer';
import { LayoutService } from '../../../services/layout.service';
import { MenuConfig } from '@juliaosistem/core-dtos';
import { MenuComponent } from "./moleculas/menu/menu.component";

@Component({
    selector: 'lib-daskboard3',
    standalone: true,
    imports: [CommonModule, AppTopbar, RouterModule, AppFooter,  MenuComponent],
    template: `<div class="db3-wrapper layout-wrapper" [ngClass]="containerClass">
        <lib-topbar3></lib-topbar3>
                <lib-menu
                    [menuConfig]="menuConfig"
                    [userPermissions]="userPermissions"
                    [class.db3-menu-hidden]="!isSidebarVisible"
                ></lib-menu>
        <div class="db3-main-container layout-main-container flex flex-column justify-content-between"
             [ngClass]="mainContainerClass">
            <div class="db3-main layout-main flex-1">
                <router-outlet></router-outlet>
            </div>
            <lib-footer3></lib-footer3>
        </div>
        <div class="db3-mask layout-mask animate-fadein" [ngClass]="{'db3-mask--active': isMaskVisible}" (click)="hideMenu()"></div>
    </div> `,
    styles: [`
        :host {
            display: block;
            width: 100%;
            max-width: 100%;
            overflow-x: hidden;
        }

        .db3-wrapper {
            min-height: 100vh;
            position: relative;
            max-width: 100%;
            overflow-x: hidden;
        }

        .db3-main-container {
            min-height: 100vh;
            width: auto;
            max-width: 100%;
            box-sizing: border-box;
            padding: 6rem 2rem 0 2rem;
            transition: margin-left var(--layout-section-transition-duration, 0.2s);
            overflow-x: hidden;
        }

        .db3-main-container--static { margin-left: 22rem; }
        .db3-main-container--static-inactive { margin-left: 0; padding-left: 2rem; }
        .db3-main-container--overlay { margin-left: 0; padding-left: 2rem; }

        .db3-main {
            flex: 1 1 auto;
            padding-bottom: 2rem;
            max-width: 100%;
            overflow-x: hidden;
        }

        .db3-menu-hidden {
            display: none !important;
        }

        .db3-mask {
            display: none;
            position: fixed;
            top: 0; left: 0;
            z-index: 998;
            width: 100%; height: 100%;
            background-color: var(--maskbg, rgba(0,0,0,.4));
        }
        .db3-mask--active { display: block; }

        @media (max-width: 991px) {
            .db3-main-container {
                margin-left: 0 !important;
                padding-left: 1rem;
                padding-right: 1rem;
            }
            .db3-mask { display: none; }
        }

        @media (max-width: 575px) {
            .db3-main-container {
                padding-left: 0.75rem;
                padding-right: 0.75rem;
            }
        }
    `]
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

        // Si no se proporciona menuConfig, usar configuración por defecto
        if (!this.menuConfig) {
            console.warn('Dashboard3: No se proporcionó menuConfig, usando configuración por defecto');
        }
    }

    isOutsideClicked(event: MouseEvent) {
        const sidebarEl = document.querySelector('.layout-sidebar');
        const topbarEl = document.querySelector('.layout-menu-button, .db3-menu-button');
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
            'layout-overlay': this.layoutService.layoutConfig().menuMode === 'overlay',
            'layout-static': this.layoutService.layoutConfig().menuMode === 'static',
            'layout-static-inactive': this.layoutService.layoutState().staticMenuDesktopInactive && this.layoutService.layoutConfig().menuMode === 'static',
            'layout-overlay-active': this.layoutService.layoutState().overlayMenuActive,
            'layout-mobile-active': this.layoutService.layoutState().staticMenuMobileActive
        };
    }

    get mainContainerClass() {
        const mode = this.layoutService.layoutConfig().menuMode;
        const state = this.layoutService.layoutState();
        return {
            'db3-main-container--overlay': mode === 'overlay',
            'db3-main-container--static': mode === 'static' && !state.staticMenuDesktopInactive,
            'db3-main-container--static-inactive': mode === 'static' && state.staticMenuDesktopInactive
        };
    }

    get isMaskVisible(): boolean {
        return !!this.layoutService.layoutState().staticMenuMobileActive;
    }

    get isSidebarVisible(): boolean {
        if (this.layoutService.isMobile()) {
            return !!this.layoutService.layoutState().staticMenuMobileActive;
        }
        return !this.layoutService.layoutState().staticMenuDesktopInactive;
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
