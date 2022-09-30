import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { UserService } from "@app/shared/services/user.service";
import { ProyectoService } from "@app/shared/services/proyecto.service";

interface History {
  acciones: any;
  estados: any;
}

interface Status {
  estado_despues: string;
  traduccion: string;
  tiempo_inicio: string;
}

interface Action {
  autor: string;
  actividad_detalle: string;
  fecha_hora: string;
}

@Component({
  selector: "app-historial-proyecto",
  templateUrl: "./historial-proyecto.component.html",
  styleUrls: ["./historial-proyecto.component.scss"],
})
export class HistorialProyectoComponent implements OnInit {
  idAutor: number;
  idUser: number = JSON.parse(localStorage.getItem("prm")).id;
  tipoUser: string = JSON.parse(localStorage.getItem("prm")).rol.toString();
  idPro: string;
  dtaPro: any;
  arrStatus: Status[];
  arrActions: Action[];
  userRol: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private proyectoService: ProyectoService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getIdPro();
  }

  validarAcceso() {
    if (
      this.idAutor == this.idUser ||
      this.tipoUser == "Autoridad" ||
      this.tipoUser == "Ministerio"
    ) {
      console.log("Usuario válido");
      this.getHistorial();
    } else {
      console.log("Entra a error 403");
      this.router.navigate([`403`]);
    }
  }

  getIdPro() {
    this.idPro = this.activatedRoute.snapshot.paramMap.get("idProyecto");
    this.proyectoService.getProjectData(this.idPro).subscribe((result: any) => {
      this.proyectoService.dataPro = result.proyecto;
      this.dataPro();
    });
  }

  dataPro() {
    this.dtaPro = this.proyectoService.dataPro;
    this.idAutor = this.dtaPro.autor;
    this.validarAcceso();
  }
  getHistorial() {
    this.proyectoService
      .getHisPro(this.dtaPro.id)
      .subscribe((res: Partial<History>) => {
        this.arrStatus = res.estados;
        this.arrActions = res.acciones;
      });
  }
}
