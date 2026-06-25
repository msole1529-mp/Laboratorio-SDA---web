# Laboratorio Clínico SDA — Aplicación Web Full-Stack

## 1. Integrantes del grupo

| Nombre | Parte desarrollada |
|---|---|
| **Diego Garay** | Estructura MVC del proyecto, configuración del servidor (`server.js`), rutas (`routes/auth.js`, `routes/pacientes.js`), controladores (`controllers/authController.js`, `controllers/pacienteController.js`), modelo (`models/Paciente.js`) y lógica de gestión de horarios |
| **Soledad Martínez** | Vista pública completa (`public/index.html`, `public/login.html`, `public/admin.html`), páginas de usuario (`public/js/examen.html`, `public/js/mis_reservas.html`, `public/js/mis_resultados.html`, `public/js/reserva.html`, `public/js/resultados.html`), estilos Bootstrap, lógica JavaScript del frontend (`public/js/pacientes.js`, `public/js/gestor_examenes.js`), configuración de la base de datos (`config/db.js`), rutas de exámenes (`routes/examenes.js`), rutas de reservas (`routes/reservas.js`), gestor de exámenes (`routes/gestor_examenes.js`), validación de RUT chileno, validación de correo electrónico, cálculo automático de costos con FONASA/ISAPRE y seguro complementario, generación de boleta PDF, búsqueda de paciente por RUT y middleware de autenticación (`middlewares/auth.js`) |y mejoras en logica de gestión de horas
| **John Rivera** | Base de datos MySQL: diseño, creación y mejoras de las tablas `usuarios`, `pacientes`, `examenes`, `horas`, `resultados`, `reservas`, `detalle_reserva`, `examenes_paciente` y `categorias_examenes` en phpMyAdmin, generación del archivo `laboratorio.sql` con datos de prueba |

---

## 2. Descripción del proyecto

**Nombre del negocio:** Laboratorio Clínico SDA  
**Área asignada:** Salud  
El sistema permite a un laboratorio clínico gestionar su información en línea. Cuenta con una vista pública donde los pacientes pueden consultar exámenes disponibles, reservar horas, gestionar sus reservas y consultar sus resultados de exámenes. El panel de administración protegido con login permite al personal gestionar pacientes, asignar exámenes con cálculo de costos y bonificaciones, generar boletas PDF e ingresar resultados.

---

## 3. Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- [XAMPP](https://www.apachefriends.org/) v3.3.0 o superior (para MySQL/MariaDB)
- Navegador web moderno (Chrome, Edge, Firefox)

---

## 4. Instalación paso a paso

### 1. Obtener el proyecto
```bash
git clone https://github.com/tu-usuario/laboratorio-sda-web.git
cd laboratorio-sda-web
```
O descomprimir el ZIP descargado desde GitHub.

### 2. Instalar dependencias
```bash
npm install
```

### 3. Encender MySQL
Abrir XAMPP Control Panel y hacer clic en **Start** junto a **MySQL**.

### 4. Importar la base de datos
Abrir una terminal y ejecutar:
```bash
mysql -u root
```
Presionar Enter (sin contraseña). Luego:
```sql
CREATE DATABASE laboratorio;
USE laboratorio;
SOURCE ruta/completa/al/archivo/laboratorio.sql;
```

### 5. Ejecutar el servidor
```bash
npm start
```

### 6. Abrir en el navegador