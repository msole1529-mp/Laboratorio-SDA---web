// public/js/admin_horarios.js
const grillaHorarios = document.getElementById('grilla-horarios');
const inputFecha = document.getElementById('input-fecha');

// Poner la fecha de hoy por defecto en el input
const hoy = new Date().toISOString().slice(0, 10);
if (inputFecha) {
    inputFecha.value = hoy;
    inputFecha.min = hoy; // Evitar gestionar fechas pasadas
    inputFecha.addEventListener('change', () => cargarHorarios());
}

const cargarHorarios = async () => {
    const fecha = inputFecha ? inputFecha.value : '';
    if (!fecha) return;

    try {
        const resp = await fetch(`/api/horarios?fecha=${fecha}`);
        const lista = await resp.json();
        grillaHorarios.innerHTML = '';

        lista.forEach(h => {
            const btn = document.createElement('button');
            btn.className = `btn ${h.activo ? 'btn-success' : 'btn-outline-secondary'} horario-btn`;
            btn.style.minWidth = '180px';

            const icono = h.activo
                ? '<i class="bi bi-clock me-1"></i>'
                : '<i class="bi bi-lock me-1"></i>';

            btn.innerHTML = `${icono}${h.hora.slice(0, 5)}`;
            btn.title = h.activo
                ? 'Activo — clic para bloquear en esta fecha'
                : 'Bloqueado — clic para activar en esta fecha';

            btn.onclick = async () => {
                btn.disabled = true;
                await fetch('/api/horarios/toggle', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fecha, hora: h.hora })
                });
                await cargarHorarios();
            };

            grillaHorarios.appendChild(btn);
        });

    } catch (err) {
        grillaHorarios.innerHTML = '<p class="text-danger">Error al cargar horarios.</p>';
    }
};

// Cargar al iniciar la página
cargarHorarios();
