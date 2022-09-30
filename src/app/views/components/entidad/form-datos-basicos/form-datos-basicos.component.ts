import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { switchMap } from "rxjs/operators";
import { EntidadService } from "@app/shared/services/entidad.service";
import { ProyectoService } from "@app/shared/services/proyecto.service";
import Swal from "sweetalert2";

interface Autoridad {
  codigo: string;
  nombre: string;
}

@Component({
  selector: "app-form-datos-basicos",
  templateUrl: "./form-datos-basicos.component.html",
  styleUrls: ["./form-datos-basicos.component.scss"],
})
export class FormDatosBasicosComponent implements OnInit {
  @ViewChild("formDatosBasicos") formDatosBasicos!: NgForm;

  editProyectoMode: boolean = false;
  inversion: boolean = false;
  preinversion: boolean = false;
  displaySpanError: boolean = false;
  displaySpanErrorEntidad: boolean = false;

  //enums:
  listAutoridadesEnum: any[] = [];
  etapas_proyecto: any[] = [];
  tipo_entidad: any[] = [];
  tipo_proyecto: any[] = [];
  modalidad_proyecto: any[] = [];
  acciones_reconocimiento: any[] = [];

  AutoridadSelectedName: string = "";
  selectedOptionEntidad: string = "";
  optionSelected: string;
  listaAcciones: any[] = [];

