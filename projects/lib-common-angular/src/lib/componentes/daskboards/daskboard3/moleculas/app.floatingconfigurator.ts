import { Component, computed, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../../../../services/layout.service';

@Component({
    selector: 'app-floating-configurator',
    imports: [ButtonModule, AppConfigurator],
    standalone:true,
    template: `
        <div class="fixed flex gap-4 top-8 right-8">
            <p-button type="button" (onClick)="toggleDarkMode()" [rounded]="true" [icon]="isDarkTheme() ? 'pi pi-moon' : 'pi pi-sun'" severity="secondary" />
            <div class="relative" #configMenuContainer>
                <p-button icon="pi pi-palette" type="button" rounded (onClick)="toggleConfigMenu($event)" />
                <app-configurator [class.hidden]="!isConfigMenuOpen" />
            </div>
        </div>
    `
})
export class AppFloatingConfigurator {
    LayoutService = inject(LayoutService);

    @ViewChild('configMenuContainer') configMenuContainer?: ElementRef<HTMLElement>;

    isConfigMenuOpen = false;

    isDarkTheme = computed(() => this.LayoutService.layoutConfig().darkTheme);

    toggleDarkMode() {
        this.LayoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    toggleConfigMenu(event: Event) {
        event.stopPropagation();
        this.isConfigMenuOpen = !this.isConfigMenuOpen;
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: Event) {
        if (!this.isConfigMenuOpen) {
            return;
        }

        const target = event.target as Node | null;
        const container = this.configMenuContainer?.nativeElement;
        if (target && container && !container.contains(target)) {
            this.isConfigMenuOpen = false;
        }
    }
}
