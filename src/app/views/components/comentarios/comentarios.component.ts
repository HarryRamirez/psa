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

import { FormControl, FormGroup, Validators, Form } from "@angular/forms";
import { ProyectoService } from "@app/shared/services/proyecto.service";
import { Comments } from "@app/shared/models/proyecto.model";
import { UserService } from "../../../shared/services/user.service";

import Swal from "sweetalert2";

interface Comentario {
  campo_id: number;
  observacion: string;
  proyecto_id: number;
  usuario_id: number;
}

interface EditComentario {
  campo_id: number;
  observacion: string;
  proyecto_id: number;
  usuario_id: number;
  _method: string;
}

interface Respuesta {
  comentario_id: number;
  usuario_id: number;
  respuesta: string;
}

@Component({
  selector: "app-comentarios",
  templateUrl: "./comentarios.component.html",
  styleUrls: ["./comentarios.component.scss"],
})
export class ComentariosComponent implements OnInit {
  dataComent: any;
  arrComment: Comments[] = [];
  isCollapsed = true;
  disabled = false;
  arrCollapse = [];
  arrCollapseId = [];
  prueba = true;
  estados_proyecto: any[] = [];
  open: boolean = true;
  close: boolean = true;
  delete: boolean = true;
  resolved: boolean = true;
  campos_coments: any[] = [];
  idUsuario =
    JSON.parse(localStorage.getItem("prm")).id.toString() ||
    String(this.userService.userDataObj.id);
  tipoUser = JSON.parse(localStorage.getItem("prm")).rol.toString();
  @Input() idProyectoP: number = 0;
  @Input() idAutorP: number = 0;
  selectPre: string = "";
  selectedPreVal: number = 0;

  campo_id: FormControl;
  observacion: FormControl;
  respuestaFC: FormControl;
  editCampo: FormControl;
  editComent: FormControl;

  dataComentario: Comentario = {
    campo_id: 12,
    observacion: "Prueba desde ang",
    proyecto_id: 0,
    usuario_id: 0,
  };
  dataRespuesta: Respuesta = {
    comentario_id: 0,
    respuesta: "",
    usuario_id: 0,
  };

  constructor(
    public proyectoService: ProyectoService,
    public userService: UserService
  ) {
    this.campo_id = new FormControl("", [Validators.required]);
    this.observacion = new FormControl("", [Validators.required]);
    this.respuestaFC = new FormControl("", [Validators.required]);
    this.editCampo = new FormControl("", [Validators.required]);
    this.editComent = new FormControl("", [Validators.required]);
  }

  ngOnInit(): void {
    this.isCollapsed = true;
    this.getComment();
    this.getEnum();
    this.getCampos();
    //this.postComent();
  }

  collapses(): void {
    const arowCollapse = document.getElementById("arrowCollapse");
    if (this.isCollapsed) {
      if (arowCollapse.classList.contains("pi-cog")) {
        arowCollapse.classList.remove("pi-cog");
        arowCollapse.classList.add("pi-cog2");
      }
    } else {
      if (arowCollapse.classList.contains("pi-cog2")) {
        arowCollapse.classList.remove("pi-cog2");
        arowCollapse.classList.add("pi-cog");
      }
    }
  }

  getComment() {
    this.proyectoService
      .getComentarios(this.idProyectoP)
      .subscribe((result) => {
        this.dataComent = result;
        if (
          this.dataComent.comentarios &&
          this.dataComent.comentarios.length > 0
        ) {
          this.arrComment = [];
          this.arrCollapse = [];
          this.arrCollapseId = [];
          for (let item in this.dataComent.comentarios) {
            this.arrComment.push(this.dataComent.comentarios[item]);
            this.arrCollapse.push({ Flat: true });
            this.arrCollapseId.push([
              { Id: "id" + [item] },
              { divResp: false },
              { divEdit: false },
            ]);
          }
        } else {
        }
      });
  }

  getEnum() {
    this.proyectoService.getStatusPro().subscribe((result: any) => {
      this.estados_proyecto = result.enumeraciones.estados_comentario;
    });
  }

  changeForm(event: any) {
    if (event.target.value === "abierto") {
      this.open = true;
      this.close = false;
      this.delete = false;
      this.resolved = false;
    } else if (event.target.value === "cerrado") {
      this.open = false;
      this.close = true;
      this.delete = false;
      this.resolved = false;
    } else if (event.target.value === "eliminado") {
      this.open = false;
      this.close = false;
      this.delete = true;
      this.resolved = false;
    } else if (event.target.value === "corregido") {
      this.open = false;
      this.close = false;
      this.delete = false;
      this.resolved = true;
    } else if (event.target.value === "all") {
      this.open = true;
      this.close = true;
      this.delete = true;
      this.resolved = true;
    }
  }

