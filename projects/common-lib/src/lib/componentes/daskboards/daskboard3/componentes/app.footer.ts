import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'lib-footer3',
    template: `<div class="layout-footer">
        SAKAI by
        <a href="https://primeng.org" target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">PrimeNG</a>
    </div>`
})
export class AppFooter {}
