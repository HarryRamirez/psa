import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { switchMap } from "rxjs";
import { ProyectoService } from "@app/shared/services/proyecto.service";
import { EntidadService } from "@app/shared/services/entidad.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-financiacion",
  templateUrl: "./financiacion.component.html",
  styleUrls: ["./financiacion.component.scss"],
})
export class FinanciacionComponent implements OnInit {
  fuentesDeFinanciacion: any[] = [];
  listaDepartamentos: any[] = [];
  listaMunicipios: any[] = [];
  actoresAgregados: string[] = [];
  displaySpanErrorActor: boolean = false; // <--- RUN
  departamentosAgregados: string[] = [];
  municipiosYdepartamentos: any = {};
  municipiosYdepartamentosObj: any = {
    departamento: "",
    municipios: [],
    codDepartamento: "",
  };
  municipiosYdepartamentosAgregados: any[] = [];
  municipiosYdepartamentosPreAgregadosTabla: any[] = [];
  codMunicipiosAgregados: string[] = [];
  codDepartamentosAgregados: string[] = [];
  nombresOtrasFuentes: string[] = [];

  fuentesAgregadas: any[] = []; // <--- Array de donde se pega la tabla de HTML
  datosFuente: any = {
    fuente: "",
    codigos: [],
    codFuente: "",
  };
  arrayFuentesAgregadas: any[] = []; // <--- Array que se envía ya definitivamente

  verDepartamenos: boolean = false;
  verMunicipio: boolean = false;
  verOtraOpcion: boolean = false;
  fuenteSeleccionada: string = "";
  codigoFuenteSeleccionada: string = "";
  ActorInput: string = "";
  departamentoSelected: string = "";
  codigoDepartamentoSelected: string = "";
  otraFuente: string = "";
  idProyecto: string = "";

  addActor() {
    if (
      this.actoresAgregados.includes(this.ActorInput) ||
      this.ActorInput === ""
    ) {
      return;
    }
    this.actoresAgregados.push(this.ActorInput);
    this.ActorInput = "";
  }

  removeActor(index): void {
    this.actoresAgregados.splice(index, 1);
  }

  changeFuente(event): void {
    let selectedIndex: number = event.target["selectedIndex"];
    let fuente = event.target.options[selectedIndex].value;
    let nombreFuente = event.target.options[selectedIndex].text;

    if (fuente === "departamentos_gobernacion") {
      this.verDepartamenos = true;
      this.verMunicipio = false;
      this.verOtraOpcion = false;
    } else if (fuente === "municipios_alcaldia") {
      this.verDepartamenos = false;
      this.verMunicipio = true;
      this.verOtraOpcion = false;
    } else {
      this.verDepartamenos = false;
      this.verMunicipio = false;
      this.verOtraOpcion = true;
    }

    this.departamentosAgregados = [];
    this.fuenteSeleccionada = nombreFuente;
    this.codigoFuenteSeleccionada = fuente;
  }

  changeDepartamento(event) {
    let selectedIndex: number = event.target["selectedIndex"];
    let depto = event.target.options[selectedIndex].value;
    let nombreDepartamento = event.target.options[selectedIndex].text;

    // Si la fuente es Departamento, y el departamento ya está agregado, omitir.
    if (this.verDepartamenos) {
      if (
        this.departamentosAgregados.includes(nombreDepartamento) ||
        this.codDepartamentosAgregados.includes(depto) ||
        nombreDepartamento === ""
      ) {
        return;
      }
    }

    this.departamentosAgregados.push(nombreDepartamento);
    this.codDepartamentosAgregados.push(depto);

    if (this.verMunicipio === true) {
      this.listaMunicipios = [];
      this.departamentosAgregados = [];

      this.entidadService.listarMunicipios(depto).subscribe((resp: any) => {
        this.listaMunicipios = resp.ubicaciones;
      });

      if (this.municipiosYdepartamentosObj.departamento !== "") {
        this.municipiosYdepartamentosPreAgregadosTabla.push({
          ...this.municipiosYdepartamentosObj,
        });
      }

      this.clearDepartamentoData();
    }

    this.departamentoSelected = nombreDepartamento;
    this.codigoDepartamentoSelected = depto;
  }

