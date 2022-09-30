import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { switchMap } from "rxjs/operators";
import { EntidadService } from "@app/shared/services/entidad.service";
import { ProyectoService } from "@app/shared/services/proyecto.service";
import { Subject } from "rxjs";

interface ShapeType {
  proyecto_id: string;
  anexos: any[];
  geojson: any;
  uuid: string;
  eliminados: any[];
}

@Component({
  selector: "app-shapes",
  templateUrl: "./shapes.component.html",
  styleUrls: ["./shapes.component.scss"],
})
export class ShapesComponent implements OnInit {
  @ViewChild("formShapes") formShapes!: NgForm;

  arrayShapesAdded: any[] = [];
  arrayShapesDeleted: any[] = [];
  arrayNewShapes: any[] = [];
  fuentesShape: any[] = [];
  formReady: boolean = false;
  proyecto_id: string = "";
  fuenteSelected: string = "";
  geojson: File;
  loadingfiles: boolean = false;
  editProyectoMode: boolean = false;
  setGeoJson: string;
  // setGeoJson: Subject<any>;
  payload: ShapeType = {
    proyecto_id: "",
    anexos: [],
    geojson: "",
    uuid: "",
    eliminados: [],
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private entidadService: EntidadService,
    private proyectoService: ProyectoService
  ) {
    // this.setGeoJson = new Subject<any>();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ idProyecto }) => {
      this.proyecto_id = idProyecto;
      this.payload.proyecto_id = idProyecto;

      this.activatedRoute.params
        .pipe(
          switchMap(({ idProyecto }) =>
            this.proyectoService.getAnexosProyecto(idProyecto, "shapes")
          )
        )
        .subscribe((data: any) => {
          if (data.proyecto.anexos.archivos.length > 0) {
            console.log(data.proyecto.anexos.geojson);
            this.setGeoJson = data.proyecto.anexos.geojson;
            // this.setGeoJson.next(data.proyecto.anexos.geojson);
            this.editProyectoMode = true;
            let infoAnexo: any = {};
            data.proyecto.anexos.archivos.forEach((val, i) => {
              const randomUuid: string = Math.random()
                .toString(36)
                .substring(2, 10);
              infoAnexo.proyecto_id = this.proyecto_id;
              infoAnexo.anexos = [val];
              infoAnexo.uuid = randomUuid;

              this.arrayShapesAdded[i] = infoAnexo;
              infoAnexo = {};
            });
            this.fuenteSelected = data.proyecto.anexos.archivos[0].fuente;
          }
        });
    });
    this.entidadService.getFuentesShape().subscribe((data: any) => {
      this.fuentesShape = data.enumeraciones.fuentes_shape;
    });
  }

  checkFile(file: File): void {
    let fileAdded: boolean = false;
    if (file.size > 2097152) {
      alert("Error: Recuerda que el tamaño máximo del archivo es 2MB");
      this.formReady = false;
    } else if (file.size <= 2097152) {
      this.formReady = true;
    }
    this.arrayShapesAdded.forEach((element) => {
      if (element.anexos[0].nombre === file.name) {
        this.formReady = false;
        fileAdded = true;
      }
    });
    if (fileAdded) alert("El archivo ya fue agreagdo");
  }

  deleteAnexos(uuid): void {
    if (this.editProyectoMode) {
      this.arrayShapesDeleted.push(
        this.arrayShapesAdded.find((element: any) => element.uuid === uuid)
      );
      this.payload.eliminados = this.arrayShapesDeleted;
    }

    this.arrayShapesAdded = this.arrayShapesAdded.filter(
      (element: any) => element.uuid !== uuid
    );
    this.formShapes.control.markAsDirty();
  }

  toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  async addShape(newShape: File): Promise<void> {
    await this.checkFile(newShape);

    if (this.formReady === true) {
      const randomUuid: string = Math.random().toString(36).substring(2, 10);
      const itemsObject: any = {};

      try {
        itemsObject.nombre = newShape.name;
        itemsObject.archivo = await this.toBase64(newShape);
        itemsObject.etiqueta = "shape";
        itemsObject.fuente = this.fuenteSelected;

        this.payload.proyecto_id = this.proyecto_id;
        this.payload.anexos = [itemsObject];
        this.payload.uuid = randomUuid;
      } catch (error) {
        console.log(error);
        alert("Error al cargar el archivo, intenta con otro");
        return;
      }
    }
  }

  addGeoJSON(newGeoJSON: File): void {
    this.payload.geojson = newGeoJSON;
    this.geojson = newGeoJSON;

    if (
      this.payload.anexos[0].nombre &&
      this.payload.anexos[0].nombre !== undefined
    ) {
      try {
        this.arrayShapesAdded.push({ ...this.payload });

        if (this.editProyectoMode) {
          if (this.arrayShapesDeleted.length > 0) {
            this.payload.eliminados = this.arrayShapesDeleted.map((element) => {
              return element.anexos[0].nombre;
            });
          }
          this.arrayNewShapes.push({ ...this.payload });
        }
      } catch (error) {
        console.log(error);
        throw new Error("Error al cargar el archivo, intenta con otro");
      }
    }

    this.payload.anexos = [];
    this.payload.geojson = "";
    this.payload.uuid = "";
  }

  ctnSh: number = 0;

  handleAndSave(element: any, array: any): void {
    this.loadingfiles = true;

    this.entidadService.saveAnexos(element).subscribe(
      (response) => {
        if (response.code === 200) {
          this.ctnSh++;
          document.getElementById(element.uuid).style.backgroundColor =
            "#80D0B5";
          document.getElementById(element.uuid).style.transform =
            "transition: all 0.5s ease-in-out";
          if (this.ctnSh === array.length) {
            setTimeout(() => {
              this.loadingfiles = false;
              this.router.navigate(["/proyectos"]);
            }, 2000);
          }
        }
      },
      (error) => console.log(error)
    );
  }

  saveAnexos(event: any): void {
    event.preventDefault();

    if (this.editProyectoMode) {
      if (this.arrayNewShapes.length > 0) {
        this.arrayNewShapes.forEach((element) => {
          element.anexos[0].fuente = this.fuenteSelected;
          element.geojson = this.geojson;
        });
        this.arrayNewShapes.forEach((element) => {
          this.handleAndSave(element, this.arrayNewShapes);
        });
      } else {
        if (this.arrayShapesDeleted.length > 0) {
          this.payload.eliminados = this.arrayShapesDeleted.map((element) => {
            return element.anexos[0].nombre;
          });
        }
        this.handleAndSave(this.payload, this.arrayShapesAdded);
      }
    } else {
      this.arrayShapesAdded.forEach((element) => {
        element.anexos[0].fuente = this.fuenteSelected;
        element.geojson = this.geojson;
      });
      this.arrayShapesAdded.forEach((element) => {
        this.handleAndSave(element, this.arrayShapesAdded);
      });
    }
    // const setFuente = this.arrayShapesAdded.map(e => ({...e.anexos[0], fuente: this.fuenteSelected}));
    // const arrayShapesReady = this.arrayShapesAdded.map(e => ({...e, geojson: this.geojson}));
  }
}
