💻 RematePos-Frontend

Interfaz de Usuario del Sistema rematePOS


📖 Descripción

RematePos-Frontend es el repositorio encargado de la creación y diseño de la interfaz de usuario (UI) para rematePOS, una plataforma de punto de venta distribuido, orientada a cacharrerías y locales de remates.
Desde aquí, los usuarios pueden operar el sistema de forma cómoda y segura: gestionar inventarios, registrar ventas y soportar el flujo de facturación electrónica en tiempo real (según el proceso definido por el backend y su integración con la DIAN).

El frontend está desarrollado con React, priorizando una interfaz fluida, modular y fácil de mantener. Se comunica con el ecosistema de microservicios mediante un API Gateway, utilizando JWT para controlar sesiones, permisos y acceso a funcionalidades.


🏗️ Arquitectura y Diseño


El frontend sigue un enfoque moderno y componible, pensado para crecer sin volverse un “enredo”. Se apoya en:

React: Construcción de una UI dinámica, por componentes, con navegación y pantallas reutilizables.

Consumo vía API Gateway: Un solo punto de entrada para acceder a los microservicios del sistema.

JWT: Manejo de autenticación, autorización y protección de rutas según rol.

Docker (opcional): Despliegue portable del frontend, fácil de montar en cualquier ambiente.

GitHub: Control de versiones, colaboración por ramas y seguimiento del avance.

Nota: PostgreSQL y MongoDB hacen parte de la capa backend (persistencia de datos). El frontend no se conecta directo a las bases de datos; siempre consume APIs.


📦 Funcionalidades


En la interfaz se contemplan, entre otras, estas capacidades:

Gestión de Inventarios: Listar productos, ver detalles, actualizar existencias y consultar movimientos.

Registro de Ventas (POS): Construcción del carrito, cálculo de totales, y confirmación de transacciones.

Facturación Electrónica: Pantallas para generar la factura y seguir su estado, según el flujo del servicio de facturación.

Gestión de Usuarios y Roles: Accesos por permisos (por ejemplo: cajero, administrador, supervisor).

Reportes e Informes: Visualización de métricas clave (ventas, inventario, cierres, tendencias).


🔄 Integración con el Ecosistema rematePOS


RematePos-Frontend se integra principalmente con:

API Gateway: Punto central de consumo para inventarios, ventas, usuarios, clientes, remates y facturación.

Microservicios Backend: Encargados de lógica de negocio y reglas del sistema.

Módulo de Facturación Electrónica: Orquesta la emisión y el ciclo de vida de la factura, incluyendo integración con proveedor tecnológico y lineamientos DIAN (desde backend).


🚀 Proyección


El frontend está diseñado para escalar y adaptarse a más puntos de atención. A futuro, se plantea:

Soporte multi-sede (varios locales y cajas).

Mejoras de accesibilidad (navegación clara, contraste, atajos, lectura).


👥 Equipo de Desarrollo


Carlos Andrés Villamil

Andrés Felipe Ardila Fajardo

Juan Sebastián Murcia Vargas

Kevin Santiago Cuesta Hernández

📌 Estado del Proyecto


🚧 En desarrollo — Proyecto académico para la asignatura Sistemas Distribuidos, con proyección a evolucionar hacia una solución real para pequeñas y medianas empresas.