  changeMunicipio(event) {
    let selectedIndex: number = event.target["selectedIndex"];
    let codMunicipio = event.target.options[selectedIndex].value;
    let nombreMunicipio = event.target.options[selectedIndex].text;

    // Agrega el nombre del municipio seleccionado, y lo agrega a un objeto donde tendrá el departamento seleccionado anteriormente también para luego ser concatenados y pintarsen en la tabla.
    this.municipiosYdepartamentos.departamento = this.departamentoSelected;
    this.municipiosYdepartamentos.municipio = nombreMunicipio;

    // Busca si ya se había seleccionado el departamento en los select de arriba, y agrega el nuevo municipio a ese departamento:
    if (
      this.municipiosYdepartamentosPreAgregadosTabla.find(
        (vendor) => vendor.departamento === this.departamentoSelected
      )
    ) {
      this.municipiosYdepartamentosPreAgregadosTabla
        .find((vendor) => vendor.departamento === this.departamentoSelected)
        .municipios.push(nombreMunicipio);
    } else {
      this.municipiosYdepartamentosObj.departamento = this.departamentoSelected;
      this.municipiosYdepartamentosObj.municipios.push(nombreMunicipio);
      this.municipiosYdepartamentosObj.codDepartamento =
        this.codigoDepartamentoSelected;
    }

    let concatMunicipiosYdepartamentos = Object.values(
      this.municipiosYdepartamentos
    ).join(" - ");

    this.codMunicipiosAgregados.push(codMunicipio);
    this.municipiosYdepartamentosAgregados.push(concatMunicipiosYdepartamentos);
  }

  addFuente() {
    this.datosFuente.fuente = this.fuenteSeleccionada;
    this.datosFuente.codFuente = this.codigoFuenteSeleccionada;

    if (this.verDepartamenos) {
      let indexOfFuenteAdded = this.fuentesAgregadas
        .map(function (e) {
          return e.codFuente;
        })
        .indexOf("departamentos_gobernacion");
      const selectDepartamentos = document.getElementById(
        "selectDepartamentosP"
      ) as HTMLSelectElement | null;

      if (indexOfFuenteAdded !== -1) {
        let erre = this.fuentesAgregadas[indexOfFuenteAdded]["nombre"];

        this.fuentesAgregadas[indexOfFuenteAdded]["nombre"] =
          erre + "\n" + this.departamentosAgregados.join("\n");

        this.codDepartamentosAgregados.forEach((item, i) => {
          this.datosFuente.codigos.push(item);
        });

        this.departamentosAgregados = [];
        this.departamentoSelected = "";

        selectDepartamentos.selectedIndex = 0;

        return this.saveLocalA("departamentos_gobernacion");
      }

      let datosnom = this.departamentosAgregados.join("\n");

      this.datosFuente.nombre = datosnom;

      this.codDepartamentosAgregados.forEach((item, i) => {
        this.datosFuente.codigos.push(item);
      });

      this.departamentosAgregados = [];
      this.departamentoSelected = "";
      selectDepartamentos.selectedIndex = 0;

      return this.saveLocalD();
    } else if (this.verMunicipio) {
      // ???
      if (this.municipiosYdepartamentosObj.departamento !== "") {
        // Valida que el departamento no esté vacío
        this.municipiosYdepartamentosPreAgregadosTabla.push({
          ...this.municipiosYdepartamentosObj,
        });
      }

      // Busca el índice de la fuente en el Array donde se pega la tabla del html, para agregar nuevos datos a ese índice (si existe el índice).
      let indexOfFuenteAdded = this.fuentesAgregadas
        .map(function (e) {
          return e.codFuente;
        })
        .indexOf("municipios_alcaldia");

      if (indexOfFuenteAdded !== -1) {
        let erre = this.fuentesAgregadas[indexOfFuenteAdded]["nombre"];
        this.fuentesAgregadas[indexOfFuenteAdded]["nombre"] =
          erre + "\n" + this.municipiosYdepartamentosAgregados.join("\n");

        this.codMunicipiosAgregados.forEach((item, i) => {
          this.datosFuente.codigos.push(item);
        });

        this.municipiosYdepartamentosAgregados = [];
        this.departamentoSelected = "";
        this.listaMunicipios = [];

        const selectMunicipios = document.getElementById(
            "selectMunicipios"
          ) as HTMLSelectElement | null,
          selectDepartamentos = document.getElementById(
            "selectDepartamentos"
          ) as HTMLSelectElement | null;

        selectMunicipios.selectedIndex = 0;
        selectDepartamentos.selectedIndex = 0;

        return this.saveLocalA("municipios_alcaldia");
      } else {
        this.datosFuente.nombre =
          this.municipiosYdepartamentosAgregados.join("\n");

        this.codMunicipiosAgregados.forEach((item, i) => {
          this.datosFuente.codigos.push(item);
        });

        this.municipiosYdepartamentosAgregados = [];
        this.departamentoSelected = "";
        this.listaMunicipios = [];

        const selectMunicipios = document.getElementById(
            "selectMunicipios"
          ) as HTMLSelectElement | null,
          selectDepartamentos = document.getElementById(
            "selectDepartamentos"
          ) as HTMLSelectElement | null;

        selectMunicipios.selectedIndex = 0;
        selectDepartamentos.selectedIndex = 0;

        return this.saveLocalD();
      }
    } else {
      if (this.otraFuente === "") return;

      let ser = this.fuentesAgregadas.find(
        (item) => item.fuente === this.fuenteSeleccionada
      );

      if (ser !== undefined) {
        this.fuentesAgregadas.forEach((item, i) => {
          if (item.fuente === this.fuenteSeleccionada) {
            this.nombresOtrasFuentes = [];
            this.nombresOtrasFuentes.push(item.nombre);
          }
        });

        this.nombresOtrasFuentes.push(this.otraFuente);

        ser.nombre = this.nombresOtrasFuentes.join("\n");
        this.datosFuente.nombre = this.otraFuente;
        ser.codigos.push(this.otraFuente);

        this.otraFuente = "";
        return;
      }

      this.datosFuente.nombre = this.otraFuente;
      this.datosFuente.codigos.push(this.otraFuente);
      this.otraFuente = "";

      return this.saveLocalD();
    }
  }

