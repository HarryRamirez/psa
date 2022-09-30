import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BasicComponentsModule} from '@shared/basic-components/basic-components.module';
import {DirectivesModule} from '@shared/directives/directives.module';
import {ForgotPasswordService, LoginService} from './shared/services';
import {
  ForgotPasswordFormComponent,
  LoginButtonComponent,
  LoginFormComponent,
  SignUpFormComponent,
} from './shared/components';
import {
  Error403Component,
  Error404Component,
  Error500Component,
  LayoutComponent,
  LoginContainerComponent,
  SignUpContainerComponent,
  ForgotPasswordContainerComponent,
  MaintenanceComponent,
  RecoverComponent,
  MainComponent,
} from '.';
import {LayoutModule} from '@app/layout/layout.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    BasicComponentsModule,
    DirectivesModule,
    LayoutModule,
  ],
  declarations: [
    Error403Component,
    Error404Component,
    Error500Component,
    LayoutComponent,
    LoginContainerComponent,
    ForgotPasswordContainerComponent,
    SignUpContainerComponent,
    MaintenanceComponent,
    RecoverComponent,
    LoginButtonComponent,
    LoginFormComponent,
    ForgotPasswordFormComponent,
    SignUpFormComponent,
    MainComponent,
  ],
  exports: [],
  providers: [LoginService, ForgotPasswordService],
})
export class PagesModule {}
