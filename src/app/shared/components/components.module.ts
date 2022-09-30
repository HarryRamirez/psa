import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {TranslateModule} from '@ngx-translate/core';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {NgSelectModule} from '@ng-select/ng-select';
import {HighchartsChartModule} from 'highcharts-angular';
// import {NgxUploaderModule} from 'ngx-uploader';

import {BasicComponentsModule} from '@shared/basic-components/basic-components.module';
import {DirectivesModule} from '@shared/directives/directives.module';
import {
  ActivationSwitchComponent,
  // FieldErrorComponent,
  HighchartComponent,
  // InfinitePaginatorComponent,
  ModalConfirmComponent,
  NoRecordsComponent,
  // PaginatorComponent,
  TreeComponent,
  // UploadFileComponent,
  // UploadGCSFileComponent,
  // UploadGCSMultipleFilesComponent,
  // SelectComponent
} from '.';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    TranslateModule,
    TooltipModule,
    NgSelectModule,
    // NgxUploaderModule,
    HighchartsChartModule,

    BasicComponentsModule,
    DirectivesModule,
  ],
  declarations: [
    ActivationSwitchComponent,
    // FieldErrorComponent,
    HighchartComponent,
    // InfinitePaginatorComponent,
    ModalConfirmComponent,
    NoRecordsComponent,
    // PaginatorComponent,
    TreeComponent,
    // UploadFileComponent,
    // UploadGCSFileComponent,
    // UploadGCSMultipleFilesComponent,
    //
    // SelectComponent
  ],
  exports: [
    ActivationSwitchComponent,
    // FieldErrorComponent,
    HighchartComponent,
    // InfinitePaginatorComponent,
    ModalConfirmComponent,
    NoRecordsComponent,
    // PaginatorComponent,
    TreeComponent,
    // UploadFileComponent,
    // UploadGCSFileComponent,
    // UploadGCSMultipleFilesComponent,
    //
    // SelectComponent
  ],
})
export class ComponentsModule {}