  saveLocalD() {
    const datosFuentespicked = (({ codFuente, codigos }) => ({
      codFuente,
      codigos,
    }))(this.datosFuente);

    let propertyValues = Object.values(datosFuentespicked);
    propertyValues[1].unshift(propertyValues[0]);

    // fuentesAgregadas es para mostrar en la TABLA
    this.fuentesAgregadas.push({ ...this.datosFuente });

    // arrayFuentesAgregadas es el array de todo para enviar
    this.arrayFuentesAgregadas.push(propertyValues[1]);
    this.datosFuente.codigos = [];
  }

  saveLocalA(nombreFuente) {
    const datosFuentespicked = (({ codFuente, codigos }) => ({
      codFuente,
      codigos,
    }))(this.datosFuente);

    let propertyValues = Object.values(datosFuentespicked);
    propertyValues[1].unshift(propertyValues[0]);

    const result = { col: -1, row: -1 };

    this.arrayFuentesAgregadas.forEach((row, index) => {
      const fuentePosition = row.indexOf(nombreFuente);
      if (fuentePosition > -1) {
        result.row = index;
        result.col = fuentePosition;
      }
    });

    this.arrayFuentesAgregadas.splice(result.row, 1);

    this.arrayFuentesAgregadas.push(propertyValues[1]);
    this.datosFuente.codigos = [];
  }

  clearDepartamentoData() {
    this.municipiosYdepartamentosObj.departamento = "";
    this.municipiosYdepartamentosObj.municipios = [];
    this.municipiosYdepartamentosObj.departamento = "";
  }

  removeDepartamento(j) {
    this.departamentosAgregados.splice(j, 1);
    this.codDepartamentosAgregados.splice(j, 1);
  }

  removeDepartamentoAndMunicipio(h) {
    this.municipiosYdepartamentosAgregados.splice(h, 1);
    this.codMunicipiosAgregados.splice(h, 1);
  }

  removeFuente(index): void {
    this.fuentesAgregadas.splice(index, 1);
    this.arrayFuentesAgregadas.splice(index, 1);

    if (this.fuentesAgregadas.length <= 0) {
      this.municipiosYdepartamentosPreAgregadosTabla = [];
    }

    this.municipiosYdepartamentosPreAgregadosTabla?.splice(index, 1);
  }

