import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem, MenuEvent } from '@juliaosistem/core-dtos';

@Component({
  selector: 'app-menu-item1',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu-item1.component.html',
  styleUrls: ['./menu-item1.component.scss']
})
export class MenuItem1Component implements OnInit {
  @Input() item!: MenuItem;
  @Input() showIcons: boolean = true;
  @Input() showBadges: boolean = true;
  @Input() collapsed: boolean = false;
  @Input() depth: number = 0;
  @Input() maxDepth: number = 3;
  @Input() activeItemId?: string;

  @Output() menuEvent = new EventEmitter<MenuEvent>();

  hasSubItems = false;

  ngOnInit() {
    this.hasSubItems = !!(this.item.items && this.item.items.length > 0);
  }

  getItemClasses(): string {
    const classes = ['menu-item'];
    
    if (this.item.disabled) {
      classes.push('menu-item-disabled');
    }
    
    if (this.activeItemId === this.item.id) {
      classes.push('menu-item-active');
    }
    
    if (this.item.class) {
      classes.push(this.item.class);
    }
    
    return classes.join(' ');
  }

  getLinkClasses(): string {
    const classes = [];
    
    if (this.item.disabled) {
      classes.push('menu-link-disabled');
    }
    
    return classes.join(' ');
  }

  getBadgeClasses(): string {
    const classes = ['badge'];
    
    if (this.item.badgeClass) {
      classes.push(this.item.badgeClass);
    } else {
      classes.push('badge-primary');
    }
    
    return classes.join(' ');
  }

  onItemClick(event: Event) {
    if (this.item.disabled) {
      return;
    }

    // Prevenir propagación del evento para evitar múltiples clicks
    event.stopPropagation();

    this.menuEvent.emit({
      type: 'click',
      item: this.item,
      event: event
    });
  }

  onItemHover(event: Event) {
    if (this.item.disabled) {
      return;
    }

    this.menuEvent.emit({
      type: 'hover',
      item: this.item,
      event: event
    });
  }

  onItemLeave(event: Event) {
    // Opcional: emitir evento de salida del hover
    if (this.item.disabled) {
      return;
    }
  }

  onSubMenuEvent(event: MenuEvent) {
    // Propagar eventos de submenús hacia arriba
    this.menuEvent.emit(event);
  }
} 