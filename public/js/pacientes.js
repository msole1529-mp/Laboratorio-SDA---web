// ─── public/js/pacientes.js ──────────────────────────────
// Maneja toda la interacción del CRUD desde el navegador.
// Se comunica con la API de Express usando fetch + async/await.
// No escribe HTML — usa la <template> definida en admin.html.

// ── Referencias a elementos del DOM ─────────────────────
const tbody = document.getElementById('cuerpo-tabla');
const plantilla = document.getElementById('plantilla-fila');
const inputId = document.getElementById('paciente-id');
const inputRut = document.getElementById('input-rut');
const inputNombre = document.getElementById('input-nombre');
const inputApellido = document.getElementById('input-apellido');
const inputFecha = document.getElementById('input-fecha');
const inputTelefono = document.getElementById('input-telefono');
const inputCorreo = document.getElementById('input-correo');
const tituloForm = document.getElementById('titulo-formulario');
const btnGuardar = document.getElementById('btn-guardar');
const btnCancelar = document.getElementById('btn-cancelar');
const msgValidacion = document.getElementById('msg-validacion');

// ── Listar todos los pacientes ───────────────────────────
// Hace GET /api/pacientes y construye una fila por cada resultado.
const cargarPacientes = async () => {
  tbody.innerHTML = '<tr><td colspan="8" class="text-center">Cargando...</td></tr>';

  try {
    const respuesta = await fetch('/api/pacientes');
    const pacientes = await respuesta.json();

    tbody.innerHTML = '';

    if (pacientes.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">No hay pacientes registrados</td></tr>';
    } else {
      pacientes.forEach((paciente) => {
        const fila = crearFila(paciente);
        tbody.appendChild(fila);
      });
    }

  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-danger text-center">Error: ${err.message}</td></tr>`;
  }
};

// ── Crear una fila a partir de la plantilla ──────────────
// Clona la <template> del HTML, rellena los datos
// y agrega los eventos a los botones Editar y Eliminar.
const crearFila = (paciente) => {
  const clon = plantilla.content.cloneNode(true);

  clon.querySelector('.col-id').textContent = paciente.id;
  clon.querySelector('.col-rut').textContent = paciente.rut;
  clon.querySelector('.col-nombre').textContent = paciente.nombre;
  clon.querySelector('.col-apellido').textContent = paciente.apellido;
  clon.querySelector('.col-fecha').textContent = paciente.fecha_nacimiento
    ? new Date(paciente.fecha_nacimiento).toLocaleDateString('es-CL')
    : '—';
  clon.querySelector('.col-telefono').textContent = paciente.telefono || '—';
  clon.querySelector('.col-correo').textContent = paciente.correo || '—';

  clon.querySelector('.btn-editar').addEventListener('click', () => {
    prepararEdicion(paciente);
  });

  clon.querySelector('.btn-eliminar').addEventListener('click', () => {
    eliminar(paciente.id);
  });

  return clon;
};

// ── Guardar: decide entre POST (nuevo) y PUT (edición) ───
// Si el campo oculto paciente-id tiene valor → editamos (PUT)
// Si está vacío → creamos uno nuevo (POST)
const guardar = async () => {
  const id = inputId.value;
  const rut = inputRut.value.trim();
  const nombre = inputNombre.value.trim();
  const apellido = inputApellido.value.trim();
  const fecha_nacimiento = inputFecha.value;
  const telefono = inputTelefono.value.trim();
  const correo = inputCorreo.value.trim();

  // Validación JS antes de enviar al servidor
  if (!rut || !nombre || !apellido) {
    msgValidacion.textContent = 'RUT, nombre y apellido son obligatorios.';
    msgValidacion.style.display = 'block';
    return;
  }
  msgValidacion.style.display = 'none';

  const metodo = id ? 'PUT' : 'POST';
  const url = id ? `/api/pacientes/${id}` : '/api/pacientes';

  try {
    const respuesta = await fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rut, nombre, apellido, fecha_nacimiento, telefono, correo })
    });

    if (respuesta.ok) {
      limpiarFormulario();
      cargarPacientes();
    } else {
      alert('No se pudo guardar el paciente');
    }

  } catch (err) {
    alert(`Error al guardar: ${err.message}`);
  }
};

// ── Preparar el formulario para editar ───────────────────
const prepararEdicion = (paciente) => {
  inputId.value = paciente.id;
  inputRut.value = paciente.rut;
  inputNombre.value = paciente.nombre;
  inputApellido.value = paciente.apellido;
  inputFecha.value = paciente.fecha_nacimiento
    ? paciente.fecha_nacimiento.split('T')[0]
    : '';
  inputTelefono.value = paciente.telefono || '';
  inputCorreo.value = paciente.correo || '';
  tituloForm.textContent = 'Editar Paciente';
};

// ── Eliminar un paciente ─────────────────────────────────
const eliminar = async (id) => {
  if (!confirm('¿Seguro que deseas eliminar este paciente?')) return;

  try {
    const respuesta = await fetch(`/api/pacientes/${id}`, { method: 'DELETE' });

    if (respuesta.ok) {
      cargarPacientes();
    } else {
      alert('No se pudo eliminar el paciente');
    }

  } catch (err) {
    alert(`Error al eliminar: ${err.message}`);
  }
};

// ── Limpiar el formulario ────────────────────────────────
const limpiarFormulario = () => {
  inputId.value = '';
  inputRut.value = '';
  inputNombre.value = '';
  inputApellido.value = '';
  inputFecha.value = '';
  inputTelefono.value = '';
  inputCorreo.value = '';
  tituloForm.textContent = 'Agregar Paciente';
  msgValidacion.style.display = 'none';
};

// ── Asignar eventos a los botones del formulario ─────────
btnGuardar.addEventListener('click', guardar);
btnCancelar.addEventListener('click', limpiarFormulario);

// ── Formatear RUT automáticamente al escribir ─────────────
inputRut.addEventListener('input', function() {
  let valor = this.value.replace(/[^0-9kK]/g, '').toUpperCase();
  if (valor.length > 1) {
    valor = valor.slice(0, -1) + '-' + valor.slice(-1);
  }
  this.value = valor;
});

// ── Inicialización ───────────────────────────────────────
cargarPacientes();
