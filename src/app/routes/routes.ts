import { Routes } from "@angular/router";
import { AuthPageGuardService } from "@shared/services";
import { LayoutComponent } from "../layout/layout.component";
import { EntidadComponent } from "../views/components/entidad/entidad.component";
import { FormDatosBasicosComponent } from "../views/components/entidad/form-datos-basicos/form-datos-basicos.component";
import { UbicacionComponent } from "@app/views/components/entidad/ubicacion/ubicacion.component";
import { BeneficiariosComponent } from "@app/views/components/entidad/beneficiarios/beneficiarios.component";
import { FinanciacionComponent } from "@app/views/components/entidad/financiacion/financiacion.component";
import { FinanciacionInversionComponent } from "@app/views/components/entidad/financiacion-inversion/financiacion-inversion.component";
import { AutoridadComponent } from "../views/components/autoridad/autoridad.component";
import { VerDetalleComponent } from "../views/components/ver-detalle/ver-detalle.component";
import { IncentivosAcuerdosComponent } from "@app/views/components/entidad/incentivos-acuerdos/incentivos-acuerdos.component";
import { AnexosComponent } from "@app/views/components/entidad/anexos/anexos.component";
import { ShapesComponent } from "@app/views/components/entidad/shapes/shapes.component";
import { HistorialProyectoComponent } from "../views/components/historial-proyecto/historial-proyecto.component";
import { VisorGeograficoComponent } from "../views/components/visor-geografico/visor-geografico.component";
import { RegisterPSAComponent } from "../views/components/register-psa/register-psa.component";

import {
  Error403Component,
  Error404Component,
  Error500Component,
  LayoutComponent as AuthLayoutComponent,
  LoginContainerComponent,
  ForgotPasswordContainerComponent,
  SignUpContainerComponent,
  MainComponent,
} from "@app/routes/pages";

export const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      { path: "", redirectTo: "inicio", pathMatch: "full" },
      {
        path: "inicio",
        loadChildren: () =>
          import("./home/home.module").then((m) => m.HomeModule),
      },
      {
        path: "develop",
        children: [
          {
            path: "crud",
            loadChildren: () =>
              import("./develop/users/users.module").then((m) => m.UsersModule),
          },
          {
            path: "translations",
            loadChildren: () =>
              import("./develop/translations/translations.module").then(
                (m) => m.TranslationsModule
              ),
          },
          {
            path: "notifications",
            loadChildren: () =>
              import("./develop/notifications/notifications.module").then(
                (m) => m.NotificationsModule
              ),
          },
          {
            path: "domains",
            loadChildren: () =>
              import("./develop/domains/domains.module").then(
                (m) => m.DomainsModule
              ),
          },
          {
            path: "forbidden-resource",
            loadChildren: () =>
              import(
                "./develop/forbidden-resource/forbidden-resource.module"
              ).then((m) => m.ForbiddenResourceModule),
          },
          {
            path: "charts",
            loadChildren: () =>
              import("./develop/charts/charts.module").then(
                (m) => m.ChartsModule
              ),
          },
        ],
      },
    ],
  },

  // Not lazy-loaded routes

  {
    path: "",
    component: AuthLayoutComponent,
    children: [
      {
        path: "ingresar",
        canActivate: [AuthPageGuardService],
        component: LoginContainerComponent,
      },
      {
        path: "registro1",
        canActivate: [AuthPageGuardService],
        component: SignUpContainerComponent,
      },
      {
        path: "olvido-contrasena",
        canActivate: [AuthPageGuardService],
        component: ForgotPasswordContainerComponent,
      },
      {
        path: "registrar",
        //canActivate: [AuthPageGuardService],
        component: RegisterPSAComponent,
      },
      {
        path: "principal",
        canActivate: [AuthPageGuardService],
        component: MainComponent,
      },
      {
        path: "proyectos",
        //canActivate: [AuthPageGuardService],
        component: EntidadComponent,
      },
      {
        path: "registrar-proyecto",
        // canActivate: [AuthPageGuardService],
        component: FormDatosBasicosComponent,
      },
      {
        path: ":idProyecto/ubicacion",
        // canActivate: [AuthPageGuardService],
        component: UbicacionComponent,
      },
      {
        path: ":idProyecto/beneficiarios",
        // canActivate: [AuthPageGuardService],
        component: BeneficiariosComponent,
      },
      {
        path: ":idProyecto/financiacion",
        // canActivate: [AuthPageGuardService],
        component: FinanciacionComponent,
      },
      {
        path: ":idProyecto/financiacion-inversion",
        // canActivate: [AuthPageGuardService],
        component: FinanciacionInversionComponent,
      },
      {
        path: ":idProyecto/incentivos",
        // canActivate: [AuthPageGuardService],
        component: IncentivosAcuerdosComponent,
      },
      {
        path: ":idProyecto/anexos",
        // canActivate: [AuthPageGuardService],
        component: AnexosComponent,
      },
      {
        path: ":idProyecto/shapes",
        component: ShapesComponent,
      },
      {
        path: "autoridad",
        // canActivate: [AuthPageGuardService],
        component: AutoridadComponent,
      },
      {
        path: "proyectos/buscar",
        // canActivate: [AuthPageGuardService],
        component: VisorGeograficoComponent,
      },
      {
        path: "proyectos/:idProyecto",
        // canActivate: [AuthPageGuardService],
        component: VerDetalleComponent,
      },
      {
        path: "proyectos/:idProyecto/historial",
        // canActivate: [AuthPageGuardService],
        component: HistorialProyectoComponent,
      },
      {
        path: ":idProyecto/registrar-proyecto",
        component: FormDatosBasicosComponent,
      },
      {
        path: ":idProyecto/financiacion",
        component: FinanciacionComponent,
      },
    ],
  },
  {
    path: "403",
    component: Error403Component,
  },
  {
    path: "500",
    component: Error500Component,
  },

  // Not found
  {
    path: "**",
    // redirectTo: '404',
    component: Error404Component,
  },
];
