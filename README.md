# **Clínica OnLine - Sistema de Gestión**

## **Descripción del Proyecto**

El sistema de gestión de la **Clínica OnLine** es una aplicación diseñada para optimizar la administración de turnos, perfiles de usuarios (pacientes, especialistas y administradores) y la historia clínica de los pacientes. Desarrollado en varios sprints, este sistema permite un manejo eficiente de consultas médicas, historial clínico y estadísticas de la clínica.

---

## **Funcionalidades Principales**

### **Sprint 1**
- **Página de Bienvenida**: Accesos rápidos al sistema (Login y Registro).
- **Registro de Usuarios**:
  - **Pacientes**: Registro con datos personales, imágenes y validación de campos.
  - **Especialistas**: Registro con especialidades y aprobación previa de un administrador.
  - **Administradores**: Generación de usuarios con permisos especiales desde la sección Usuarios.
- **Login**:
  - Autenticación con validación de correo electrónico.
  - Control de acceso según el perfil del usuario.
- **Gestión de Usuarios**:
  - Visualización, habilitación o inhabilitación de especialistas por parte de administradores.
  - Creación y edición de perfiles de usuario.

### **Sprint 2**
- **Carga y Visualización de Turnos**:
  - **Pacientes**: Visualización de turnos solicitados, con filtros avanzados y acciones como cancelar turnos, completar encuestas o calificar atención.
  - **Especialistas**: Gestión de turnos asignados, con opciones de aceptación, cancelación y finalización.
  - **Administrador**: Visualización y cancelación de turnos.
- **Solicitar Turno**:
  - Selección de especialidad, especialista, día y horario disponible en los próximos 15 días.
  - Sistema de validación de disponibilidad horaria.
- **Mi Perfil**:
  - Visualización de datos personales.
  - Gestión de horarios para especialistas.

### **Sprint 3**
- **Historia Clínica**:
  - Registro de datos médicos (altura, peso, temperatura, presión y datos dinámicos).
  - Acceso según perfil:
    - Pacientes: desde "Mi Perfil".
    - Especialistas: pacientes atendidos.
    - Administradores: todos los pacientes.
- **Mejora de Filtros**:
  - Búsqueda avanzada por cualquier campo del turno, incluyendo datos de la historia clínica.
- **Exportación de Datos**:
  - Generación de archivos:
    - **Excel**: Datos de usuarios (Administradores).
    - **PDF**: Historia clínica (Pacientes).
- **Animaciones**:
  - Transiciones visuales entre componentes.

### **Sprint 4**
- **Gráficos y Estadísticas**:
  - Log de ingresos al sistema (usuario, día y hora).
  - Cantidad de turnos por especialidad, día y médico en períodos específicos.
  - Turnos finalizados por médico en períodos específicos.
- **Descargas**:
  - Gráficos disponibles en formatos Excel o PDF.
- **Directivas y Pipes**:
  - Implementación de 3 pipes y 3 directivas para mejorar la experiencia del usuario.

---


### **FOTOS:**

![HOME](https://github.com/magikboy/Clinica-LaboIV/blob/6758e80cca5a524799ed345155ad2fe0b04812e8/WELCOME.png)

![lOGIN](https://github.com/magikboy/Clinica-LaboIV/blob/6758e80cca5a524799ed345155ad2fe0b04812e8/LOGIN.png)

![REGISTROp](https://github.com/magikboy/Clinica-LaboIV/blob/6758e80cca5a524799ed345155ad2fe0b04812e8/REGISTRO%20PACIENTE.png)

![REGISTROe](https://github.com/magikboy/Clinica-LaboIV/blob/6758e80cca5a524799ed345155ad2fe0b04812e8/REGISTRO%20ESPECIALISTA.png)

![TURNOS PACIENTE](https://github.com/magikboy/Clinica-LaboIV/blob/6758e80cca5a524799ed345155ad2fe0b04812e8/TURNOS.png)

![PERFIL](https://github.com/magikboy/Clinica-LaboIV/blob/6758e80cca5a524799ed345155ad2fe0b04812e8/PERFIL%20ADMIN.png)

![ACTIVAR](https://github.com/magikboy/Clinica-LaboIV/blob/6758e80cca5a524799ed345155ad2fe0b04812e8/ACTIVAR%20ESPECIALISTA.png)

![tURNOS](https://github.com/magikboy/Clinica-LaboIV/blob/6758e80cca5a524799ed345155ad2fe0b04812e8/ACEPTAR%20TURNOS.png)




## **Instalación**

### **Requisitos Previos**
- Node.js (versión 14 o superior)
- Angular CLI (versión 12 o superior)
- Servidor web o herramienta local para probar la aplicación
