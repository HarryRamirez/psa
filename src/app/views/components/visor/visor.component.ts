import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import { NGXLogger } from "ngx-logger";

declare const Visor: any;

@Component({
  selector: "app-visor",
  templateUrl: "./visor.component.html",
  styleUrls: ["./visor.component.scss"],
})
export class VisorComponent implements OnInit {
  visor: typeof Visor;

  @Output()
  addShape: EventEmitter<File> = new EventEmitter();

  @Output()
  addGeoJSON: EventEmitter<File> = new EventEmitter();

  @Input()
  setGeoJson: string = null;

  constructor(private logger: NGXLogger) {}

  ngOnInit() {
    this.initVisor();
  }
  // Visor.l -> acceder a funciones del visor
  private initVisor() {
    const layers = [
      {
        url: "https://mapas.parquesnacionales.gov.co/services/pnn_sinap/wms?",
        type: "wms",
        name: "Runap",
        visible: true,
        topic: "Runap",
        order: 1,
        description: "Capa de Runap",
        options: {
          layers: "pnn_sinap:rep_por_geom",
          query: `1=0`,
          transparent: true,
          format: "image/png",
        },
      },
    ];
    this.visor = new Visor(
      "visor1",
      layers,
      {
        zoom: true,
        scale: true,
        measure: true,
        baseMap: true,
      },
      (state: string) => {
        let features = JSON.parse(state).features;
        features = Buffer.from(JSON.stringify(features)).toString("base64");
        this.addGeoJSON.emit(features);
        this.logger.info("json en base64", features);
      }
    );
    if (this.setGeoJson) {
      console.log(this.setGeoJson);
      // this.visor.setState(this.setGeoJson);
    }
    // Visor.l.addLayer({
    //   url: "https://mapas.parquesnacionales.gov.co/services/pnn_sinap/wms?",
  }

  loadLayer(layer: any) {
    // this.visor.addLayer(layer);
    // Visor.l.geoJSON(layer).addTo(map);
  }

  fileAdded(file: File) {
    this.addShape.emit(file);
    // this.logger.info('fileAdded', file);
    this.visor._readSHP(file, {
      type: "shp",
      name: "name",
      visible: true,
      topic: "topic",
      order: 1,
      description: "description",
      // url: undefined,
      options: { format: "image/png" },
    });
  }
}
