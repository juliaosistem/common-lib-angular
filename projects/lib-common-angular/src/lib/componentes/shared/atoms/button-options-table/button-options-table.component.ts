import { Component, OnInit } from '@angular/core';
import { PrimegModule } from '../../../../modulos/primeg.module';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'lib-button-options-table',
  imports: [PrimegModule, FormsModule],
  templateUrl: './button-options-table.component.html',
  styleUrl: './button-options-table.component.scss'
})
export class ButtonOptionsTableComponent implements OnInit {
      items: MenuItem[] | undefined;

ngOnInit() {
        this.items = [
            {
                label: 'Search',
                icon: 'pi pi-search'
            },
            {
                separator: true
            },
            {
                label: 'Share',
                icon: 'pi pi-share-alt',
                items: [
                    {
                        label: 'Slack',
                        icon: 'pi pi-slack'
                    },
                    {
                        label: 'Whatsapp',
                        icon: 'pi pi-whatsapp'
                    }
                ]
            }
        ]
    }
}
