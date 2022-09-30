import {
  Component,
  OnInit,
  Directive,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
} from "@angular/core";
// import {MenuService} from '../../../core/menu/menu.service';

// import {UserService} from '@app/shared/services/user.service';
import { ProyectoService } from "@app/shared/services/proyecto.service";
import { Data } from "@app/shared/models/proyecto.model";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

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
  selector: "app-entidad",
  templateUrl: "./entidad.component.html",
  styleUrls: ["./entidad.component.scss"],
})
export class EntidadComponent implements OnInit {
  // menuItems: Array<any>;

  mostrarTabla: boolean = false;

  proyectoData: any;

  dataTable: Data[];

  // page = 1;

  // collection = 0;

  size = 5;

  // pageSize = 0;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(
    private proyectoService: ProyectoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.getInformation(this.page);
    // const userData = JSON.parse(localStorage.getItem('prm'));
    this.getInformation();
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

  getInformation() {
    this.proyectoService.getAll().subscribe((result) => {
      if (result) {
        this.mostrarTabla = true;
        this.proyectoData = result;
        this.dataTable = this.proyectoData;

        for (let item in result) {
          this.dataTable[item].idFill = pad(result[item].id, 5);
        }

        function pad(str, max) {
          str = str.toString();
          return str.length < max ? pad("0" + str, max) : str;
        }

        let populationHeader = this.headers.find(
          (h) => h.sortable === "fecha_registro"
        );
        populationHeader.sort.emit({
          column: "fecha_registro",
          direction: "desc",
        });
        populationHeader.direction = "desc";
      } else {
        this.mostrarTabla = false;
      }
    });
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
}
