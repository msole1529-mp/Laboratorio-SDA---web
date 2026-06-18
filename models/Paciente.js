class Paciente {
    constructor(id, rut, nombre, apellido, fecha_nacimiento, telefono, correo) {
        this.id = id;
        this.rut = rut;
        this.nombre = nombre;
        this.apellido = apellido;
        this.fecha_nacimiento = fecha_nacimiento;
        this.telefono = telefono;
        this.correo = correo;
    }
}

module.exports = Paciente;
