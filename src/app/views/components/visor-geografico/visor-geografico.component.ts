import { Component, OnInit, ViewChild } from "@angular/core";

import { FormControl, FormGroup, Validators, Form } from "@angular/forms";
import { EntidadService } from "../../../shared/services/entidad.service";
import { ProyectoService } from "../../../shared/services/proyecto.service";
import { Options } from "@angular-slider/ngx-slider";
import { data } from "jquery";
import { Console } from "console";
import { TabDirective } from "ngx-bootstrap/tabs";
import { Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

@Component({
  selector: "app-visor-geografico",
  templateUrl: "./visor-geografico.component.html",
  styleUrls: ["./visor-geografico.component.scss"],
})
export class VisorGeograficoComponent implements OnInit {
  value?: string;
  onSelect(data: TabDirective): void {
    this.value = data.id;
  }

  oneAtATime = true;
  enums: string =
    "etapas_proyecto,tipos_proyecto,modalidades_proyecto,acciones_reconocimiento,tipos_entidad";
  enum: string = "tipos_financiacion";
  enum_promedio: string = "promedio_ingresos";
  annios: any[] = [];
  acciones_reconocimiento: any[] = [];
  etapas_proyecto: any[] = [];
  modalidades_proyecto: any[] = [];
  tipos_entidad: any[] = [];
  tipos_proyecto: any[] = [];
  listAutoridadesEnum: any[] = [];
  //two
  listaDepartamentos: any[] = [];
  listaMunicipios: any[] = [];
  banderaMuni: boolean = false;
  // tres
  tipos_financiacion: any[] = [];
  // cuatro
  promedio_ingresos: any[] = [];

  ///Data filtro
  datosFiltro: any = {
    annio: 0,
    datos_basicos: [
      {
        etapa: "",
        tipo_proyecto: "",
        modalidades: [],
        acciones: "",
        tipos_implementadores: [],
        autoridades_ambientales: [],
      },
    ],
    ubicaciones: [
      {
        departamentos: [],
        municipios: [],
        hectareas: [],
        costo_oportunidad: [],
        valor_incentivo: [],
      },
    ],
    financiacion: [
      {
        valor_proyecto: [],
        total_incentivos: [],
        tipos_financiacion: [],
      },
    ],
    beneficiarios: [
      {
        total_familias: [],
        nivel_ingresos: "",
      },
    ],
  };

  //Respuesta filtro
  dataResFil: any = [];
  dataHestareas: any = {};
  dataBeneficiarios: any = {};
  dataDepartamento: any = {};
  dataModalidades: any = {};

  //Data gráficas
  loading: boolean = false;
  labelHec: any = [];
  dataHec: any = [];
  myChart3: Chart;
  buttonChart3: boolean = false;

  labelBen: any = [];
  dataBenH: any = [];
  dataBenM: any = [];
  myChart4: Chart;
  buttonChart4: boolean = false;

  labelDep: any = [];
  dataDep: any = [];
  myChart: Chart;
  totalDep: number = 0;

  labelMod: any = [];
  dataMod: any = [];
  myChart2: Chart;
  totalMod: number = 0;

  rectangleSet = false;
  chartTest: Chart;
  totpag: 0;

  //Form Control
  etapaF: FormControl;
  tipoF: FormControl;
  modalidadesF: FormControl;
  reconocimientoF: FormControl;
  implementadoresF: FormControl;
  autoridadesF: FormControl;

  ///Data enviar
  etapa: string = "";
  tipoPR: string = "";
  modalidad: any[] = [];
  reconocimiento: string = "";
  implementadores: any[] = [];
  autoridades: any[] = [];
  depMuni: any[] = [];
  temporal: any[] = [];
  financiacion: any[] = [];
  ingresosFam: string = "";

  isOne = true;
  isTwo = true;
  isThree = true;
  isFour = true;

  val1: number = 0;
  min1: number = 0;
  max1: number = 1;
  options1: Options = {
    floor: 0,
    ceil: 2,
    translate: (value: number): string => {
      return "" + Intl.NumberFormat("es-CO").format(value);
    },
  };

  val2: number = 0;
  min2: number = 0;
  max2: number = 1;
  options2: Options = {
    floor: 0,
    ceil: 2,
    translate: (value: number): string => {
      return "" + Intl.NumberFormat("es-CO").format(value);
    },
  };

  val3: number = 0;
  min3: number = 0;
  max3: number = 1;
  options3: Options = {
    floor: 0,
    ceil: 2,
    translate: (value: number): string => {
      return "" + Intl.NumberFormat("es-CO").format(value);
    },
  };

  val4: number = 0;
  min4: number = 0;
  max4: number = 1;
  options4: Options = {
    floor: 0,
    ceil: 2,
    translate: (value: number): string => {
      return "" + Intl.NumberFormat("es-CO").format(value);
    },
  };

  val5: number = 0;
  min5: number = 0;
  max5: number = 1;
  options5: Options = {
    floor: 0,
    ceil: 2,
    translate: (value: number): string => {
      return "" + Intl.NumberFormat("es-CO").format(value);
    },
  };

  val6: number = 0;
  min6: number = 0;
  max6: number = 1;
  options6: Options = {
    floor: 0,
    ceil: 2,
    translate: (value: number): string => {
      return "" + Intl.NumberFormat("es-CO").format(value);
    },
    enforceStep: false,
    enforceRange: false,
  };

  bandera: boolean = false;

  constructor(
    private entidadService: EntidadService,
    private proyectoService: ProyectoService
  ) {
    this.etapaF = new FormControl("", [Validators.required]);
    this.tipoF = new FormControl("", [Validators.required]);
    this.modalidadesF = new FormControl("", [Validators.required]);
    this.reconocimientoF = new FormControl("", [Validators.required]);
    this.implementadoresF = new FormControl("", [Validators.required]);
    this.autoridadesF = new FormControl("", [Validators.required]);
    Chart.register(...registerables);
    Chart.register(ChartDataLabels);
  }

  ngOnInit(): void {
    this.myChart = new Chart("myChart", {
      type: "pie",
      data: {
        labels: this.labelDep,
        datasets: [
          {
            label: "PIE",
            data: this.dataDep,
            backgroundColor: [
              "#ff6665b3",
              "#04a3ffb3",
              "#2cc990b3",
              "#fdc156b3",
              "#fdc156b3",
              "#008893b3",
              "#b27256b3",
              "#e6f86eb3",
              "#a74dcfb3",
              "#ff9800b3",
            ],
            borderColor: ["#FFF", "#FFF", "#FFF", "#FFF", "#FFF", "#FFF"],
            borderWidth: 1,
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
            fullSize: true,
          },
          title: {
            display: true,
            text: "% área total intervenida bajo PSA por departamento",
            padding: {
              top: 30,
              bottom: 30,
            },
          },
          subtitle: {
            display: true,
            text: "Total del area intervenida: " + this.totalDep,
            font: {
              size: 12,
              family: "tahoma",
              weight: "normal",
              style: "italic",
            },
            padding: {
              bottom: 5,
            },
          },
          datalabels: {
            formatter: function (value, context) {
              return Math.round(value) + "%";
            },
            anchor: "center",
          },
        },
      },
    });

    this.myChart2 = new Chart("myChart2", {
      type: "doughnut",
      data: {
        labels: this.labelMod,
        datasets: [
          {
            data: this.dataMod,
            backgroundColor: [
              "#ff6665b3",
              "#04a3ffb3",
              "#2cc990b3",
              "#fdc156b3",
              "#fdc156b3",
              "#008893b3",
              "#b27256b3",
              "#e6f86eb3",
              "#a74dcfb3",
              "#ff9800b3",
            ],
            borderColor: ["#FFF", "#FFF", "#FFF"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            position: "right",
          },
          title: {
            display: true,
            text: "No. proyectos bajo PSA a nivel nacional",
            padding: {
              top: 10,
              bottom: 30,
            },
          },
          subtitle: {
            display: true,
            text: "Total de proyectos: " + this.totalMod,
            font: {
              size: 12,
              family: "tahoma",
              weight: "normal",
              style: "italic",
            },
            padding: {
              bottom: 15,
            },
          },
          datalabels: {
            formatter: function (value, context) {
              return Math.round(value) + "%";
            },
            anchor: "center",
          },
        },
      },
    });

    this.myChart3 = new Chart("myChart3", {
      type: "bar",
      data: {
        labels: this.labelHec,
        datasets: [
          {
            data: this.dataHec,
            backgroundColor: [
              "#ff6665b3",
              "#04a3ffb3",
              "#2cc990b3",
              "#fdc156b3",
              "#fdc156b3",
              "#008893b3",
              "#b27256b3",
              "#e6f86eb3",
              "#a74dcfb3",
              "#ff9800b3",
            ],
            borderColor: [
              "#35C849",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
              "rgba(205, 19, 4, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            min: 0,
            max: 6,
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Hectáreas",
              font: {
                weight: "bold",
              },
            },
            ticks: {
              callback: function (value, index, values) {
                return "" + Intl.NumberFormat("es-CO").format(Number(value));
              },
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: "Hectáreas bajo PSA por Autoridad Ambiental",
            padding: {
              top: 30,
              bottom: 30,
            },
          },
          datalabels: {
            anchor: "end",
            formatter: function (value) {
              return "" + Intl.NumberFormat("es-CO").format(Number(value));
            },
          },
        },
      },
    });

    this.myChart4 = new Chart("myChart4", {
      type: "bar",
      data: {
        labels: this.labelBen,
        datasets: [
          {
            label: "Total de mujeres beneficiarias",
            data: this.dataBenM,
            backgroundColor: ["#35C849a6"],
            borderColor: ["#35C849"],
            borderWidth: 1,
          },
          {
            label: "Total de hombres beneficiarios",
            data: this.dataBenH,
            backgroundColor: ["#ff5722a6"],
            borderColor: ["#ff5722"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            min: 0,
            max: 6,
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value, index, values) {
                return "" + Intl.NumberFormat("es-CO").format(Number(value));
              },
            },
          },
        },
        plugins: {
          legend: {
            position: "bottom",
          },
          title: {
            display: true,
            text: "Mujeres y hombres beneficiados de proyectos de PSA por Autoridad Ambiental",
            padding: {
              top: 30,
              bottom: 30,
            },
          },
          datalabels: {
            anchor: "end",
            formatter: function (value) {
              return "" + Intl.NumberFormat("es-CO").format(Number(value));
            },
          },
        },
      },
    });

    this.proyectoService
      .getEnumsFiltros(this.enums)
      .subscribe((dataEnum: any) => {
        this.acciones_reconocimiento =
          dataEnum.enumeraciones.acciones_reconocimiento;
        this.etapas_proyecto = dataEnum.enumeraciones.etapas_proyecto;
        this.modalidades_proyecto = dataEnum.enumeraciones.modalidades_proyecto;
        this.tipos_entidad = dataEnum.enumeraciones.tipos_entidad;
        this.tipos_proyecto = dataEnum.enumeraciones.tipos_proyecto;
      });
    this.entidadService.listarAutoridades().subscribe((data: any) => {
      this.listAutoridadesEnum = data.autoridades_ambientales;
    });

    this.entidadService.listarDepartamentos().subscribe((data: any) => {
      this.listaDepartamentos = data.ubicaciones;
    });

    this.proyectoService
      .getEnumsFiltros(this.enum)
      .subscribe((dataEnum: any) => {
        this.tipos_financiacion = dataEnum.enumeraciones.tipos_financiacion;
      });

    this.proyectoService
      .getEnumsFiltros(this.enum_promedio)
      .subscribe((dataEnum: any) => {
        this.promedio_ingresos = dataEnum.enumeraciones.promedio_ingresos;
      });

    this.proyectoService.getRangosFiltro().subscribe((dataRangos: any) => {
      this.options1.ceil = dataRangos.hectareas;
      this.options2.ceil = dataRangos.costo_oportunidad;
      this.options3.ceil = dataRangos.valor_incentivo;
      this.options4.ceil = dataRangos.valor_proyecto;
      this.options5.ceil = dataRangos.total_incentivos;
      this.options6.ceil = dataRangos.total_familias;
      this.annios = dataRangos.annios;

      this.datosFiltro.annio = this.annios[this.annios.length - 1];
      this.bandera = true;
      this.aplicarSeleccion();
    });
  }

  oneAcor(): void {
    const arowCollapse = document.getElementById("one");
    const txColor = document.getElementById("ac1");
    if (this.isOne) {
      if (arowCollapse.classList.contains("pi-down")) {
        arowCollapse.classList.remove("pi-down");
        arowCollapse.classList.add("pi-up");
      }
      if (txColor.classList.contains("font-color-g")) {
        txColor.classList.remove("font-color-g");
        txColor.classList.add("font-color-b");
      }
    } else {
      if (arowCollapse.classList.contains("pi-up")) {
        arowCollapse.classList.remove("pi-up");
        arowCollapse.classList.add("pi-down");
      }
      if (txColor.classList.contains("font-color-b")) {
        txColor.classList.remove("font-color-b");
        txColor.classList.add("font-color-g");
      }
    }
  }
  twoAcor(): void {
    const arowCollapse = document.getElementById("two");
    const txColor = document.getElementById("ac2");
    if (this.isTwo) {
      if (arowCollapse.classList.contains("pi-down")) {
        arowCollapse.classList.remove("pi-down");
        arowCollapse.classList.add("pi-up");
      }
      if (txColor.classList.contains("font-color-g")) {
        txColor.classList.remove("font-color-g");
        txColor.classList.add("font-color-b");
      }
    } else {
      if (arowCollapse.classList.contains("pi-up")) {
        arowCollapse.classList.remove("pi-up");
        arowCollapse.classList.add("pi-down");
      }
      if (txColor.classList.contains("font-color-b")) {
        txColor.classList.remove("font-color-b");
        txColor.classList.add("font-color-g");
      }
    }
  }
  threeAcor(): void {
    const arowCollapse = document.getElementById("three");
    const txColor = document.getElementById("ac3");
    if (this.isThree) {
      if (arowCollapse.classList.contains("pi-down")) {
        arowCollapse.classList.remove("pi-down");
        arowCollapse.classList.add("pi-up");
      }
      if (txColor.classList.contains("font-color-g")) {
        txColor.classList.remove("font-color-g");
        txColor.classList.add("font-color-b");
      }
    } else {
      if (arowCollapse.classList.contains("pi-up")) {
        arowCollapse.classList.remove("pi-up");
        arowCollapse.classList.add("pi-down");
      }
      if (txColor.classList.contains("font-color-b")) {
        txColor.classList.remove("font-color-b");
        txColor.classList.add("font-color-g");
      }
    }
  }
  fourAcor(): void {
    const arowCollapse = document.getElementById("four");
    const txColor = document.getElementById("ac4");
    if (this.isFour) {
      if (arowCollapse.classList.contains("pi-down")) {
        arowCollapse.classList.remove("pi-down");
        arowCollapse.classList.add("pi-up");
      }
      if (txColor.classList.contains("font-color-g")) {
        txColor.classList.remove("font-color-g");
        txColor.classList.add("font-color-b");
      }
    } else {
      if (arowCollapse.classList.contains("pi-up")) {
        arowCollapse.classList.remove("pi-up");
        arowCollapse.classList.add("pi-down");
      }
      if (txColor.classList.contains("font-color-b")) {
        txColor.classList.remove("font-color-b");
        txColor.classList.add("font-color-g");
      }
    }
  }

  getAnnio(event) {
    let selectedIndex: number = event.target["selectedIndex"];
    this.datosFiltro.annio = event.target.options[selectedIndex].item;
    this.datosFiltro.annio = Number(event.target.options[selectedIndex].value);
  }

  getEtapa(event) {
    let selectedIndex: number = event.target["selectedIndex"];
    this.etapa = event.target.options[selectedIndex].item;
    this.etapa = event.target.options[selectedIndex].value;
  }

  getTipo(event) {
    let selectedIndex: number = event.target["selectedIndex"];
    this.tipoPR = event.target.options[selectedIndex].item;
    this.tipoPR = event.target.options[selectedIndex].value;
  }

  getModalidad(event) {
    let selectedIndex: number = event.target["selectedIndex"];
    this.modalidad.push(this.modalidades_proyecto[selectedIndex - 1]);
    this.modalidades_proyecto.splice(selectedIndex - 1, 1);
  }

  delModalidad(index) {
    this.modalidades_proyecto.push(this.modalidad[index]);
    this.modalidad.splice(index, 1);
  }

  getReconocimiento(event) {
    let selectedIndex: number = event.target["selectedIndex"];
    this.reconocimiento = event.target.options[selectedIndex].item;
    this.reconocimiento = event.target.options[selectedIndex].value;
  }
  getImplementadores(event) {
    let selectedIndex: number = event.target["selectedIndex"];
    this.implementadores.push(this.tipos_entidad[selectedIndex - 1]);
    this.tipos_entidad.splice(selectedIndex - 1, 1);
  }
  delImplementadores(index) {
    this.tipos_entidad.push(this.implementadores[index]);
    this.implementadores.splice(index, 1);
  }

  getAutoridades(event) {
    let selectedIndex: number = event.target["selectedIndex"];
    this.autoridades.push(this.listAutoridadesEnum[selectedIndex - 1]);
    this.listAutoridadesEnum.splice(selectedIndex - 1, 1);
  }

  delAutoridades(index) {
    this.listAutoridadesEnum.push(this.autoridades[index]);
    this.autoridades.splice(index, 1);
  }

  getDep(event) {
    this.listaMunicipios = [];
    this.banderaMuni = false;
    let selectedIndex: number = event.target["selectedIndex"];
    this.entidadService
      .listarMunicipios(this.listaDepartamentos[selectedIndex - 1].codigo)
      .subscribe((res: any) => {
        this.listaMunicipios.push({
          codigo: selectedIndex - 1,
          codigoDep: this.listaDepartamentos[selectedIndex - 1].codigo,
          nombre: "Todos los municipios",
          codigo_parent: "1",
        });
        if (this.depMuni.length > 0) {
          let repetido = false;
          for (let elemento of res.ubicaciones) {
            for (let sel of this.depMuni) {
              if (elemento.codigo == sel.codigo) {
                repetido = true;
              }
            }
            if (!repetido) {
              this.listaMunicipios.push(elemento);
            } else {
            }
            repetido = false;
          }
        } else {
          for (let elemento of res.ubicaciones) {
            this.listaMunicipios.push(elemento);
          }
        }

        if (this.listaMunicipios) {
          for (let i = 0; i < this.listaMunicipios.length; i++) {
            this.listaMunicipios[i].dep =
              this.listaDepartamentos[selectedIndex - 1].nombre;
          }
        }

        this.banderaMuni = true;
      });
  }

  getMunicipios(event) {
    let selectedIndex: number = event.target["selectedIndex"];
    if (this.listaMunicipios[selectedIndex - 1].codigo_parent == 1) {
      this.depMuni.push(
        this.listaDepartamentos[this.listaMunicipios[selectedIndex - 1].codigo]
      );
      this.listaDepartamentos.splice(
        this.listaMunicipios[selectedIndex - 1].codigo,
        1
      );
      for (let i = 0; i < this.depMuni.length; i++) {
        if (
          this.depMuni[i].codigo_parent ==
          this.listaMunicipios[selectedIndex - 1].codigoDep
        ) {
          this.depMuni.splice(this.depMuni[i], 1);
          i--;
        }
      }
      this.listaMunicipios = [];
    } else {
      this.depMuni.push(this.listaMunicipios[selectedIndex - 1]);
      this.listaMunicipios.splice(selectedIndex - 1, 1);
      if (this.listaMunicipios[0].codigo_parent == 1) {
        this.listaMunicipios.splice(0, 1);
      }
    }
  }

  delMunDep(index) {
    const tam = this.listaMunicipios.length;
    if (this.depMuni[index].codigo.length < 3) {
      for (var i = 0; i < this.listaMunicipios.length; i++) {
        if (
          this.listaMunicipios[i].codigo_parent == this.depMuni[index].codigo
        ) {
          this.listaMunicipios.splice(i, 1);
          i--;
        }
      }
      this.listaDepartamentos.push(this.depMuni[index]);
      this.depMuni.splice(index, 1);
    } else if (this.depMuni[index].codigo.length >= 3) {
      let cantidad = 0;
      let mismoDep = false;
      let numIguales = 0;
      for (let numMun of this.depMuni) {
        if (this.depMuni[index].codigo == numMun.codigo) {
          cantidad++;
        }
      }
      for (let list of this.listaMunicipios) {
        if (list.codigo_parent == this.depMuni[index].codigo_parent) {
          mismoDep = true;
          numIguales++;
        }
      }
      if (numIguales > 0) {
        this.listaMunicipios.push(this.depMuni[index]);
        this.depMuni.splice(index, 1);
      } else {
        this.depMuni.splice(index, 1);
      }
    }
  }

  getFinanciacion(event) {
    let selectedIndex: number = event.target["selectedIndex"];
    this.financiacion.push(this.tipos_financiacion[selectedIndex - 1]);
    this.tipos_financiacion.splice(selectedIndex - 1, 1);
  }

  delFinanciacion(index) {
    this.tipos_financiacion.push(this.financiacion[index]);
    this.financiacion.splice(index, 1);
  }

  getIngFam(event) {
    let selectedIndex: number = event.target["selectedIndex"];
    this.ingresosFam = event.target.options[selectedIndex].item;
    this.ingresosFam = event.target.options[selectedIndex].value;
  }

  aplicarSeleccion() {
    this.loading = true;
    this.labelHec = [];
    this.dataHec = [];
    this.labelBen = [];
    this.dataBenH = [];
    this.dataBenM = [];
    this.labelDep = [];
    this.dataDep = [];
    this.labelMod = [];
    this.dataMod = [];

    this.datosFiltro.datos_basicos[0].etapa = this.etapa;
    this.datosFiltro.datos_basicos[0].tipo_proyecto = this.tipoPR;
    this.datosFiltro.datos_basicos[0].acciones = this.reconocimiento;
    this.datosFiltro.beneficiarios[0].nivel_ingresos = this.ingresosFam;

    if (this.modalidad.length > 0) {
      let tempMod: any[] = [];
      for (let mod of this.modalidad) {
        tempMod.push(mod.item);
      }
      this.datosFiltro.datos_basicos[0].modalidades = tempMod;
    } else {
      this.datosFiltro.datos_basicos[0].modalidades = [];
    }

    if (this.implementadores.length > 0) {
      let tempEnt: any[] = [];
      for (let imp of this.implementadores) {
        tempEnt.push(imp.item);
      }
      this.datosFiltro.datos_basicos[0].tipos_implementadores = tempEnt;
    } else {
      this.datosFiltro.datos_basicos[0].tipos_implementadores = [];
    }

    if (this.autoridades.length > 0) {
      let tempAut: any[] = [];
      for (let aut of this.autoridades) {
        tempAut.push(aut.codigo);
      }
      this.datosFiltro.datos_basicos[0].autoridades_ambientales = tempAut;
    } else {
      this.datosFiltro.datos_basicos[0].autoridades_ambientales = [];
    }

    if (this.financiacion.length > 0) {
      let tempFin: any[] = [];
      for (let fin of this.financiacion) {
        tempFin.push(fin.item);
      }
      this.datosFiltro.financiacion[0].tipos_financiacion = tempFin;
    } else {
      this.datosFiltro.financiacion[0].tipos_financiacion = [];
    }

    if (this.depMuni.length > 0) {
      let tempDep: any[] = [];
      let tempMun: any[] = [];
      for (let depMun of this.depMuni) {
        if (depMun.codigo.length >= 3) {
          tempMun.push(depMun.codigo);
        } else if (depMun.codigo.length < 3) {
          tempDep.push(depMun.codigo);
        }
      }
      this.datosFiltro.ubicaciones[0].departamentos = tempDep;
      this.datosFiltro.ubicaciones[0].municipios = tempMun;
    } else {
      this.datosFiltro.ubicaciones[0].departamentos = [];
      this.datosFiltro.ubicaciones[0].municipios = [];
    }
    let rangos1: any[] = [];
    let rangos2: any[] = [];
    let rangos3: any[] = [];
    let rangos4: any[] = [];
    let rangos5: any[] = [];
    let rangos6: any[] = [];
    rangos1.push(this.min1);
    rangos1.push(this.max1);
    rangos2.push(this.min2);
    rangos2.push(this.max2);
    rangos3.push(this.min3);
    rangos3.push(this.max3);
    rangos4.push(this.min4);
    rangos4.push(this.max4);
    rangos5.push(this.min5);
    rangos5.push(this.max5);
    rangos6.push(this.min6);
    rangos6.push(this.max6);
    this.datosFiltro.ubicaciones[0].hectareas = rangos1;
    this.datosFiltro.ubicaciones[0].costo_oportunidad = rangos2;
    this.datosFiltro.ubicaciones[0].valor_incentivo = rangos3;
    this.datosFiltro.financiacion[0].valor_proyecto = rangos4;
    this.datosFiltro.financiacion[0].total_incentivos = rangos5;
    this.datosFiltro.beneficiarios[0].total_familias = rangos6;

    let dataJson = JSON.stringify(this.datosFiltro);
    console.log("DataJson: ", dataJson);

    this.proyectoService.getHestareas(dataJson).subscribe((resH: any) => {
      if (resH) {
        this.labelHec = resH.details.autoridades;
        this.dataHec = resH.details.hectareas;
        this.myChart3.data.labels = this.labelHec;
        this.myChart3.data.datasets[0].data = this.dataHec;
        this.myChart3.update();

        if (this.labelHec.length >= 7) {
          this.buttonChart3 = true;
        }
      }
    });

    this.proyectoService.getBeneficiarios(dataJson).subscribe((resB: any) => {
      if (resB) {
        this.labelBen = resB.details.autoridades;
        this.dataBenH = resB.details.hombres;
        this.dataBenM = resB.details.mujeres;
        this.myChart4.data.labels = this.labelBen;
        this.myChart4.data.datasets[0].data = this.dataBenM;
        this.myChart4.data.datasets[1].data = this.dataBenH;
        this.myChart4.update();

        if (this.labelBen.length >= 7) {
          this.buttonChart4 = true;
        }
      }
    });

    this.proyectoService.getDep(dataJson).subscribe((resD: any) => {
      if (resD) {
        let totalPSA: number = 0;
        this.labelDep = resD.details.departamentos;
        for (let j = 0; j < resD.details.hectareas.length; j++) {
          totalPSA = totalPSA + resD.details.hectareas[j];
        }
        for (let j = 0; j < resD.details.hectareas.length; j++) {
          this.dataDep.push(
            Number(((resD.details.hectareas[j] / totalPSA) * 100).toFixed(2))
          );
        }

        this.totalDep = totalPSA;
        this.myChart.options.plugins.subtitle.text =
          "Total del area intervenida: " +
          Intl.NumberFormat("es-CO").format(this.totalDep);
        this.myChart.data.labels = this.labelDep;
        this.myChart.data.datasets[0].data = this.dataDep;
        this.myChart.update();
      }
    });

    this.proyectoService.getMod(dataJson).subscribe((resM: any) => {
      if (resM) {
        let proPSA: number = 0;
        this.labelMod = resM.details.traducciones;
        for (let j = 0; j < resM.details.traducciones.length; j++) {
          proPSA = proPSA + resM.details.proyectos[j];
        }
        for (let j = 0; j < resM.details.proyectos.length; j++) {
          this.dataMod.push(
            Number(((resM.details.proyectos[j] / proPSA) * 100).toFixed(2))
          );
        }
        this.totalMod = proPSA;
        this.myChart2.options.plugins.subtitle.text =
          "Total de proyectos: " +
          Intl.NumberFormat("es-CO").format(this.totalMod);
        this.myChart2.data.labels = this.labelMod;
        this.myChart2.data.datasets[0].data = this.dataMod;
        this.myChart2.update();
      }
      this.loading = false;
    });
  }

  derechaH() {
    this.myChart3.options.scales.x.min =
      Number(this.myChart3.options.scales.x.min) + 7;
    this.myChart3.options.scales.x.max =
      Number(this.myChart3.options.scales.x.max) + 7;
    if (
      this.myChart3.options.scales.x.max >=
      this.myChart3.data.datasets[0].data.length
    ) {
      this.myChart3.options.scales.x.min =
        this.myChart3.data.datasets[0].data.length - 7;
      this.myChart3.options.scales.x.max =
        this.myChart3.data.datasets[0].data.length;
    }
    this.myChart3.update();
  }
  izquierdaH() {
    this.myChart3.options.scales.x.min =
      Number(this.myChart3.options.scales.x.min) - 7;
    this.myChart3.options.scales.x.max =
      Number(this.myChart3.options.scales.x.max) - 7;
    if (this.myChart3.options.scales.x.min <= 0) {
      this.myChart3.options.scales.x.min = 0;
      this.myChart3.options.scales.x.max = 6;
    }
    this.myChart3.update();
  }

  derechaB() {
    this.myChart4.options.scales.x.min =
      Number(this.myChart4.options.scales.x.min) + 7;
    this.myChart4.options.scales.x.max =
      Number(this.myChart4.options.scales.x.max) + 7;
    if (
      this.myChart4.options.scales.x.max >=
      this.myChart4.data.datasets[0].data.length
    ) {
      this.myChart4.options.scales.x.min =
        this.myChart4.data.datasets[0].data.length - 7;
      this.myChart4.options.scales.x.max =
        this.myChart4.data.datasets[0].data.length;
    }
    this.myChart4.update();
  }
  izquierdaB() {
    this.myChart4.options.scales.x.min =
      Number(this.myChart4.options.scales.x.min) - 7;
    this.myChart4.options.scales.x.max =
      Number(this.myChart4.options.scales.x.max) - 7;
    if (this.myChart4.options.scales.x.min <= 0) {
      this.myChart4.options.scales.x.min = 0;
      this.myChart4.options.scales.x.max = 6;
    }
    this.myChart4.update();
  }
}
