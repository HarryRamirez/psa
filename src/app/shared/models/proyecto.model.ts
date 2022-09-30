export class Data {
  id = 0;
  nombre = "";
  fecha_registro = new Date();
  estado = "";
  traduccion = "";
}

export class Proyecto {
  data = new Data();
}
export interface Comments {
  comentario: {
    autor_id: number;
    comentario_id: number;
    campo: string;
    comentario: string;
    estado: string;
    traduccion: string;
    respuestas: number;
  };
  respuestas: [
    {
      texto: string;
      autor_id: number;
      fecha_creacion: string;
    }
  ];
}
