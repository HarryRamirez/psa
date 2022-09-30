import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { switchMap } from "rxjs/operators";
import { ProyectoService } from "@app/shared/services/proyecto.service";
import { EntidadService } from "@app/shared/services/entidad.service";
import Swal from "sweetalert2";

interface Beneficiario {
  total_familias: number;
  num_familias_beneficiadas_campesina: string;
  num_familias_beneficiadas_indigena: string;
  num_familias_beneficiadas_afro: string;
  num_familias_beneficiadas_otras: string;
  num_hombres_beneficiados: string;
  num_mujeres_beneficiadas: string;
  nivel_ingreso_promedio_familia: string;
}

@Component({
  selector: "app-beneficiarios",
  templateUrl: "./beneficiarios.component.html",
})
export class BeneficiariosComponent implements OnInit {
  @ViewChild("formBeneficiarios") formBeneficiarios!: NgForm;
  editProyectoMode: boolean = false;

  listNivelesIngreso: any[] = [];

  datoAgregar: Beneficiario = {
    total_familias: 0,
    num_familias_beneficiadas_campesina: "",
    num_familias_beneficiadas_indigena: "",
    num_familias_beneficiadas_afro: "",
    num_familias_beneficiadas_otras: "",
    num_hombres_beneficiados: "",
    num_mujeres_beneficiadas: "",
    nivel_ingreso_promedio_familia: "",
  };

  total_familias_ubicacion: number = Number(
    localStorage.getItem("total_familias_beneficiadas")
  );

  enviarDatosBeneficiarios: any = {
    proyecto_id: localStorage.getItem("proyecto_id"),
  };
  idProyecto: string = "";

  setTotalFamilias(): void {
    this.datoAgregar.total_familias =
      Number(this.datoAgregar.num_familias_beneficiadas_campesina) +
      Number(this.datoAgregar.num_familias_beneficiadas_indigena) +
      Number(this.datoAgregar.num_familias_beneficiadas_afro) +
      Number(this.datoAgregar.num_familias_beneficiadas_otras);
  }

  guardarBeneficiarios() {
    Object.assign(this.enviarDatosBeneficiarios, this.datoAgregar);

    if (this.total_familias_ubicacion != this.datoAgregar.total_familias) {
      Swal.fire({
        title: "Advertencia",
        text: 'Revise el número de familias agregadas en la etapa "Ubicación" ya que la sumatoria no concuerda con los números registrados en las familias beneficiarias campesinas y/o indígenas y/o afrodescendientes',
        icon: "warning",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    this.entidadService
      .addBeneficiarios(this.enviarDatosBeneficiarios)
      .subscribe((resp: any) => {
        if (resp.success) {
          this.formBeneficiarios.resetForm();
          this.router.navigate([
            `${resp.details.proyecto_id}/financiacion-inversion/`,
          ]);
        } else {
          Swal.fire({
            title: "Error",
            text: "Ocurrió un error al guardar los datos",
            icon: "error",
            confirmButtonText: "Aceptar",
          });
        }
      });
  }

  checkFormStatus(): any {
    if (this.formBeneficiarios?.valid) {
      if (!this.formBeneficiarios?.pristine) {
        return this.guardarBeneficiarios();
      } else {
        return this.router.navigate([
          `${this.idProyecto}/financiacion-inversion`,
        ]);
      }
    }
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private proyectoService: ProyectoService,
    private entidadService: EntidadService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ idProyecto }) => {
      if (idProyecto) {
        this.idProyecto = idProyecto;
        this.activatedRoute.params
          .pipe(
            switchMap(({ idProyecto }) =>
              this.proyectoService.getProjectData(idProyecto)
            )
          )
          .subscribe((respuesta: any) => {
            if (respuesta.proyecto.datos_basicos.etapa !== "inversion") {
              Swal.fire({
                title: "Error",
                text: "Éste proyecto no se encuentra en la etapa de Inversión",
                icon: "error",
                confirmButtonText: "Aceptar",
              });
              this.router.navigate(["/proyectos"]);
            }
            let total_familias_beneficiadas = respuesta.proyecto.ubicaciones
              .map((data) => data.num_familias_beneficiadas)
              .reduce((a, b) => a + b, 0);
            if (
              respuesta.proyecto.beneficiarios ||
              total_familias_beneficiadas > 0
            ) {
              this.editProyectoMode = true;
              this.datoAgregar = respuesta.proyecto.beneficiarios;
              this.total_familias_ubicacion =
                total_familias_beneficiadas || this.datoAgregar.total_familias;
              this.enviarDatosBeneficiarios.proyecto_id = respuesta.proyecto.id;
              this.setTotalFamilias();
            }
          });
      }
    });

    this.entidadService.getNivelesIngreso().subscribe((resp: any) => {
      this.listNivelesIngreso = resp.enumeraciones.niveles_ingreso;
    });
  }
}
