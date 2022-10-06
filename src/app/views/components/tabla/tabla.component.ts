import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.scss']
})
export class TablaComponent implements OnInit {

  usuarios: any [] = [
    {
        "estado": "borrador",
        "traduccion": "En construcci\u00f3n",
        "nombre": "dfgdfg",
        "fecha_registro": "2022-09-16 14:20:12",
        "id": 441,
        "correcciones": 0,
        "observaciones": 0
    },
    {
        "estado": "borrador",
        "traduccion": "En construcci\u00f3n",
        "nombre": "rtyrty",
        "fecha_registro": "2022-09-16 15:07:22",
        "id": 442,
        "correcciones": 0,
        "observaciones": 0
    },
    {
        "estado": "borrador",
        "traduccion": "En construcci\u00f3n",
        "nombre": "PRUEBA ACTUALIZACION",
        "fecha_registro": "2022-09-16 15:11:47",
        "id": 443,
        "correcciones": 0,
        "observaciones": 0
    },
    {
        "estado": "borrador",
        "traduccion": "En construcci\u00f3n",
        "nombre": "fyuytu",
        "fecha_registro": "2022-09-16 15:18:31",
        "id": 444,
        "correcciones": 0,
        "observaciones": 0
    },
    {
        "estado": "borrador",
        "traduccion": "En construcci\u00f3n",
        "nombre": "another brick in the wall",
        "fecha_registro": "2022-09-16 15:24:35",
        "id": 445,
        "correcciones": 0,
        "observaciones": 0
    },
    {
        "estado": "borrador",
        "traduccion": "En construcci\u00f3n",
        "nombre": "NUEVO PROYECTO DE PRUEBA",
        "fecha_registro": "2022-09-16 20:22:36",
        "id": 446,
        "correcciones": 0,
        "observaciones": 0
    },
    {
        "estado": "borrador",
        "traduccion": "En construcci\u00f3n",
        "nombre": "NUEVO PROYECTO DE PRUEBA",
        "fecha_registro": "2022-09-16 20:26:56",
        "id": 447,
        "correcciones": 0,
        "observaciones": 0
    },
    {
        "estado": "borrador",
        "traduccion": "En construcci\u00f3n",
        "nombre": "Validar que no existan autoridades duplicadas",
        "fecha_registro": "2022-09-16 23:57:08",
        "id": 449,
        "correcciones": 0,
        "observaciones": 0
    },
    {
        "estado": "borrador",
        "traduccion": "En construcci\u00f3n",
        "nombre": "Nuevo Proyecto",
        "fecha_registro": "2022-09-17 03:38:28",
        "id": 450,
        "correcciones": 0,
        "observaciones": 0
    },
    {
        "estado": "borrador",
        "traduccion": "En construcci\u00f3n",
        "nombre": "ghjghj",
        "fecha_registro": "2022-09-18 21:15:33",
        "id": 453,
        "correcciones": 0,
        "observaciones": 0
    },
    {
        "estado": "borrador",
        "traduccion": "En construcci\u00f3n",
        "nombre": "creo que lo da\u00f1\u00e9 co\u00f1o",
        "fecha_registro": "2022-09-19 14:49:53",
        "id": 454,
        "correcciones": 0,
        "observaciones": 0
    },
    {
        "estado": "borrador",
        "traduccion": "En construcci\u00f3n",
        "nombre": "ghjhgj",
        "fecha_registro": "2022-09-19 15:10:27",
        "id": 456,
        "correcciones": 0,
        "observaciones": 0
    },
    {
        "estado": "borrador",
        "traduccion": "En construcci\u00f3n",
        "nombre": "dgfhfg",
        "fecha_registro": "2022-09-27 23:01:23",
        "id": 504,
        "correcciones": 0,
        "observaciones": 0
    },
    {
        "estado": "borrador",
        "traduccion": "En construcci\u00f3n",
        "nombre": "fghgfh",
        "fecha_registro": "2022-09-28 16:52:39",
        "id": 506,
        "correcciones": 0,
        "observaciones": 0
    },
    {
        "estado": "borrador",
        "traduccion": "En construcci\u00f3n",
        "nombre": "Proyecto Nuevo",
        "fecha_registro": "2022-09-29 14:26:31",
        "id": 508,
        "correcciones": 0,
        "observaciones": 0
    },
    {
        "estado": "registrado",
        "traduccion": "Registrado",
        "nombre": "Nombre Proyecto PSA",
        "fecha_registro": "2022-09-07 02:10:35",
        "id": 402,
        "correcciones": 0,
        "observaciones": 0
    },
    {
        "estado": "registrado",
        "traduccion": "Registrado",
        "nombre": "Nombre Proyecto PSA",
        "fecha_registro": "2022-09-07 02:18:55",
        "id": 403,
        "correcciones": 0,
        "observaciones": 0
    },
    {
        "estado": "registrado",
        "traduccion": "Registrado",
        "nombre": "Proyecto Javier 20220907 2319",
        "fecha_registro": "2022-09-08 04:23:38",
        "id": 407,
        "correcciones": 0,
        "observaciones": 0
    },
    {
        "estado": "registrado",
        "traduccion": "Registrado",
        "nombre": "yuiyui",
        "fecha_registro": "2022-09-08 17:03:54",
        "id": 408,
        "correcciones": 0,
        "observaciones": 0
    },
    {
        "estado": "registrado",
        "traduccion": "Registrado",
        "nombre": "fghfgh",
        "fecha_registro": "2022-09-08 17:07:59",
        "id": 409,
        "correcciones": 0,
        "observaciones": 0
    },
    {
        "estado": "registrado",
        "traduccion": "Registrado",
        "nombre": "inversion",
        "fecha_registro": "2022-09-08 20:56:14",
        "id": 411,
        "correcciones": 0,
        "observaciones": 0
    },
    {
        "estado": "registrado",
        "traduccion": "Registrado",
        "nombre": "fhghfg",
        "fecha_registro": "2022-09-10 21:20:15",
        "id": 412,
        "correcciones": 0,
        "observaciones": 0
    },
    {
        "estado": "registrado",
        "traduccion": "Registrado",
        "nombre": "ghjhg",
        "fecha_registro": "2022-09-11 18:48:56",
        "id": 413,
        "correcciones": 0,
        "observaciones": 0
    },
    {
        "estado": "registrado",
        "traduccion": "Registrado",
        "nombre": "dfgdfg",
        "fecha_registro": "2022-09-14 20:39:10",
        "id": 415,
        "correcciones": 0,
        "observaciones": 0
    },
    {
        "estado": "registrado",
        "traduccion": "Registrado",
        "nombre": "Proyecto Javier 20220914 2349",
        "fecha_registro": "2022-09-15 04:54:16",
        "id": 416,
        "correcciones": 0,
        "observaciones": 0
    },
    {
        "estado": "registrado",
        "traduccion": "Registrado",
        "nombre": "Proyecto Javier 20220916 0003",
        "fecha_registro": "2022-09-15 05:03:04",
        "id": 417,
        "correcciones": 0,
        "observaciones": 0
    },
    {
        "estado": "registrado",
        "traduccion": "Registrado",
        "nombre": "Proyecto Javier 20220916 0010",
        "fecha_registro": "2022-09-15 05:10:24",
        "id": 418,
        "correcciones": 0,
        "observaciones": 0
    },
    {
        "estado": "registrado",
        "traduccion": "Registrado",
        "nombre": "Proyecto Javier 20220722 0920",
        "fecha_registro": "2022-09-15 05:28:41",
        "id": 419,
        "correcciones": 0,
        "observaciones": 0
    },
    {
        "estado": "registrado",
        "traduccion": "Registrado",
        "nombre": "ah no, s\u00ed est\u00e1 bueo",
        "fecha_registro": "2022-09-19 15:03:59",
        "id": 455,
        "correcciones": 0,
        "observaciones": 0
    },
    {
        "estado": "registrado",
        "traduccion": "Registrado",
        "nombre": "ath",
        "fecha_registro": "2022-09-27 22:48:27",
        "id": 503,
        "correcciones": 0,
        "observaciones": 0
    }
]

  constructor() { }

  ngOnInit(): void {
  }

}
