import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { switchMap } from "rxjs/operators";
import { ProyectoService } from "@app/shared/services/proyecto.service";
import { EntidadService } from "@app/shared/services/entidad.service";
import Swal from "sweetalert2";
// import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

interface Municipio {
  departamento: string;
  municipio: string;
  cod_departamento: string;
  cod_municipio: string;
  area_psa_preservacion: string;
  area_psa_restauracion: string;
  hectareas_psa: string;
  num_familias_beneficiadas: string;
  costo_oportunidad: string;
  valor_incentivo_psa: string;
}

@Component({
  selector: "app-ubicacion",
  templateUrl: "./ubicacion.component.html",
  styleUrls: ["./ubicacion.component.scss"],
})
export class UbicacionComponent implements OnInit {
  @ViewChild("formUbicacion") formUbicacion!: NgForm;

  etapaProyecto: string = localStorage.getItem("etapaProyecto");
  listaDepartamentos: any[] = [];
  listaMunicipios: any[] = [];
  municipiosAgregados: any[] = [];
  municipios_y_datos_Agregados: any[] = [];
  codmunicipiosAgregados: string[] = [];
  codDepartamentosAgregados: string[] = [];
  municipioSelected: string = "";
  departamentoSelected: string = "";
  num_familias_beneficiadas_array: number[] = [];

  proyecto: any = {};
  idProyecto: string = "";
  displaySpanError: boolean = false;

  datoAgregar: Municipio = {
    departamento: "",
    municipio: "",
    cod_departamento: "",
    cod_municipio: "",
    area_psa_preservacion: "",
    area_psa_restauracion: "",
    hectareas_psa: "",
    num_familias_beneficiadas: "",
    costo_oportunidad: "",
    valor_incentivo_psa: "",
  };

  setTotalHectareasPSA() {
    this.datoAgregar.hectareas_psa =
      this.datoAgregar.area_psa_preservacion +
      this.datoAgregar.area_psa_restauracion;
  }

  validarNumeros($event) {
    if ($event.keyCode < 48 || $event.keyCode > 57) {
      $event.preventDefault();
    }
  }

  changeDepto(event) {
    let selectedIndex: number = event.target["selectedIndex"];
    let depto = event.target.options[selectedIndex].value;
    let nombreDepartamento = event.target.options[selectedIndex].text;

    this.departamentoSelected = depto;
    this.municipioSelected = "";

    this.listaMunicipios = [];

    this.datoAgregar.departamento = nombreDepartamento;
    this.datoAgregar.cod_departamento = depto;

    this.entidadService.listarMunicipios(depto).subscribe((resp: any) => {
      this.listaMunicipios = resp.ubicaciones;
    });
  }

  changeMunicipio(event) {
    let selectedIndex: number = event.target["selectedIndex"];
    let codMunicipio = event.target.options[selectedIndex].value;
    let nombreMunicipio = event.target.options[selectedIndex].text;

    this.municipioSelected = codMunicipio;

    this.municipiosAgregados.forEach((mun) => {
      if (mun.municipio === nombreMunicipio) {
        // this.displaySpanErrorEntidad = true;
        return;
      }
    });

    this.datoAgregar.municipio = nombreMunicipio;
    this.datoAgregar.cod_municipio = codMunicipio;
    this.displaySpanError = false;
  }

  addMunicipio(): void {
    if (
      this.codmunicipiosAgregados.includes(this.municipioSelected) ||
      this.municipioSelected === ""
    ) {
      this.displaySpanError = true;
      return;
    }

    this.municipiosAgregados.push({ ...this.datoAgregar });
    this.codDepartamentosAgregados.push(this.departamentoSelected);
    this.codmunicipiosAgregados.push(this.municipioSelected);

    Object.keys(this.datoAgregar).forEach(
      (key) => "departamento" || delete this.datoAgregar[key]
    );

    // this.departamentoSelected = "";
    // this.municipioSelected = "";
    // const selectDepartamento = document.getElementById(
    //   "selectDepartamento"
    // ) as HTMLSelectElement | null;
    const selectMunicipio = document.getElementById(
      "selectMunicipio"
    ) as HTMLSelectElement | null;
    // selectDepartamento.selectedIndex = 0;
    selectMunicipio.selectedIndex = 0;

    this.clearForm();
  }

