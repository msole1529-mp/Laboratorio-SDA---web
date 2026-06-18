# Laboratorio Clínico SDA — Aplicación Web Full-Stack

## 1. Integrantes del grupo

| Nombre | Parte desarrollada |
|---|---|
| **Diego Garay** | Estructura MVC del proyecto, configuración del servidor (`server.js`), rutas (`routes/auth.js`, `routes/pacientes.js`), controladores (`controllers/authController.js`, `controllers/pacienteController.js`) y modelo (`models/Paciente.js`) |
| **Soledad Martínez** | Vista pública completa (`public/index.html`, `public/login.html`, `public/admin.html`), páginas de usuario (`public/js/examen.html`, `public/js/mis_reservas.html`, `public/js/mis_resultados.html`, `public/js/reserva.html`, `public/js/resultados.html`), estilos Bootstrap, lógica JavaScript del frontend (`public/js/pacientes.js`), configuración de la base de datos (`config/db.js`) y corrección del archivo `laboratorio.sql` con datos de prueba |
| **John Rivera** | Base de datos MySQL: diseño y creación de las tablas `usuarios`, `pacientes`, `examenes`, `horas` y `resultados` en phpMyAdmin, generación del archivo `laboratorio.sql` |

---

## 2. Descripción del proyecto

**Nombre del negocio:** Laboratorio Clínico SDA  
**Área asignada:** Salud  
El sistema permite a un laboratorio clínico gestionar su información en línea. Cuenta con una vista pública donde los pacientes pueden consultar exámenes disponibles, ver resultados y reservar horas. El panel de administración protegido con login permite al personal gestionar pacientes y registros mediante operaciones CRUD completas.

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
mysql -u root -p
```
Presionar Enter (sin contraseña). Luego:
```sql
CREATE DATABASE laboratorio;
USE laboratorio;
SOURCE ruta/completa/al/archivo/laboratorio.sql;
```

### 5. Ejecutar el servidor
```bash
node server.js
```
o
```bash
npm run start
```

### 6. Abrir en el navegador
```
http://localhost:3000
```

---

## 5. Configuración de la base de datos

| Parámetro | Valor |
|---|---|
| Nombre de la base de datos | `laboratorio` |
| Usuario | `root` |
| Contraseña | *(vacía)* |
| Host | `localhost` |
| Archivo SQL | `laboratorio.sql` (en la raíz del proyecto) |

La configuración de conexión se encuentra en `config/db.js`.

---

## 6. Credenciales de prueba

| Usuario | Contraseña | Rol |
|---|---|---|
| `admin` | `1234` | Administrador |
| `supervisor` | `1234` | Administrador |

---

## 7. Uso del sistema

### Vista pública
Acceder a `http://localhost:3000` para ver la página de inicio con información del laboratorio, exámenes disponibles, formulario de reserva de horas y consulta de resultados.

### Acceso al panel de administración
1. Desde la vista pública, hacer clic en el botón **Administración**
2. Ingresar usuario y contraseña en el formulario de login (`http://localhost:3000/login.html`)
3. Con credenciales correctas se redirige automáticamente al panel

### Panel de administración
Desde `http://localhost:3000/admin` el administrador puede:
- **Crear** nuevos registros de pacientes
- **Ver** el listado completo de pacientes
- **Editar** información de pacientes existentes
- **Eliminar** registros del sistema
- Cerrar sesión con el botón **Logout**

---

## 8. Estructura del proyecto

```
Laboratorio SDA web/
├── config/
│   └── db.js                  # Configuración de conexión a MySQL
├── controllers/
│   ├── authController.js      # Lógica de login y logout
│   └── pacienteController.js  # Lógica CRUD de pacientes
├── models/
│   └── Paciente.js            # Modelo de datos de paciente
├── public/
│   ├── js/
│   │   ├── examen.html        # Página pública de exámenes
│   │   ├── mis_reservas.html  # Página pública de reservas del usuario
│   │   ├── mis_resultados.html# Página pública de resultados del usuario
│   │   ├── pacientes.js       # Lógica JavaScript del panel admin
│   │   ├── reserva.html       # Formulario de reserva de horas
│   │   └── resultados.html    # Consulta de resultados por RUT
│   ├── admin.html             # Panel de administración (protegido)
│   ├── index.html             # Página de inicio (vista pública)
│   └── login.html             # Formulario de login
├── routes/
│   ├── auth.js                # Rutas de autenticación (/auth/login, /auth/logout)
│   └── pacientes.js           # Rutas CRUD de pacientes
├── .gitignore                 # Excluye node_modules del repositorio
├── laboratorio.sql            # Script SQL para importar la base de datos
├── package.json               # Dependencias y scripts del proyecto
├── README.md                  # Este archivo
└── server.js                  # Punto de entrada del servidor Express
```
