import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup, FormBuilder, Validators, Form } from "@angular/forms";
import {AppService} from '../../../shared/services/app.service';
import { EntidadService } from "../../../shared/services/entidad.service";
import { UserService } from "../../../shared/services/user.service";
import { Router } from '@angular/router';

interface Usuario {
  nombres: string;
  apellidos: string;
  codigo_pais: string;
  telefono: number;
  correo_electronico: string;
  tipo_persona: string;
  cod_autoridad_ambiental: number;
}

@Component({
  selector: 'app-register-psa',
  templateUrl: './register-psa.component.html',
  styleUrls: ['./register-psa.component.scss']
})
export class RegisterPSAComponent implements OnInit {

  
  dataBasicaForm: FormGroup;

  nombres = new FormControl('', [Validators.required]);
  apellidos = new FormControl('', [Validators.required]);
  prefijo = new FormControl('+57', [Validators.required]);
  telefono = new FormControl('', [Validators.minLength(3), Validators.maxLength(5)]);
  correo = new FormControl('', [Validators.required]);
  tipoPersona = new FormControl('', [Validators.required]);
  nombreEntidad = new FormControl('', [Validators.required]);

  disableTextbox =  true;

  listaTipPer = [
    { name: 'Persona Natural', abbreviation: 'Persona ', disabled: false },
    { name: 'Representante Autoridad Ambiental', abbreviation: 'Representante Autoridad Ambiental', disabled: false },
  ];

  listAutoridadesEnum: any[] = [];

  constructor(
    private entidadService: EntidadService,
    private appService: AppService,
    private userService: UserService,
    public fb: FormBuilder,
    private router: Router,
  ) {
    // this.dataBasicaForm = this.fb.group({
    //   nombres: ['', [Validators.required]],
    //   apellidos: ['', [Validators.required]],
    //   telefono: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(9)]],
    //   correo: ['', [Validators.required]],
    //   tipoPersona: ['', [Validators.required]],
    //   nombreEntidad: ['', [Validators.required]],
    // });
  }

  ngOnInit(): void {
    this.cargarDatos();
    this.dataBasicaForm = this.fb.group({
      nombres: this.nombres,
      apellidos: this.apellidos,
      prefijo: this.prefijo,
      telefono: this.telefono,
      correo: this.correo,
      tipoPersona: this.tipoPersona,
      nombreEntidad: this.nombreEntidad,
    });
    this.entidadService.listarAutoridades().subscribe((data: any) => {
      this.listAutoridadesEnum = data.autoridades_ambientales;
    });
  }

  cargarDatos(){
    const user = this.appService.currentUser;
    console.log("User: ",user);
    this.nombres.setValue(user.nombres);
    this.nombres.setValue(user.nombres);
    this.apellidos.setValue(user.apellidos);
    this.correo.setValue(user.email);
  }

  checkFormStatus(){

  }

  sendData(){
    console.log("cod_autoridad: ",this.dataBasicaForm.value.nombreEntidad);
    let userData: Usuario = {
      nombres: this.dataBasicaForm.value.nombres,
      apellidos: this.dataBasicaForm.value.apellidos,
      codigo_pais: "+57",
      telefono: parseInt(this.dataBasicaForm.value.telefono),
      correo_electronico: this.dataBasicaForm.value.correo,
      tipo_persona: this.dataBasicaForm.value.tipoPersona,
      cod_autoridad_ambiental: parseInt(this.dataBasicaForm.value.nombreEntidad)
    }

    console.log("Datos a enviar: ", userData);
    this.userService.registerUser(userData).subscribe( result =>{
      console.log("result:", result);
      this.userService.checkUser(userData.correo_electronico).subscribe((result:any) => {
        if(result.datos_usuario){
          let usr: any = {
            id: result.datos_usuario.usuario_id,
            email: result.datos_usuario.correo_electronico,
            idAutoridad: result.datos_usuario.cod_autoridad_ambiental,
            rol: result.datos_usuario.rol,
          };
          let str = JSON.stringify(usr);
          localStorage.setItem("prm", str);
          if(result.datos_usuario.rol == 'Ministerio'){
            this.router.navigate(['proyectos/buscar']);
          } else if (result.datos_usuario.rol == 'Autoridad'){
            this.router.navigate(['autoridad']);
          } else if (result.datos_usuario.rol == 'Entidad'){
            this.router.navigate(['proyectos']);
          } else {
            console.log("Rol no definido");
            this.router.navigate(['principal']);
          }
        }
      });
    }, err => {
      console.log("Error:", err.error);
    });
  }

  cancelar(){
    this.router.navigate(['/principal']);
    this.appService.clearSessionInfoFromLocalStorage();
    localStorage.clear();
  }

}
