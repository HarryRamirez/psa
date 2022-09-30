import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"; // this is needed!
import { HttpClientModule } from "@angular/common/http";
// import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import { BrowserModule } from "@angular/platform-browser";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FilePondModule, registerPlugin } from "ngx-filepond";
import * as FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import * as FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";

import { CoreModule } from "./core/core.module";
import { LayoutModule } from "./layout/layout.module";
import { RoutesModule } from "./routes/routes.module";
import { InitModule } from "@app/init/init.module";
import { PagesModule } from "@app/routes/pages/pages.module";
import { AppComponent } from "./app.component";
import {
  NgbdSortableHeader,
  EntidadComponent,
} from "./views/components/entidad/entidad.component";
import { FormDatosBasicosComponent } from "./views/components/entidad/form-datos-basicos/form-datos-basicos.component";
import { UbicacionComponent } from "./views/components/entidad/ubicacion/ubicacion.component";
import { BeneficiariosComponent } from "./views/components/entidad/beneficiarios/beneficiarios.component";
import { FinanciacionComponent } from "./views/components/entidad/financiacion/financiacion.component";
import { FinanciacionInversionComponent } from "./views/components/entidad/financiacion-inversion/financiacion-inversion.component";
import { AutoridadComponent } from "./views/components/autoridad/autoridad.component";
import { VerDetalleComponent } from "./views/components/ver-detalle/ver-detalle.component";
import { ComentariosComponent } from "./views/components/comentarios/comentarios.component";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { IncentivosAcuerdosComponent } from "./views/components/entidad/incentivos-acuerdos/incentivos-acuerdos.component";
import { AnexosComponent } from "./views/components/entidad/anexos/anexos.component";
import { HistorialProyectoComponent } from "./views/components/historial-proyecto/historial-proyecto.component";
import { VisorGeograficoComponent } from "./views/components/visor-geografico/visor-geografico.component";
import { AccordionModule } from "ngx-bootstrap/accordion";
import { NgxSliderModule } from "@angular-slider/ngx-slider";
import { TabsModule } from "ngx-bootstrap/tabs";
import { ExtensionPipe } from "./shared/pipes/extension.pipe";
import { ShapesComponent } from "./views/components/entidad/shapes/shapes.component";
import { VisorComponent } from "./views/components/visor/visor.component";
import { UploadLocalFileComponent } from "./views/components/upload-local-file/upload-local-file.component";
import { FilterIntersectionPipe } from "./shared/pipes/filter-intersection.pipe";
import { RegisterPSAComponent } from './views/components/register-psa/register-psa.component';

registerPlugin(FilePondPluginFileValidateType, FilePondPluginFileValidateSize);

@NgModule({
  declarations: [
    AppComponent,
    EntidadComponent,
    NgbdSortableHeader,
    FormDatosBasicosComponent,
    UbicacionComponent,
    BeneficiariosComponent,
    FinanciacionComponent,
    FinanciacionInversionComponent,
    AutoridadComponent,
    VerDetalleComponent,
    ComentariosComponent,
    IncentivosAcuerdosComponent,
    AnexosComponent,
    HistorialProyectoComponent,
    VisorGeograficoComponent,
    ExtensionPipe,
    FilterIntersectionPipe,
    ShapesComponent,
    VisorComponent,
    UploadLocalFileComponent,
    RegisterPSAComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserAnimationsModule, // required for ng2-tag-input
    InitModule,
    BrowserModule,
    CoreModule,
    FilePondModule,
    LayoutModule,
    RoutesModule,
    PagesModule,
    NgbModule,
    FormsModule,
    CollapseModule.forRoot(),
    BsDropdownModule.forRoot(),
    ReactiveFormsModule,
    AccordionModule.forRoot(),
    NgxSliderModule,
    TabsModule.forRoot(),
  ],
  exports: [EntidadComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}

// providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