  clearForm(): void {
    this.datoAgregar.cod_departamento = "";
    this.datoAgregar.cod_municipio = "";
    this.datoAgregar.area_psa_preservacion = "";
    this.datoAgregar.area_psa_restauracion = "";
    this.datoAgregar.hectareas_psa = "";
    this.datoAgregar.num_familias_beneficiadas = "";
    this.datoAgregar.costo_oportunidad = "";
    this.datoAgregar.valor_incentivo_psa = "";
  }

  removeMunicipio(index) {
    this.municipiosAgregados.splice(index, 1);
    this.codmunicipiosAgregados.splice(index, 1);
    this.formUbicacion.control.markAsDirty();
  }

  enviarDatosUbicacion: any = {
    proyecto_id: localStorage.getItem("proyecto_id"),
    ubicaciones: [],
  };

  guardarUbicacion() {
    if (!this.formUbicacion?.pristine) {
      this.enviarDatosUbicacion.ubicaciones = JSON.stringify(
        this.municipiosAgregados
      );

      this.entidadService
        .addUbicacion(this.enviarDatosUbicacion)
        .subscribe((resp: any) => {
          if (resp.success) {
            this.formUbicacion.reset();
            if (this.etapaProyecto === "inversion") {
              this.municipiosAgregados.forEach((num_familias) => {
                this.num_familias_beneficiadas_array.push(
                  num_familias.num_familias_beneficiadas
                );
              });

              const totalFamiliasBeneficiadas =
                this.num_familias_beneficiadas_array.reduce((a, b) => a + b, 0);

              const totalToString = totalFamiliasBeneficiadas.toString();

              this.proyectoService.proyectoData.total_familias_beneficiadas =
                totalFamiliasBeneficiadas;

              localStorage.setItem(
                "total_familias_beneficiadas",
                totalToString
              );

              this.router.navigate([
                `${this.enviarDatosUbicacion.proyecto_id}/beneficiarios`,
              ]);
            } else {
              this.router.navigate([
                `${this.enviarDatosUbicacion.proyecto_id}/financiacion`,
              ]);
            }
          } else {
            Swal.fire({
              title: "Error",
              text: "Ocurrió un error al guardar los datos",
              icon: "error",
              confirmButtonText: "Aceptar",
            });
          }
        });
    } else {
      if (this.etapaProyecto === "inversion") {
        this.router.navigate([
          `${this.proyectoService.idProyecto}/beneficiarios`,
        ]);
      } else {
        this.router.navigate([
          `${this.proyectoService.idProyecto}/financiacion`,
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
            this.enviarDatosUbicacion.proyecto_id =
              respuesta.proyecto.id || localStorage.getItem("proyecto_id");
            this.etapaProyecto =
              respuesta.proyecto.datos_basicos.etapa ||
              localStorage.getItem("etapaProyecto");

            if (respuesta.proyecto.ubicaciones !== null) {
              this.municipiosAgregados = respuesta.proyecto.ubicaciones;
              // if (respuesta.proyecto.datos_basicos.etapa === "inversion") {
              //   this.municipiosAgregados = respuesta.proyecto.ubicaciones;
              // } else {
              //   this.municipiosAgregados = respuesta.proyecto.ubicaciones.map(
              //     ({
              //       codigo_departamento,
              //       departamento,
              //       codigo_municipio,
              //       municipio,
              //     }) => ({
              //       cod_departamento: codigo_departamento,
              //       departamento,
              //       cod_municipio: codigo_municipio,
              //       municipio,
              //     })
              //   );
              //   this.codDepartamentosAgregados =
              //     respuesta.proyecto.ubicaciones.map(
              //       (mun) => mun.codigo_departamento
              //     );
              //   this.codmunicipiosAgregados =
              //     respuesta.proyecto.ubicaciones.map(
              //       (mun) => mun.codigo_municipio
              //     );
              // }
            }
          });
      }
    });

    this.entidadService.listarDepartamentos().subscribe((data: any) => {
      this.listaDepartamentos = data.ubicaciones;
    });
  }
}
