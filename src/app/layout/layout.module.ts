import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';

import {TranslateModule} from '@ngx-translate/core';
import {TabsModule} from 'ngx-bootstrap/tabs';

import {LayoutComponent} from './layout.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {HeaderComponent} from './header/header.component';
import {NavsearchComponent} from './header/navsearch/navsearch.component';
import {OffsidebarComponent} from './offsidebar/offsidebar.component';
import {UserblockComponent} from './sidebar/userblock/userblock.component';
import {UserblockService} from './sidebar/userblock/userblock.service';
import {FooterComponent} from './footer/footer.component';
import {BodyComponent} from './body/body.component';
import {HeaderProyectosComponent} from './header/header-proyectos/header-proyectos.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TranslateModule,
    TabsModule,
  ],
  declarations: [
    LayoutComponent,
    SidebarComponent,
    UserblockComponent,
    HeaderComponent,
    NavsearchComponent,
    OffsidebarComponent,
    FooterComponent,
    BodyComponent,
    HeaderProyectosComponent,
  ],
  exports: [
    LayoutComponent,
    SidebarComponent,
    UserblockComponent,
    HeaderComponent,
    NavsearchComponent,
    OffsidebarComponent,
    FooterComponent,
    BodyComponent,
    HeaderProyectosComponent,
  ],
  providers: [UserblockService],
})
export class LayoutModule {}
