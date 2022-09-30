import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { environment } from "@environments/environment";
// import {AppService} from '@shared/services';

interface Usuario {
  nombres: string;
  apellidos: string;
  codigo_pais: string;
  telefono: number;
  correo_electronico: string;
  tipo_persona: string;
  cod_autoridad_ambiental: number;
}

@Injectable({
  providedIn: "root",
})
export class UserService {
  private readonly userData: any = {
    id: "",
    email: "",
    idAutoridad: "",
    rol: "",
  };

  get userDataObj() {
    return { ...this.userData };
  }

  path: string = environment.apiBase;
  userMail: string; // this.userModel.currentUser.email || localStorage.getItem('cds'); usuario3@test.com

  checkUserData(userMailParam: string = "") {
    this.userMail = userMailParam;
    console.log("Correo: "+userMailParam);
    console.log("dirección: ", this.path+"usuarios?email="+this.userMail);
    this.http.get(`${this.path}usuarios?email=${this.userMail}`).subscribe({
      next: (resp: any) => {
        console.log("Console respuesta: "+resp);
        this.userData.id = resp.datos_usuario.usuario_id;
        this.userData.email = resp.datos_usuario.correo_electronico;
        this.userData.idAutoridad = resp.datos_usuario.cod_autoridad_ambiental;
        this.userData.rol = resp.datos_usuario.rol;
      },
      error: (e) => console.log("Error: ",e),
      complete: () => {
        const encodeData = JSON.stringify(this.userData);
        console.log("Redireccionar");
        localStorage.setItem("prm", encodeData);
        //window.location.reload();
      },
    });
  }

  registerUser(user: Usuario){
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    return this.http.post(`${this.path}usuarios`, user, httpOptions);
  }

  checkUser(userEmail: string){
    return this.http.get(`${this.path}usuarios?email=${userEmail}`);
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const dataEncoded = JSON.parse(localStorage.getItem("prm"));
    const firstPath = location.pathname.split("/")[1];

    // console.log(this.route.snapshot.params['email']);

    this.route.queryParams.subscribe((params) => {
      console.log("Params: ", params);
      // if (!dataEncoded || dataEncoded.email !== params.email) {
      //   if (params.email || dataEncoded) {
      //     this.checkUserData(params.email);
      //   } else {
      //     this.router.navigateByUrl(firstPath + "?email=usuario3@test.com");
      //   }
      // }
    });
  }


}
