import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "@environments/environment";

@Injectable({
  providedIn: "root",
})
export class AutoridadService {
  private _arrayAutoridades: string[] = [];

  user: string = environment.apiBase + "usuarios?email=";
  ruta: string = environment.apiBase + "revisar/proyectos";
  proyectos: string = environment.apiBase + "proyectos?rol=revisor&usuario_id=";
  divipola: string = environment.apiBase + "divipola";
  detalle: string =
    environment.apiBase + "proyectos/consultar/proyecto?proyecto_id=";

  get autoridades(): string[] {
    return [...this._arrayAutoridades];
  }

  addAutoridad(autoridad: string) {
    this._arrayAutoridades.push(autoridad);
  }

  removeAutoridad(i: number) {
    this._arrayAutoridades.splice(i, 1);
  }

  private _arrayEntidades: string[] = [];

  get entidades(): string[] {
    return [...this._arrayEntidades];
  }

  addEntidad(entidad: string) {
    this._arrayEntidades.push(entidad);
  }

  removeEntidad(i: number) {
    this._arrayEntidades.splice(i, 1);
  }

  userLogData(correo: string) {
    return this.http.get(`${this.user}${correo}`);
  }

  listProjEntidads(idAutoridad: string) {
    return this.http.get(`${this.ruta}/entidad?usuario_id=${idAutoridad}`);
  }
  //http://127.0.0.1:8000/api/revisar/proyectos/entidad?usuario_id=30
  //http://127.0.0.1:8000/api/proyectos?rol=revisor&usuario_id=37
  listProjEntidades(idUser: string) {
    return this.http.get(`${this.proyectos}${idUser}`);
  }

  detalleProjEntidad(idProyecto: number) {
    return this.http.get(
      `${this.detalle}${idProyecto}&consultar=datosbasicos,ubicaciones,financiacion`
    );
  }

  listarAutoridades() {
    return this.http.get(`${this.ruta}/listar/autoridades-ambientales`);
  }

  listarDepartamentos() {
    return this.http.get(`${this.divipola}?superior=1`);
  }

  listarMunicipios(departamento: string) {
    return this.http.get(`${this.divipola}?superior=` + departamento);
  }

  listarDatosBasicos() {
    return this.http.get(
      `${this.ruta}/listar/enumeraciones?enumeraciones=etapas_proyecto,tipos_proyecto,modalidades_proyecto,tipos_entidad,acciones_reconocimiento`
    );
  }

  addUbicacion(datosUbicacion: any): any {
    return this.http.post(`${this.ruta}/registrar/ubicaciones`, datosUbicacion);
  }

  addDatosBasicos(datosEmpleado: any): any {
    // return this.clienteHttp.post(this.API+"?insertar=1", datosEmpleado);
    return this.http.post(`${this.ruta}/`, datosEmpleado);
  }

  addBeneficiarios(datosBeneficiarios: any): any {
    return this.http.post(
      `${this.ruta}/registrar/beneficiarios`,
      datosBeneficiarios
    );
  }

  listarFuentesDeFinanciacion() {
    return this.http.get(
      environment.apiBase +
        "proyectos/listar/enumeraciones?enumeraciones=potenciales_fuentes_financiacion"
    );
  }

  addFuentes(datosFuentes: any): any {
    return this.http.post(
      environment.apiBase + "proyectos/registrar/fuentes-financiacion",
      datosFuentes
    );
  }

  constructor(private http: HttpClient) {}
}
