import { Component, OnInit, HostListener, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { switchMap } from "rxjs/operators";
import { ProyectoService } from "@app/shared/services/proyecto.service";
import { EntidadService } from "@app/shared/services/entidad.service";
import Swal from "sweetalert2";

interface PotencialesFuentes {
  nombre: string;
  traduccion: string;
  valor_financiado: string;
}

@Component({
  selector: "app-financiacion-inversion",
  templateUrl: "./financiacion-inversion.component.html",
  styleUrls: ["./financiacion-inversion.component.scss"],
})
export class FinanciacionInversionComponent implements OnInit {
  @ViewChild("formFinanciacion") formFinanciacion!: NgForm;

  tiposFuenteFinanciacion: any[] = [];
  fuentesAgregadas: any[] = [];
  datosFuenteHTML: PotencialesFuentes = {
    nombre: "",
    traduccion: "",
    valor_financiado: "",
  };
  datosFuenteSave: any = {
    nombre: "",
    tipo: "",
    valor_financiado: "",
  };
  arrayDatosFuenteSaved: any[] = [];

  datosGastosHTML: any = {
    ValorTotalIncentivos: "",
    GastosAsociados: "",
    GastosAdministrativos: "",
    ValorTotalProyecto: "",
  };

  enviarDatosFinanciacion: any = {
    proyecto_id: localStorage.getItem("proyecto_id"),
  };

  ValorTotalIncentivos: number = 0;
  GastosAsociados: number = 0;
  GastosAdministrativos: number = 0;
  ValorTotalProyecto: number = 0;

  editModeFuentes: any[] = [];
  idProyecto: string = "";
  displaySpanErrorFuente: boolean = false;
  displaySpanErrorValor: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private proyectoService: ProyectoService,
    private entidadService: EntidadService
  ) {}

  ngOnInit(): void {
    const proyecto = this.proyectoService;

    this.entidadService.getTiposFuenteFinanciacion().subscribe((data: any) => {
      this.tiposFuenteFinanciacion = data.enumeraciones.tipos_financiacion;
    });

    this.activatedRoute.params.subscribe(({ idProyecto }) => {
      if (idProyecto) {
        this.idProyecto = idProyecto;
        this.activatedRoute.params
          .pipe(
            switchMap(({ idProyecto }) =>
              proyecto.getEtapaProyecto(idProyecto, "financiacion")
            )
          )
          .subscribe((respuesta: any) => {
            if (respuesta.proyecto.etapa !== "inversion") {
              Swal.fire({
                title: "Error",
                text: "Éste proyecto no se encuentra en la etapa de Inversión",
                icon: "error",
                confirmButtonText: "Aceptar",
              });
              this.router.navigate(["/proyectos"]);
            }

            this.enviarDatosFinanciacion.proyecto_id = respuesta.proyecto.id;

            if (
              respuesta.proyecto.financiacion &&
              respuesta.proyecto.financiacion.fuentes.length > 0
            ) {
              this.fuentesAgregadas = respuesta.proyecto.financiacion.fuentes;

              this.fuentesAgregadas.forEach((element: any) => {
                const fuentesFetched = [
                  element.listado[0].nombre,
                  element.tipo,
                  element.listado[0].valor_financiado,
                ];
                this.arrayDatosFuenteSaved.push(fuentesFetched);
                this.editModeFuentes.push(fuentesFetched);

                element.listado.forEach((element) => {
                  return (element.valor_financiado = this.formatAmount(
                    element.valor_financiado.toString()
                  ));
                });
              });

              this.ValorTotalIncentivos =
                respuesta.proyecto.financiacion.gastos.suma_incentivos || 0;
              this.GastosAdministrativos =
                respuesta.proyecto.financiacion.gastos
                  .gasto_administrativo_psa || 0;
              this.GastosAsociados =
                respuesta.proyecto.financiacion.gastos.gasto_monitoreo_psa || 0;
              this.datosGastosHTML.ValorTotalIncentivos = this.formatAmount(
                respuesta.proyecto.financiacion.gastos.suma_incentivos.toString()
              );
              this.datosGastosHTML.GastosAdministrativos = this.formatAmount(
                respuesta.proyecto.financiacion.gastos.gasto_administrativo_psa.toString()
              );
              this.datosGastosHTML.GastosAsociados = this.formatAmount(
                respuesta.proyecto.financiacion.gastos.gasto_monitoreo_psa.toString()
              );

              this.change();

              // respuesta.proyecto.financiacion.fuentes.forEach(
              // 	(element: any) => {
              // 		console.log(element);
              // 		const fuentesFetched = {
              // 			nombre: element.listado[0].nombre,
              // 			traduccion: element.tipo,
              // 			valor_financiado: element.listado[0].valor_financiado,
              // 		}
              // 		this.arrayDatosFuenteSaved.push(fuentesFetched);
              // 		// this.arrayDatosFuenteSaved.push(Object.values(element));
              // 	}
              // );

              // this.arrayDatosFuenteSaved = Object.values(respuesta.proyecto.financiacion.fuentes);
              // console.log(this.arrayDatosFuenteSaved);

              // this.fuentesAgregadas.map(({valor_financiado}) => this.formatAmount(valor_financiado.toString()));
            }
          });
      }
    });
  }

  changeTipoFuente(event: any) {
    let selectedIndex = event.target["selectedIndex"];
    this.datosFuenteHTML.traduccion = event.target.options[selectedIndex].text;
    this.datosFuenteSave.tipo = event.target.options[selectedIndex].value;
  }

  transformAmount(element: any) {
    if (element) return element.replace(/[^\d.-]/g, "");
    return "";
  }

  formatAmount(amount: string): string {
    let formated = amount.replace(/[^\d\.]|(?<=\d*\.\d*)\./g, "");
    if (formated.length > 0) {
      formated = formated.replace(/(?<=\.\d{2})\d+/g, "");
      formated = formated.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return `$${formated}`;
    }
    return "";
  }

  handleInput({ target }: Event, inputValorFinanciado: boolean = false): void {
    const el = <any>target;
    el.value = this.formatAmount(el.value);
    if (inputValorFinanciado) this.datosFuenteHTML.valor_financiado = el.value;
  }

  addFuenteFinanciacion() {
    if (
      this.datosFuenteHTML.nombre == "" ||
      this.datosFuenteHTML.traduccion == "" ||
      this.datosFuenteHTML.valor_financiado == ""
    ) {
      this.displaySpanErrorFuente = true;
      return;
    }

    if (this.fuentesAgregadas.includes(this.datosFuenteHTML.traduccion)) {
      this.fuentesAgregadas.find((element: any) => {
        if (element.traduccion === this.datosFuenteHTML.traduccion) {
          const objFuente = {
            nombre: this.datosFuenteHTML.nombre,
            valor_financiado: this.datosFuenteHTML.valor_financiado,
          };
          element.listado.push({ ...objFuente });
        }
      });
    } else {
      this.fuentesAgregadas.push({
        traduccion: this.datosFuenteHTML.traduccion,
        listado: [
          {
            nombre: this.datosFuenteHTML.nombre,
            valor_financiado: this.datosFuenteHTML.valor_financiado,
          },
        ],
      });
    }

    // this.fuentesAgregadas.push({ ...this.datosFuenteHTML });

    this.datosFuenteSave.nombre = this.datosFuenteHTML.nombre;
    this.datosFuenteSave.traduccion = this.datosFuenteHTML.traduccion;
    this.datosFuenteSave.valor_financiado = this.transformAmount(
      this.datosFuenteHTML.valor_financiado
    );
    const propertyValues = Object.values(this.datosFuenteSave);
    this.arrayDatosFuenteSaved.push(propertyValues);

    this.datosFuenteHTML.nombre = "";
    this.datosFuenteHTML.traduccion = "";
    this.datosFuenteHTML.valor_financiado = "";
    let selectTipoFuenteFinanciacion = document.getElementById(
      "tipoFuenteFinanciacion"
    ) as HTMLSelectElement | null;
    selectTipoFuenteFinanciacion.selectedIndex = 0;

    this.displaySpanErrorFuente = false;
  }

  removeFuenteFinanciacion(index: number) {
    this.fuentesAgregadas.splice(index, 1);
    this.arrayDatosFuenteSaved.splice(index, 1);
  }

  @HostListener("keyup", ["$event.target.value"])
  change() {
    this.ValorTotalIncentivos = Number(
      this.transformAmount(this.datosGastosHTML.ValorTotalIncentivos)
    );
    this.GastosAsociados = Number(
      this.transformAmount(this.datosGastosHTML.GastosAsociados)
    );
    this.GastosAdministrativos = Number(
      this.transformAmount(this.datosGastosHTML.GastosAdministrativos)
    );
    this.ValorTotalProyecto = Number(
      this.transformAmount(this.datosGastosHTML.ValorTotalProyecto)
    );

    this.ValorTotalProyecto = this.GastosAsociados + this.GastosAdministrativos;

    this.datosGastosHTML.ValorTotalProyecto = this.formatAmount(
      this.ValorTotalProyecto.toString()
    );
  }

  openAlert(mode) {
    if (mode === "1") {
      Swal.fire({
        title: "Ayuda",
        text: "Gastos de los incentivos otorgados son aquellos gastos que corresponden al valor total de los incentivos otorgados a los beneficiarios del proyecto.",
        icon: "warning",
        confirmButtonText: "Aceptar",
      });
    } else if (mode === "2") {
      Swal.fire({
        title: "Ayuda",
        text: "Gastos asociados son aquellos gastos diferentes a los incentivos otorgados y corresponden, entre otros, al monitoreo y seguimiento, estudios de títulos, levantamientos topográficos, avalúos comerciales y gastos notariales y de registro. (Decreto 1007 de 2018, Artículo 2.2.9.8.3.5. Gastos asociados a los pagos por servicios ambientales ya la adquisición de predios)",
        icon: "warning",
        confirmButtonText: "Aceptar",
      });
    } else {
      Swal.fire({
        title: "Ayuda",
        text: "Gastos administrativos son aquellos gastos de operación y monitoreo que deben relacionar únicamente las entidades privadas que registren los proyectos.",
        icon: "warning",
        confirmButtonText: "Aceptar",
      });
    }
  }

  saveFuentesFinanciacion() {
    this.enviarDatosFinanciacion.fuentes_financiacion = JSON.stringify(
      this.arrayDatosFuenteSaved
    );
    this.enviarDatosFinanciacion.incentivos_otorgados =
      this.ValorTotalIncentivos.toString();
    this.enviarDatosFinanciacion.gastos_asociados =
      this.GastosAsociados.toString();
    this.enviarDatosFinanciacion.gastos_administrativos =
      this.GastosAdministrativos.toString();

    this.entidadService
      .saveFuentesFinanciacionInversion(this.enviarDatosFinanciacion)
      .subscribe(
        (data: any) => {
          if (data.success) {
            this.router.navigate([`${data.details.proyecto_id}/incentivos/`]);
          }
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  checkFormStatus(): any {
    const array2Sorted = this.editModeFuentes.slice().sort();
    const isEquals =
      this.arrayDatosFuenteSaved.length === this.editModeFuentes.length &&
      this.arrayDatosFuenteSaved
        .slice()
        .sort()
        .every(function (value, index) {
          return value === array2Sorted[index];
        });

    if (this.formFinanciacion?.valid) {
      if (!this.formFinanciacion?.pristine || !isEquals) {
        return this.saveFuentesFinanciacion();
      } else if (isEquals) {
        return this.router.navigate([`${this.idProyecto}/incentivos`]);
      }
    }
  }
}
