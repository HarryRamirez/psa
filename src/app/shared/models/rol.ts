export class Rol {
  icorreo_electronico = '';
  usuario_id = 0;
  cod_autoridad_ambiental = 0;
  rol = '';
}

export interface Rol2 {
  datos_usuario: {
    icorreo_electronico: string;
    usuario_id: number;
    cod_autoridad_ambiental: string;
    rol: string;
  };
}
