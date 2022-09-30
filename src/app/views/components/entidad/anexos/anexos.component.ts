import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { switchMap } from "rxjs/operators";
import { EntidadService } from "@app/shared/services/entidad.service";
import { ProyectoService } from "@app/shared/services/proyecto.service";

interface AnexoType {
  proyecto_id: string;
  anexos: any[];
  uuid: string;
  eliminados: any[];
}

@Component({
  selector: "app-anexos",
  templateUrl: "./anexos.component.html",
  styleUrls: ["./anexos.component.scss"],
})
export class AnexosComponent implements OnInit {
  formAnexos = new FormGroup({
    propietario: new FormControl("", [Validators.required]),
    ocupante: new FormControl("", [Validators.required]),
    proyecto: new FormControl("", [Validators.required]),
    fileSource: new FormControl("", [Validators.required]),
  });

  editProyectoMode: boolean = false;
  arrayAnexosAgregados: any[] = [];
  arrayAnexosNuevos: any[] = [];
  arrayAnexosEliminados: any[] = [];
  proyecto_id: string = "";
  formReady: boolean = false;
  dataToSend: AnexoType = {
    proyecto_id: "",
    anexos: [],
    uuid: "",
    eliminados: [],
  };
  loadingfiles: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private entidadService: EntidadService,
    private proyectoService: ProyectoService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ idProyecto }) => {
      this.proyecto_id = idProyecto;
      this.dataToSend.proyecto_id = idProyecto;

      this.activatedRoute.params
        .pipe(
          switchMap(({ idProyecto }) =>
            this.proyectoService.getAnexosProyecto(idProyecto, "anexos")
          )
        )
        .subscribe((proyecto: any) => {
          if (proyecto.archivos.length > 0) {
            this.editProyectoMode = true;
            let infoAnexo: any = {};
            proyecto.archivos.forEach((val, i) => {
              const randomUuid: string = Math.random()
                .toString(36)
                .substring(2, 10);
              infoAnexo.proyecto_id = this.proyecto_id;
              infoAnexo.anexos = [val];
              infoAnexo.uuid = randomUuid;

              this.arrayAnexosAgregados[i] = infoAnexo;
              infoAnexo = {};
            });
            console.log(this.arrayAnexosAgregados);
          }
        });
    });
  }

  get frm() {
    return this.formAnexos.controls;
  }

  deleteAnexos(uuid): void {
    if (this.editProyectoMode) {
      this.arrayAnexosEliminados.push(
        this.arrayAnexosAgregados.find((element: any) => element.uuid === uuid)
      );
    }

    this.arrayAnexosAgregados = this.arrayAnexosAgregados.filter(
      (element: any) => element.uuid !== uuid
    );

    if (this.arrayAnexosAgregados.length <= 0) {
      this.formAnexos.controls.propietario.enable();
      this.formAnexos.controls.ocupante.enable();
      this.formAnexos.controls.proyecto.enable();
    }
  }

  toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  checkTag(): void {
    if (
      this.arrayAnexosAgregados.some(
        (elem) => elem.anexos[0].etiqueta === "propietario"
      )
    ) {
      this.formAnexos.controls["ocupante"].disable();
    }

    if (
      this.arrayAnexosAgregados.some(
        (elemen) => elemen.anexos[0].etiqueta === "ocupante"
      )
    ) {
      this.formAnexos.controls["propietario"].disable();
    }
  }

  checkFile(file: any, tag: string): void {
    let fileAdded: boolean = false;
    if (file.size > 2097152) {
      alert("Error: Recuerda que el tamaño máximo del archivo es 2MB");
      this.formAnexos.controls[tag].reset();
      this.formReady = false;
    } else if (file.size <= 2097152) {
      this.formReady = true;
    }
    this.arrayAnexosAgregados.forEach((element) => {
      if (element.anexos[0].nombre === file.name) {
        this.formReady = false;
        fileAdded = true;
        this.formAnexos.controls[tag].reset();
      }
    });
    if (fileAdded) alert("El archivo ya fue agreagdo");
  }

  async onFileChange(event: any, tag): Promise<void> {
    event.preventDefault();

    if (event.target.files && event.target.files.length > 0) {
      const file: File = event.target.files[0];

      await this.checkFile(file, tag);
      if (this.formReady === true) {
        const randomUuid: string = Math.random().toString(36).substring(2, 10);
        const itemsObject: any = {};

        try {
          itemsObject.nombre = file.name;
          itemsObject.archivo = await this.toBase64(file);
          itemsObject.etiqueta = tag;
          itemsObject.fuente = "";

          this.dataToSend.proyecto_id = this.proyecto_id;
          this.dataToSend.anexos = [itemsObject];
          this.dataToSend.uuid = randomUuid;

          this.arrayAnexosAgregados.push({ ...this.dataToSend });

          if (this.editProyectoMode) {
            if (this.arrayAnexosEliminados.length > 0) {
              this.dataToSend.eliminados = this.arrayAnexosEliminados.map(
                (element) => {
                  return element.anexos[0].nombre;
                }
              );
            }
            this.arrayAnexosNuevos.push({ ...this.dataToSend });
          }
        } catch (error) {
          console.log(error);
          this.formAnexos.controls[tag].reset();
          alert("Error al cargar el archivo, intenta con otro");
          return;
        }

        this.dataToSend.anexos = [];
        this.dataToSend.uuid = "";
        this.checkTag();
      }

      this.formAnexos.controls[tag].reset();
    }
  }

  handleAndSend(element: any, array: any): void {
    let ctn = 0;
    this.loadingfiles = true;
    this.formAnexos.controls.propietario.disable();
    this.formAnexos.controls.ocupante.disable();
    this.formAnexos.controls.proyecto.disable();

    this.entidadService.saveAnexos(element).subscribe(
      (response) => console.log(response),
      (error) => console.log(error),
      () => {
        ctn++;
        document.getElementById(element.uuid).style.backgroundColor = "#80D0B5";
        document.getElementById(element.uuid).style.transform =
          "transition: all 0.5s ease-in-out";
        if (ctn === array.length) {
          setTimeout(() => {
            this.formAnexos.controls.propietario.enable();
            this.formAnexos.controls.ocupante.enable();
            this.formAnexos.controls.proyecto.enable();
            this.loadingfiles = false;
            this.router.navigate(["/proyectos"]);
          }, 2000);
        }
      }
    );
  }

  saveAnexos(): void {
    if (this.editProyectoMode) {
      this.arrayAnexosNuevos.forEach((element) => {
        this.handleAndSend(element, this.arrayAnexosNuevos);
      });
    } else {
      this.arrayAnexosAgregados.forEach((element) => {
        this.handleAndSend(element, this.arrayAnexosAgregados);
      });
    }
  }
}