  enviarDatosFinanciacion: any = {
    proyecto_id: localStorage.getItem("proyecto_id"),
  };

  guardarFuentes() {
    this.enviarDatosFinanciacion.actores = JSON.stringify(
      this.actoresAgregados
    );

    this.enviarDatosFinanciacion.fuentes_financiacion = JSON.stringify(
      this.arrayFuentesAgregadas
    );

    this.entidadService
      .addFuentes(this.enviarDatosFinanciacion)
      .subscribe((resp: any) => {
        console.log(resp);
        if (resp.success) {
          Swal.fire({
            title: "Éxito",
            text: "Datos guardados correctamente!",
            icon: "success",
            confirmButtonText: "Aceptar",
          });
          this.router.navigate(["/proyectos/"]);
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
            // console.log(respuesta.proyecto.financiacion);
            // console.log(respuesta.proyecto.financiacion.fuentes);
            // console.log(respuesta.proyecto.financiacion.actores);

            // this.actoresAgregados = respuesta.proyecto.financiacion.actores;

            // if (
            //   respuesta.proyecto.financiacion.fuentes.some(
            //     (fuente) => fuente.tipo === "departamentos_gobernacion"
            //   )
            // ) {
            //   let fuenteFinanciacion =
            //     respuesta.proyecto.financiacion.fuentes.find(
            //       (x) => x.tipo === "departamentos_gobernacion"
            //     );
            //   let datosFuenteDepartamentos = [];

            //   datosFuenteDepartamentos.push(fuenteFinanciacion.tipo);
            //   fuenteFinanciacion.listado.forEach((element) =>
            //     datosFuenteDepartamentos.push(element.cod_departamento)
            //   );
            //   this.arrayFuentesAgregadas.push(datosFuenteDepartamentos);

            //   this.fuentesAgregadas.push({
            //     codFuente: fuenteFinanciacion.tipo,
            //     fuente: fuenteFinanciacion.traduccion,
            //     nombre: fuenteFinanciacion.listado
            //       .map((dato) => dato.nombre)
            //       .join("\n"),
            //   });
            //   // this.municipiosYdepartamentosPreAgregadosTabla = proyecto.proyectoData['financiacion'].departamentos_gobernacion;
            // }

            // if (
            //   respuesta.proyecto.financiacion.fuentes.some(
            //     (fuente) => fuente.fuente === "municipios_alcaldia"
            //   )
            // ) {
            //   let fuenteFinanciacion =
            //     respuesta.proyecto.financiacion.fuentes.find(
            //       (x) => x.fuente === "municipios_alcaldia"
            //     );
            //   let datosFuenteMunicipios = [];

            //   datosFuenteMunicipios.push(fuenteFinanciacion.tipo);
            //   fuenteFinanciacion.listado.forEach((element) =>
            //     datosFuenteMunicipios.push(element.codigo)
            //   );
            //   this.arrayFuentesAgregadas.push(datosFuenteMunicipios);

            //   this.fuentesAgregadas.push({
            //     codFuente: fuenteFinanciacion.tipo,
            //     fuente: fuenteFinanciacion.traduccion,
            //     nombre: fuenteFinanciacion.listado
            //       .map((dato) => dato.nombre)
            //       .join("\n"),
            //   });
            // }

            // if (
            //   respuesta.proyecto.financiacion.fuentes.some(
            //     (fuente) =>
            //       fuente.tipo !== "municipios_alcaldia" &&
            //       fuente.tipo !== "departamentos_gobernacion"
            //   )
            // ) {
            //   let fuenteFinanciacion =
            //     respuesta.proyecto.financiacion.fuentes.filter(
            //       (x) =>
            //         x.tipo !== "municipios_alcaldia" &&
            //         x.tipo !== "departamentos_gobernacion"
            //     );

            //   let datosFuenteOtros = [];

            //   fuenteFinanciacion.forEach((element) => {
            //     datosFuenteOtros.push(element.fuente);
            //     element.listado.forEach((dato) => datosFuenteOtros.push(dato));
            //     this.arrayFuentesAgregadas.push(datosFuenteOtros);
            //     datosFuenteOtros = [];

            //     this.fuentesAgregadas.push({
            //       codFuente: element.fuente,
            //       fuente: element.traduccion,
            //       codigos: element.listado.map((dato) => dato),
            //       nombre: element.listado.join("\n"),
            //     });
            //   });
            // }

            this.enviarDatosFinanciacion.proyecto_id =
              localStorage.getItem("proyecto_id") ||
              this.proyectoService.idProyecto;
          });
      }
    });

    const proyecto = this.proyectoService;

    if (
      proyecto.proyectoData["financiacion"] &&
      proyecto.proyectoData.editMode
    ) {
      this.actoresAgregados = proyecto.proyectoData["actores"];

      if (
        proyecto.proyectoData["financiacion"].some(
          (fuente) => fuente.fuente === "departamentos_gobernacion"
        )
      ) {
        let fuenteFinanciacion = proyecto.proyectoData["financiacion"].find(
          (x) => x.fuente === "departamentos_gobernacion"
        );
        let datosFuenteDepartamentos = [];

        datosFuenteDepartamentos.push(fuenteFinanciacion.fuente);
        fuenteFinanciacion.listado.forEach((element) =>
          datosFuenteDepartamentos.push(element.cod_departamento)
        );
        this.arrayFuentesAgregadas.push(datosFuenteDepartamentos);

        this.fuentesAgregadas.push({
          codFuente: fuenteFinanciacion.fuente,
          fuente: fuenteFinanciacion.traduccion,
          nombre: fuenteFinanciacion.listado
            .map((dato) => dato.nombre)
            .join("\n"),
        });
        // this.municipiosYdepartamentosPreAgregadosTabla = proyecto.proyectoData['financiacion'].departamentos_gobernacion;
      }

      if (
        proyecto.proyectoData["financiacion"].some(
          (fuente) => fuente.fuente === "municipios_alcaldia"
        )
      ) {
        let fuenteFinanciacion = proyecto.proyectoData["financiacion"].find(
          (x) => x.fuente === "municipios_alcaldia"
        );
        let datosFuenteMunicipios = [];

        datosFuenteMunicipios.push(fuenteFinanciacion.fuente);
        fuenteFinanciacion.listado.forEach((element) =>
          datosFuenteMunicipios.push(element.codigo)
        );
        this.arrayFuentesAgregadas.push(datosFuenteMunicipios);

        this.fuentesAgregadas.push({
          codFuente: fuenteFinanciacion.fuente,
          fuente: fuenteFinanciacion.traduccion,
          nombre: fuenteFinanciacion.listado
            .map((dato) => dato.nombre)
            .join("\n"),
        });
      }

      if (
        proyecto.proyectoData["financiacion"].some(
          (fuente) =>
            fuente.fuente !== "municipios_alcaldia" &&
            fuente.fuente !== "departamentos_gobernacion"
        )
      ) {
        let fuenteFinanciacion = proyecto.proyectoData["financiacion"].filter(
          (x) =>
            x.fuente !== "municipios_alcaldia" &&
            x.fuente !== "departamentos_gobernacion"
        );

        let datosFuenteOtros = [];

        fuenteFinanciacion.forEach((element) => {
          datosFuenteOtros.push(element.fuente);
          element.listado.forEach((dato) => datosFuenteOtros.push(dato));
          this.arrayFuentesAgregadas.push(datosFuenteOtros);
          datosFuenteOtros = [];

          this.fuentesAgregadas.push({
            codFuente: element.fuente,
            fuente: element.traduccion,
            codigos: element.listado.map((dato) => dato),
            nombre: element.listado.join("\n"),
          });
        });
      }

      this.enviarDatosFinanciacion.proyecto_id =
        localStorage.getItem("proyecto_id") || this.proyectoService.idProyecto;
    }

    this.entidadService.listarFuentesDeFinanciacion().subscribe((data: any) => {
      this.fuentesDeFinanciacion =
        data.enumeraciones.potenciales_fuentes_financiacion;
    });

    this.entidadService.listarDepartamentos().subscribe((data: any) => {
      this.listaDepartamentos = data.ubicaciones;
    });
  }
}
