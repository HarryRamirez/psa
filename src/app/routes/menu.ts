const menuItems = [
  [
    // {
    //   id: 'sidebar.home.heading',
    //   text: 'Main Navigation',
    //   heading: true
    // },
    {
      id: 'sidebar.home.dashboard',
      text: 'Inicio',
      link: '/inicio',
      icon: 'icon-home',
    },
  ],
  [
    // {
    //   id: 'sidebar.admin.heading',
    //   text: 'Administración',
    //   heading: true,
    // },
    {
      id: 'sidebar.admin.heading',
      text: 'Menú de opciones',
      heading: true,
    },
    // {
    //   id: 'module.admin.users',
    //   text: 'Usuarios',
    //   link: '/usuarios',
    //   icon: 'icon-people',
    // },
    {
      id: 'module.admin.users',
      text: 'Mis Proyectos',
      link: '/entidad',
      icon: 'icon-people',
    },
  ],
  [
    {
      id: 'sidebar.account.heading',
      text: 'Su cuenta',
      heading: true,
    },
    {
      id: 'sidebar.account.profile',
      text: 'Datos personales',
      link: '/cuenta/informacion',
      icon: 'icon-user',
    },
    {
      id: 'sidebar.account.password',
      text: 'Cambio de contraseña',
      link: '/cuenta/contrasenia',
      icon: 'icon-key',
    },
    {
      id: 'sidebar.account.logout',
      text: 'Cerrar sesión',
      click: 'logout',
      icon: 'icon-logout',
    },
  ],
  /*
  [
    {
      id: 'sidebar.develop.heading',
      text: 'Develop',
      heading: true,
    },
    {
      id: 'sidebar.develop.users',
      text: 'CRUD',
      link: '/develop/crud',
      icon: 'icon-list',
    },
    {
      id: 'sidebar.develop.charts',
      text: 'Charts',
      link: '/develop/charts',
      icon: 'icon-chart',
    },
    {
      id: 'sidebar.develop.translations',
      text: 'Translations',
      link: '/develop/translations',
      icon: 'icon-globe',
    },
    {
      id: 'sidebar.develop.notifications',
      text: 'Notifications',
      link: '/develop/notifications',
      icon: 'icon-speech',
    },
    {
      id: 'sidebar.develop.domains',
      text: 'Dominios controlados',
      link: '/develop/domains',
      icon: 'icon-book-open',
    },
    {
      id: 'sidebar.develop.forbiddenResource',
      text: 'Forbidden',
      link: '/develop/forbidden-resource',
      icon: 'icon-list',
    },
    {
      id: 'sidebar.develop.notFound',
      text: 'Not found',
      link: '/develop/zzz',
      icon: 'icon-list',
    },
  ],
  */
];

export let menu = [];
for (const section of menuItems) {
  menu = menu.concat(section);
}
