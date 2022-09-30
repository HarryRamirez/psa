import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { switchMap } from "rxjs/operators";
import { EntidadService } from "@app/shared/services/entidad.service";
import { ProyectoService } from "@app/shared/services/proyecto.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-incentivos-acuerdos",
  templateUrl: "./incentivos-acuerdos.component.html",
  styleUrls: ["./incentivos-acuerdos.component.scss"],
})
export class IncentivosAcuerdosComponent implements OnInit {
  listMetodosEstimacion: any[] = [];
  listMetodosPago: any[] = [];
  listPeriodicidadesPago: any[] = [];
  listTiposAcuerdos: any[] = [];

  datosFuenteHTML: any = {
    beneficiado_directo_psa: "",
    area_predio_ecosistema_psa: "",
    metodo_estimacion_valor_incentivo: "",
    traduccion_metodo_estimacion: "",
    otro_metodo_estimacion: "",
    metodo_pago_psa: "",
    traduccion_metodo_pago: "",
    periodicidad_pago_psa: "",
    traduccion_periodicidad_pago: "",
    otra_periodicidad_psa: "",
    termino_duracion_acuerdo: "",
    tipos_acuerdo_psa: "",
    traduccion_tipos_acuerdo: "",
    num_acuerdo_celebrado: "",
    proyecto_id: localStorage.getItem("proyecto_id"),
    _method: "PUT",
  };
  idProyecto: string = localStorage.getItem("proyecto_id");

  constructor(
    private entidadService: EntidadService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private proyectoService: ProyectoService
  ) {}

  ngOnInit(): void {
    const proyecto = this.proyectoService;

    this.activatedRoute.params.subscribe(({ idProyecto }) => {
      if (idProyecto) {
        this.idProyecto = idProyecto;
        this.activatedRoute.params
          .pipe(
            switchMap(({ idProyecto }) => proyecto.getProjectData(idProyecto))
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
            this.datosFuenteHTML = respuesta.proyecto.incentivo_acuerdos;
            this.datosFuenteHTML.proyecto_id = idProyecto;
            this.datosFuenteHTML._method = "PUT";
          });
      }
    });

    this.entidadService.getIncentivosAcuerdos().subscribe((data: any) => {
      this.listMetodosEstimacion = data.enumeraciones.metodos_estimacion;
      this.listMetodosPago = data.enumeraciones.metodos_pago;
      this.listPeriodicidadesPago = data.enumeraciones.periodicidades_pago;
      this.listTiposAcuerdos = data.enumeraciones.tipos_acuerdo;
    });
  }

  saveIncentivosAcuerdos() {
    this.entidadService.saveIncentivosAcuerdos(this.datosFuenteHTML).subscribe(
      (data: any) => {
        if (data.success) {
          this.router.navigate([`${data.details.proyecto_id}/anexos/`]);
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