  proyecto: any = {
    annio: new Date().getFullYear(),
    autoridades: [],
    entidades: [],
    etapa: "",
    tipo: "",
    implementador: {
      nombre: "",
      tipo: "",
    },
    modalidad: "",
  };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private entidadService: EntidadService,
    private proyectoService: ProyectoService
  ) {}

  ngOnInit(): void {
    this.entidadService.listarAutoridades().subscribe((data: any) => {
      this.listAutoridadesEnum = data.autoridades_ambientales;
      console.log(data.autoridades_ambientales);
    });

    this.entidadService.listarDatosBasicos().subscribe((data: any) => {
      this.etapas_proyecto = data.enumeraciones.etapas_proyecto;
      this.tipo_entidad = data.enumeraciones.tipos_entidad;
      this.tipo_proyecto = data.enumeraciones.tipos_proyecto;
      this.modalidad_proyecto = data.enumeraciones.modalidades_proyecto;
      this.acciones_reconocimiento = data.enumeraciones.acciones_reconocimiento;
    });

    this.activatedRoute.params.subscribe(({ idProyecto }) => {
      if (!idProyecto) {
        this.editProyectoMode = false;
        this.proyectoService.proyectoData.editMode = false;
        Swal.fire({
          title: "<span class='wrn-text'>Advertencia</span>",
          text: "Recuerda que el proyecto que estas a punto de registrar debe ser diseñado (fase factibilidad) o implementado entre el 01 de enero del 2022 a 31 de diciembre del 2022",
          imageUrl: "assets/img/i-advertencia/ADVERTENCIA.svg",
          imageWidth: 100,
          imageHeight: 80,
          confirmButtonText: "Aceptar",
        });
      } else {
        this.activatedRoute.params
          .pipe(
            switchMap(({ idProyecto }) =>
              this.proyectoService.getProjectData(idProyecto)
            )
          )
          .subscribe((proyectoResponse: any) => {
            this.proyectoService.proyectoData = proyectoResponse.proyecto;
            this.proyectoService.proyectoData.editMode = true;

            console.log(proyectoResponse);

            Object.assign(
              this.proyecto,
              proyectoResponse.proyecto["datos_basicos"]
            );

            const idUser =
              JSON.parse(localStorage.getItem("prm")).id ||
              this.proyectoService.idUser;

            const selectEtapa = document.getElementById(
              "etapa"
            ) as HTMLSelectElement | null;

            if (proyectoResponse.proyecto["autor"] !== idUser) {
              Swal.fire({
                title: "Advertencia",
                text: "No tienes permiso para editar este proyecto",
                icon: "warning",
                confirmButtonText: "Aceptar",
              });
              this.router.navigate(["/proyectos"]);
              return;
            }

            localStorage.setItem("etapaProyecto", this.proyecto.etapa);

            if (this.proyecto.etapa === "inversion") {
              this.inversion = true;
              this.preinversion = false;
              selectEtapa.classList.add("mt-4");

              this.proyecto.acciones.forEach((element) => {
                this.listaAcciones.push(element.tipo);
              });
            } else {
              this.inversion = false;
              this.preinversion = true;
              selectEtapa.classList.remove("mt-4");
            }
          });
        this.editProyectoMode = true;
      }
    });
  }

  getAutoridadValueSelected(event) {
    let selectedIndex: number = event.target["selectedIndex"];
    this.AutoridadSelectedName = event.target.options[selectedIndex].text;
    this.optionSelected = event.target.options[selectedIndex].value;
    this.displaySpanError = false;
  }

  addAutoridad() {
    if (
      this.optionSelected === undefined ||
      this.optionSelected === "" ||
      this.optionSelected === null
    ) {
      this.displaySpanError = true;
      return;
    }

    const nuevoItem: Autoridad = {
      codigo: this.optionSelected,
      nombre: this.AutoridadSelectedName,
    };

    this.proyecto.autoridades.push({ ...nuevoItem });

    this.listAutoridadesEnum = this.listAutoridadesEnum.filter(
      (el) => el.codigo !== Number(this.optionSelected)
    );

    const AutoridadSelectedName = document.getElementById(
      "AutoridadSelectedName"
    ) as HTMLSelectElement | null;
    AutoridadSelectedName.selectedIndex = 0;
    this.AutoridadSelectedName = "";

    this.formDatosBasicos.control.markAsDirty();
  }

  addEntidad() {
    if (
      this.selectedOptionEntidad === undefined ||
      this.selectedOptionEntidad === "" ||
      this.selectedOptionEntidad === null
    ) {
      this.displaySpanErrorEntidad = true;
      return;
    }

    if (this.proyecto.entidades.includes(this.selectedOptionEntidad)) {
      Swal.fire({
        title: "Advertencia",
        text: "La entidad ya se encuentra agregada",
        icon: "warning",
        confirmButtonText: "Aceptar",
      });
      this.selectedOptionEntidad = "";
      return;
    }

    this.proyecto.entidades.push(this.selectedOptionEntidad);
    this.selectedOptionEntidad = "";
  }

  removeAutoridad(index: number, autoridad: any) {
    this.proyecto.autoridades.splice(index, 1);
    this.listAutoridadesEnum.push(autoridad);
    this.listAutoridadesEnum.sort((a, b) => a.codigo - b.codigo);
    this.formDatosBasicos.control.markAsDirty();
  }

  removeEntidad(index: number) {
    this.proyecto.entidades.splice(index, 1);
    this.formDatosBasicos.control.markAsDirty();
  }

  switchProyectoType(event: any) {
    if (event.target.value === "inversion") {
      // this.proyecto.implementador.nombre = "";
      // this.proyecto.implementador.tipo = "";

      // console.log(this.proyecto);

      this.inversion = true;
      this.preinversion = false;

      event.target.classList.add("mt-4");
    } else if (event.target.value === "preinversion") {
      this.inversion = false;
      this.preinversion = true;
      event.target.classList.remove("mt-4");
    }
  }

  changeActionsCheckBoxes(accion: any, event: any) {
    if (event.target.checked && !this.listaAcciones.includes(accion.item)) {
      this.listaAcciones.push(accion.item);
    } else {
      this.listaAcciones.forEach((item, i) => {
        if (item === accion.item) {
          this.listaAcciones.splice(i, 1);
        }
      });
    }
    this.formDatosBasicos.control.markAsDirty();
  }

  nombreValido(): boolean {
    return (
      this.formDatosBasicos?.controls.nombre_proyecto?.invalid &&
      this.formDatosBasicos?.controls.nombre_proyecto?.touched
    );
  }

  formReady(): boolean {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const checkedOne = Array.prototype.slice
      .call(checkboxes)
      .some((x) => x.checked);

    if (this.proyecto.etapa === "inversion") {
      return checkedOne === false;
    }
    return false;
  }

  checkLists(): boolean {
    if (this.proyecto.autoridades.length <= 0) {
      Swal.fire({
        title: "Advertencia",
        text: "Debes agregar al menos una autoridad",
        icon: "warning",
        confirmButtonText: "Aceptar",
      });
      return false;
    }

    if (this.formDatosBasicos.value.etapa === "preinversion") {
      if (this.proyecto.entidades.length <= 0) {
        Swal.fire({
          title: "Advertencia",
          text: "Debes agregar al menos una entidad",
          icon: "warning",
          confirmButtonText: "Aceptar",
        });
        return false;
      }
    }
    return true;
  }

  submitData() {
    if (this.checkLists()) {
      this.proyecto["nom_proyecto_psa"] = this.proyecto["nombre"];
      this.proyecto["etapa_proyecto_psa"] = this.proyecto["etapa"];
      this.proyecto["tipo_proyecto_psa"] = this.proyecto["tipo"];
      this.proyecto["autor_id"] =
        this.proyectoService.idUser ||
        JSON.parse(localStorage.getItem("prm")).id;
      this.proyecto["autoridades_ambientales"] = JSON.stringify(
        this.proyecto["autoridades"].map((cod) => Number(cod.codigo))
      );

      if (this.proyecto["etapa_proyecto_psa"] === "preinversion") {
        this.proyecto["involucrados_proyecto"] = JSON.stringify(
          this.proyecto.entidades
        );
      } else {
        const involucrados = [];
        involucrados.push(
          this.formDatosBasicos.value.nombre_entidad,
          this.formDatosBasicos.value.tipo_entidad
        );

        this.proyecto["involucrados_proyecto"] = JSON.stringify(involucrados);
        this.proyecto["tipo_entidad"] =
          this.formDatosBasicos.value.tipo_entidad;
        this.proyecto["modalidad_proyecto_psa"] = this.proyecto["modalidad"];
        this.proyecto["acciones_reconocimiento"] = JSON.stringify(
          this.listaAcciones
        );

        // delete this.proyecto["entidades"];
        // delete this.proyecto["modalidad"];
      }

      if (this.editProyectoMode) {
        this.proyecto["proyecto_id"] = this.proyectoService.idProyecto;
      }

      // delete this.proyecto["nombre"];
      // delete this.proyecto["etapa"];
      // delete this.proyecto["tipo"];

      this.entidadService.addDatosBasicos(this.proyecto).subscribe(
        (respuesta) => {
          if (respuesta.success) {
            localStorage.setItem("proyecto_id", respuesta.details.proyecto_id);
            localStorage.setItem(
              "etapaProyecto",
              this.proyecto["etapa_proyecto_psa"]
            );

            this.formDatosBasicos.resetForm();

            this.proyecto = {};
            this.proyecto["nombre"] = "";
            this.proyecto["etapa"] = "";
            this.proyecto["tipo"] = "";
            this.proyecto["modalidad"] = "";

            this.router.navigate([
              `${respuesta.details.proyecto_id}/ubicacion`,
            ]);
          } else {
            Swal.fire({
              title: "Error",
              text: respuesta.message,
              icon: "error",
              confirmButtonText: "Aceptar",
            });
          }
        },
        (error) => {
          Swal.fire({
            title: "Error",
            text: "Ha ocurrido un error, por favor intente de nuevo",
            icon: "error",
            confirmButtonText: "Aceptar",
          });
          this.router.navigate(["/proyectos"]);
          console.log(error);
        }
      );
    }
  }

  checkFormStatus(): any {
    if (!this.formDatosBasicos?.pristine && this.formDatosBasicos?.valid) {
      return this.submitData();
    } else if (this.formDatosBasicos?.valid) {
      if (this.formDatosBasicos?.pristine) {
        return this.router.navigate([
          `${this.proyectoService.idProyecto}/ubicacion`,
        ]);
      }
    }
  }
}
