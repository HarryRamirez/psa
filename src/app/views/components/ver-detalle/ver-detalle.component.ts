import { Component, OnInit } from "@angular/core";
import { ProyectoService } from "@app/shared/services/proyecto.service";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
//import {ComentariosComponent} from '../../comentarios/comentarios.component';

@Component({
  selector: "app-ver-detalle",
  templateUrl: "./ver-detalle.component.html",
  styleUrls: ["./ver-detalle.component.scss"],
})
export class VerDetalleComponent implements OnInit {
  tipoUser: string;
  comFlat: boolean = false;
  mostrarTabla: boolean = false;
  Step1: boolean = false;
  Step2: boolean = false;
  Step3: boolean = false;
  Step4: boolean = false;
  Step5: boolean = false;
  Actor: string = JSON.parse(localStorage.getItem("prm")).rol.toLowerCase();
  proyectoData: any;
  ordenarProy: any[] = [];
  datosBasicos: any[] = [];
  etapaProyecto: string;
  autoridades: any[] = [];
  ubicaciones: any[] = [];
  financiacion: any[] = [];
  gastos: any = {};
  nombreFuente: any[] = [];
  anexos: any = {};
  s3_url: string = "";
  idProyecto: number;
  idAutor: number;
  idUser: number = JSON.parse(localStorage.getItem("prm")).id;

  constructor(
    private proyectoService: ProyectoService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    //consigue el id del proyecto a consultar
    this.activatedRoute.params.subscribe(({ idProyecto }) => {
      this.idProyecto = idProyecto;
      this.Step1 = true;
      this.seeComents();
      this.proyectoService
        .getProjectData(idProyecto)
        .subscribe((result: any) => {
          console.log(result);
          this.proyectoData = result.proyecto;
          this.proyectoService.dataPro = result.proyecto;
          this.idAutor = this.proyectoData.autor;
          this.etapaProyecto = this.proyectoData.datos_basicos.etapa;
          this.mostrarTabla = true;

          if (this.proyectoData.datos_basicos.autoridades.length > 0) {
            for (let item in this.proyectoData.datos_basicos.autoridades) {
              this.datosBasicos.push(
                this.proyectoData.datos_basicos.autoridades[item].nombre
              );
            }
          }

          if (this.proyectoData.ubicaciones.length > 0) {
            for (let item in this.proyectoData.ubicaciones) {
              this.ubicaciones.push(this.proyectoData.ubicaciones[item]);
            }
          }

          if (this.proyectoData.datos_basicos.etapa === "inversion") {
            this.gastos = this.proyectoData.financiacion.gastos;
          }

          if (this.proyectoData.financiacion.fuentes.length > 0) {
            this.financiacion = this.proyectoData.financiacion.fuentes;
          }

          if (this.proyectoData.financiacion.otras) {
            if (this.proyectoData.financiacion.otras.length > 0) {
              for (let item in this.proyectoData.financiacion.otras) {
                this.financiacion.push(
                  this.proyectoData.financiacion.otras[item].fuente
                );
              }
            }
          }

          if (this.proyectoData.financiacion.entidades) {
            if (this.proyectoData.financiacion.entidades.length > 0) {
              let arr: any[] = [];
              for (let item in this.proyectoData.financiacion.entidades) {
                for (let ent in this.proyectoData.financiacion.entidades[
                  item
                ]) {
                  arr.push(
                    this.proyectoData.financiacion.entidades[item][ent].nombre
                  );
                }
                this.nombreFuente.push(arr);
                arr = [];
              }
            }
          }

          if (this.proyectoData.anexos) {
            if (this.proyectoData.anexos.archivos.length > 0) {
              this.anexos.propietarios =
                this.proyectoData.anexos.archivos.filter((item) => {
                  return item.etiqueta === "propietario";
                });
              this.anexos.ocupantes = this.proyectoData.anexos.archivos.filter(
                (item) => {
                  return item.etiqueta === "ocupante";
                }
              );
              this.anexos.proyectos = this.proyectoData.anexos.archivos.filter(
                (item) => {
                  return item.etiqueta === "proyecto";
                }
              );
              this.s3_url = this.proyectoData.anexos.url_base;
            }
          }
        });
    });
  }

  seeComents() {
    const clickRowCont = document.getElementById("idRowCont");
    this.tipoUser = JSON.parse(localStorage.getItem("prm")).rol.toString();
    if (this.tipoUser == "Autoridad" || this.tipoUser == "Ministerio") {
      this.comFlat = true;
    } else {
      this.comFlat = false;
      if (clickRowCont.classList.contains("col-10")) {
        clickRowCont.classList.remove("col-10");
        clickRowCont.classList.add("col-12");
      }
    }
  }

  btnNext() {
    if (this.Step1 == true) {
      this.Step2 = true;
      this.Step1 = false;
    } else if (this.Step2 == true) {
      this.Step3 = true;
      this.Step2 = false;
    } else if (this.Step3 == true && this.etapaProyecto === "inversion") {
      this.Step4 = true;
      this.Step3 = false;
    } else if (this.Step4 == true) {
      this.Step5 = true;
      this.Step4 = false;
    }
  }

  btnPrev() {
    if (this.Step5 == true) {
      this.Step4 = true;
      this.Step5 = false;
    } else if (this.Step4 == true) {
      this.Step3 = true;
      this.Step4 = false;
    } else if (this.Step3 == true) {
      this.Step2 = true;
      this.Step3 = false;
    } else if (this.Step2 == true) {
      this.Step1 = true;
      this.Step2 = false;
    }
  }
}
