import {
  AfterViewInit,
  Component,
  OnInit,
  Directive,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
} from "@angular/core";
import { MenuService } from "../../../core/menu/menu.service";

import Swal from "sweetalert2";
import { AppService } from "@shared/services/app.service";
import { AutoridadService } from "@app/shared/services/autoridad.service";
import { ProyectoService } from "@app/shared/services/proyecto.service";
import { Data } from "@app/shared/models/proyecto.model";
import { Rol, Rol2 } from "@app/shared/models/rol";
import { result, forEach } from "lodash";
import { Router, RouterLink } from "@angular/router";
import { UserService } from "../../../shared/services/user.service";

export type SortColumn = keyof Data | "";
export type SortDirection = "asc" | "desc" | "";
const rotate: { [key: string]: SortDirection } = {
  asc: "desc",
  desc: "",
  "": "asc",
};

const compare = (v1: string | number, v2: string | number) =>
  v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}
@Directive({
  selector: "th[sortable]",
  host: {
    "[class.asc]": 'direction === "asc"',
    "[class.desc]": 'direction === "desc"',
    "(click)": "rotate()",
  },
})
export class NgbdSortableHeader {
  @Input() sortable: SortColumn = "";
  @Input() direction: SortDirection = "";
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.sortable, direction: this.direction });
  }
}

@Component({
  selector: "app-autoridad",
  templateUrl: "./autoridad.component.html",
  styleUrls: ["./autoridad.component.scss"],
})
export class AutoridadComponent implements OnInit {
  menuItems: Array<any>;
  mostrarTabla: boolean = false;
  proyectoData: any;
  dataTable: Data[];
  size = 5;
  numPro = 0;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  ordenarProy: any[] = [];
  userRol: string;

  constructor(
    private router: Router,
    private appService: AppService,
    public menu: MenuService,
    public autoridadService: AutoridadService,
    public proyecto: ProyectoService,
    private userService: UserService
  ) {
    this.menuItems = menu.getMenu();
  }

  ngOnInit(): void {
    this.userRol = JSON.parse(localStorage.getItem("prm")).id.toString() || String(this.userService.userDataObj.id);
    this.getProjEnt();
  }

  getProjEnt() {
    this.autoridadService
      .listProjEntidades(this.userRol)
      .subscribe((result) => {
        let data: any = result;

        if (data.length > 0) {
          for (let item in data) {
            this.ordenarProy.push(data[item]);
            this.ordenarProy[item].id = pad(data[item].id, 5);
          }
        }

        function pad(str, max) {
          str = str.toString();
          return str.length < max ? pad("0" + str, max) : str;
        }
        if (this.ordenarProy.length > 0) {
          this.mostrarTabla = true;
          this.proyectoData = this.ordenarProy;
          this.dataTable = this.proyectoData;
        } else {
          this.mostrarTabla = false;
        }
      });
  }

  onSort({ column, direction }: SortEvent) {
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = "";
      }
    });

    if (direction === "" || column === "") {
      this.dataTable = this.proyectoData;
    } else {
      this.dataTable = [...this.proyectoData].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === "asc" ? res : -res;
      });
    }
  }

  opensweetalert() {
    Swal.fire({
      title: "Eliminar Proyecto",
      text: "Estás seguro de eliminar este proyecto?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Eliminado!", "El proyecto ha sido eliminado.", "success");
      }
    });
  }

  seeViewDetails(proy: any) {
    let idProyectoTrimed = Number(proy["id"]);

    this.proyecto.infoProyecto = proy;
    this.proyecto.idProyecto = idProyectoTrimed.toString();
    this.router.navigate([`/proyectos/${this.proyecto.idProyecto}`]);
  }
}