  getCampos() {
    this.proyectoService.getCamposComents().subscribe((res: any) => {
      this.campos_coments = res;
    });
  }

  btnCancelar() {
    this.campo_id.reset("");
    this.observacion.reset("");
  }

  postComent() {
    this.dataComentario = {
      campo_id: this.campo_id.value,
      observacion: this.observacion.value,
      proyecto_id: this.idProyectoP,
      usuario_id: this.idUsuario,
    };
    this.proyectoService
      .postComents(this.dataComentario)
      .subscribe((result) => {
        this.getComment();
        this.campo_id.reset("");
        this.observacion.reset("");
      });
  }

  clickResponder(dataClick: any, index) {
    this.arrCollapseId[index][1].divResp = true;
  }

  btnCancelResponse(index: number) {
    this.respuestaFC.reset("");
    this.arrCollapseId[index][1].divResp = false;
  }

  postResponse(dataResponse: any, index: number) {
    this.dataRespuesta = {
      comentario_id: dataResponse.comentario.comentario_id,
      respuesta: this.respuestaFC.value,
      usuario_id: Number(this.idUsuario),
    };
    this.proyectoService
      .postResponse(this.dataRespuesta)
      .subscribe((result) => {
        this.respuestaFC.reset("");
        this.arrCollapseId[index][1].divResp = false;
        this.getComment();
      });
  }

  clickEditar(index) {
    let campoSelect = this.arrComment[index].comentario.campo;
    this.selectPre = campoSelect;
    let arrCamp = campoSelect.split(".");
    this.selectedPreVal = Number(arrCamp[0]);
    this.arrCollapseId[index][2].divEdit = true;
    this.arrCollapseId[index][1].divResp = false;
    this.editComent.setValue(this.arrComment[index].comentario.comentario);
  }

  btnCancelEdit(index) {
    this.editCampo.reset("");
    this.editComent.reset("");
    this.arrCollapseId[index][2].divEdit = false;
  }

  putEditComent(idCom) {
    let comEdit: EditComentario = {
      campo_id: 0,
      observacion: "",
      proyecto_id: 0,
      usuario_id: 0,
      _method: "",
    };
    let arrCamp = this.selectPre.split(".");
    if (this.selectedPreVal != this.editCampo.value && !!this.editCampo.value) {
      comEdit = {
        campo_id: this.editCampo.value,
        observacion: this.editComent.value,
        proyecto_id: this.idProyectoP,
        usuario_id: this.idUsuario,
        _method: "PUT",
      };
    } else {
      comEdit = {
        campo_id: this.selectedPreVal,
        observacion: this.editComent.value,
        proyecto_id: this.idProyectoP,
        usuario_id: this.idUsuario,
        _method: "PUT",
      };
    }
    this.proyectoService
      .putComment(comEdit, this.arrComment[idCom].comentario.comentario_id)
      .subscribe((res) => {
        this.getComment();
      });
    this.editCampo.reset("");
    this.editComent.reset("");
    this.arrCollapseId[idCom][2].divEdit = false;
  }

  clickResolver(idCom) {
    let data: any = {
      estado: "corregido",
      _method: "PUT",
      autor_id: this.idUsuario,
    };
    this.proyectoService
      .putComment(data, this.arrComment[idCom].comentario.comentario_id)
      .subscribe((res) => {
        this.getComment();
      });
  }

  sweetalertResolver(i) {
    Swal.fire({
      title: "Resolver comentario",
      text: "¿Está seguro de cambiar el estado comentario?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3366cc",
      cancelButtonColor: "#d33",
      confirmButtonText: "Resolver",
    }).then((result) => {
      if (result.isConfirmed) {
        this.clickResolver(i);
        Swal.fire("¡Corregido!", "El comentario ha sido corregido.", "success");
      }
    });
  }

  clickCerrar(idCom) {
    let data: any = {
      estado: "cerrado",
      _method: "PUT",
      autor_id: this.idUsuario,
    };
    this.proyectoService
      .putComment(data, this.arrComment[idCom].comentario.comentario_id)
      .subscribe((res) => {
        this.getComment();
      });
  }

  clickEliminar(idCom) {
    let data: any = {
      estado: "eliminado",
      _method: "PUT",
      autor_id: this.idUsuario,
    };
    this.proyectoService
      .putComment(data, this.arrComment[idCom].comentario.comentario_id)
      .subscribe((res) => {
        this.getComment();
      });
  }
  //(click)="clickEliminar(i)"
  opensweetalert(i) {
    Swal.fire({
      title: "Eliminar comentario",
      text: "Está seguro de eliminar este comentario?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3366cc",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.clickEliminar(i);
        Swal.fire("¡Eliminado!", "El comentario ha sido eliminado.", "success");
      }
    });
  }
}
