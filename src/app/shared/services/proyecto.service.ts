import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Proyecto } from "../models/proyecto.model";
import { UserService } from "./user.service";
import { environment } from "@environments/environment";

@Injectable({
  providedIn: "root",
})
export class ProyectoService {
  constructor(private userService: UserService, private http: HttpClient) {}

  path: string = environment.apiBase;
  pathProList: string = "proyectos/listar/";
  idUser: string;
  rolUser: string;
  infoProyecto: any = {};
  proyectoData: any = { editMode: false };
  idProyecto: string = "";
  dataPro: any = {};

  getAll() {
    let userDataCached = JSON.parse(localStorage.getItem("prm"));
    console.log("userDataCached: ", userDataCached);
    this.idUser = userDataCached.id.toString() || String(this.userService.userDataObj.id);
    // this.rolUser = userDataCached.rol === "Entidad" ? "autor" : "revisor";

    return this.http.get<Proyecto>(
      `${this.path}proyectos?rol=autor&usuario_id=${this.idUser}`
    );
  }

  getComentarios(idPro: number) {
    this.idUser =
      JSON.parse(localStorage.getItem("prm")).id.toString() ||
      String(this.userService.userDataObj.id);
    return this.http.get(
      `${this.path}comentarios?proyecto_id=${idPro}&usuario_id=${this.idUser}&rol=revisor`
    );
  }

  getStatusPro() {
    return this.http.get(
      `${this.path}${this.pathProList}enumeraciones?enumeraciones=estados_comentario`
    );
  }
  /// Campos para el select de agregar comentario http://127.0.0.1:8000/api/campos
  getCamposComents() {
    return this.http.get(`${this.path}campos`);
  }

  postComents(coments: any) {
    return this.http.post(`${this.path}comentarios`, coments);
  }

  putComment(coments: any, idComent: number) {
    console.log("Comentario PUT: " + this.path + "comentarios/" + idComent);
    console.log("Data: ", coments);
    return this.http.post(`${this.path}comentarios/${idComent}`, coments);
  }

  postResponse(response: any) {
    return this.http.post(`${this.path}respuestas`, response);
  }

  getProjectData(paramIdProyecto: string = this.idProyecto) {
    localStorage.setItem("proyecto_id", paramIdProyecto);
    this.idProyecto = paramIdProyecto;
    return this.http.get(`${this.path}proyectos/${paramIdProyecto}`);
  }

  getHisPro(paramIdProyecto: number) {
    return this.http.get(`${this.path}proyectos/${paramIdProyecto}/historial`);
  }

  getEnumsFiltros(paramEnums: string) {
    return this.http.get(`${this.path}enumeraciones?consultar=${paramEnums}`);
    //http://127.0.0.1:8000/api/enumeraciones?consultar=etapas_proyecto,tipos_proyecto,modalidades_proyecto,acciones_reconocimiento,tipos_entidad
  }

  getRangosFiltro() {
    return this.http.get(`${this.path}filtros`);
  }

  getFiltro(dataFil: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    return this.http.post(`${this.path}proyectos/buscar`, dataFil, httpOptions);
  }

  getHestareas(dataH: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    return this.http.post(`${this.path}hectareas`, dataH, httpOptions);
  }

  getBeneficiarios(dataB: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    return this.http.post(`${this.path}beneficiarios`, dataB, httpOptions);
  }

  getDep(dataD: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    return this.http.post(`${this.path}departamentos`, dataD, httpOptions);
  }

  getMod(dataM: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    return this.http.post(`${this.path}modalidades`, dataM, httpOptions);
  }

  getEtapaProyecto(paramIdProyecto: string, etapa: string) {
    return this.http.get(
      `${this.path}proyectos/${paramIdProyecto}?consultar=${etapa}`
    );
  }

  getAnexosProyecto(paramIdProyecto: string, type) {
    return this.http.get(
      `${this.path}proyectos/${paramIdProyecto}?consultar=${type}`
    );
  }
}
