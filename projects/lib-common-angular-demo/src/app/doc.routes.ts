import { Routes } from '@angular/router';
import { CrudDocPageComponent } from './doc/crud/crud-doc-page.component';
import { TerminalDocPageComponent } from './doc/terminal/terminal-doc-page.component';
import { TablaDocPageComponent } from './doc/tabla/tabla-doc-page.component';
import { BotonesDocPageComponent } from './doc/botones/botones-doc-page.component';
import { CatalogoDocPageComponent } from './doc/catalogo/catalogo-doc-page.component';

export default [
   { path: 'catalogo', component: CatalogoDocPageComponent },
   { path: 'crud', component: CrudDocPageComponent },
   { path: 'terminal', component: TerminalDocPageComponent },
   { path: 'tabla', component: TablaDocPageComponent },
   { path: 'botones', component: BotonesDocPageComponent },
   { path: '', redirectTo: 'catalogo', pathMatch: 'full' }
] as Routes;
