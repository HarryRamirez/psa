import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "@environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class EntidadService {
  private baseUrl: string = environment.apiBase;

  constructor(private http: HttpClient) {}

  listarAutoridades(): Observable<any> {
    return this.http.get<any>(this.baseUrl + "autoridades");
  }

  listarDepartamentos() {
    return this.http.get(this.baseUrl + "divipola?superior=1");
  }

  listarMunicipios(departamento: string) {
    return this.http.get(this.baseUrl + "divipola?superior=" + departamento);
  }

  listarDatosBasicos() {
    return this.http.get(
      this.baseUrl +
        "proyectos/listar/enumeraciones?enumeraciones=etapas_proyecto,tipos_proyecto,modalidades_proyecto,tipos_entidad,acciones_reconocimiento"
    );
  }

  listarFuentesDeFinanciacion() {
    return this.http.get(
      this.baseUrl +
        "proyectos/listar/enumeraciones?enumeraciones=potenciales_fuentes_financiacion"
    );
  }

  getTiposFuenteFinanciacion() {
    return this.http.get(
      this.baseUrl +
        "proyectos/listar/enumeraciones?enumeraciones=tipos_financiacion"
    );
  }

  getNivelesIngreso() {
    return this.http.get(
      this.baseUrl + "enumeraciones?consultar=niveles_ingreso"
    );
  }

  getIncentivosAcuerdos() {
    return this.http.get(
      this.baseUrl +
        "proyectos/listar/enumeraciones?enumeraciones=metodos_estimacion,metodos_pago,periodicidades_pago,tipos_acuerdo"
    );
  }

  getFuentesShape() {
    return this.http.get(
      this.baseUrl + "enumeraciones?consultar=fuentes_shape"
    );
  }

  addUbicacion(datosUbicacion: any): any {
    return this.http.post(
      this.baseUrl + "proyectos/registrar/ubicaciones",
      datosUbicacion
    );
  }

  addDatosBasicos(datosProyecto: any): any {
    return this.http.post(this.baseUrl + "proyectos/", datosProyecto);
  }

  addBeneficiarios(datosBeneficiarios: any): any {
    return this.http.post(
      this.baseUrl + "proyectos/registrar/beneficiarios",
      datosBeneficiarios
    );
  }

  addFuentes(datosFuentes: any): any {
    return this.http.post(
      this.baseUrl + "proyectos/registrar/fuentes-financiacion",
      datosFuentes
    );
  }

  saveFuentesFinanciacionInversion(datosFuentes: any): any {
    return this.http.post(
      this.baseUrl + "proyectos/registrar/financiacion-gastos",
      datosFuentes
    );
  }

  saveIncentivosAcuerdos(datosIncentivos: any): any {
    return this.http.post(
      this.baseUrl + "proyectos/registrar/incentivo-y-acuerdos",
      datosIncentivos
    );
  }

  saveAnexos(datosAnexos: any): any {
    return this.http.post(this.baseUrl + "proyectos/anexos", datosAnexos);
  }
}
