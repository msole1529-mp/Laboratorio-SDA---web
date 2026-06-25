// public/js/admin_resultados.js
const tbody = document.getElementById('cuerpo-tabla');
const plantilla = document.getElementById('plantilla-fila');

const cargarExamenes = async () => {
    try {
        const res = await fetch('/api/gestor_examenes/individuales');
        const examenes = await res.json();
        tbody.innerHTML = '';

        if (!examenes.length) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No hay exámenes registrados en el sistema</td></tr>';
            return;
        }

        examenes.forEach(ex => {
            const fila = plantilla.content.cloneNode(true);
            const tr = fila.querySelector('tr');

            fila.querySelector('.col-id').textContent = ex.id;
            fila.querySelector('.col-rut').textContent = ex.rut_paciente;
            fila.querySelector('.col-paciente').textContent = ex.nombre_paciente || '';
            fila.querySelector('.col-examen').textContent = ex.nombre_examen || '';
            fila.querySelector('.col-fecha').textContent = ex.fecha_toma ? ex.fecha_toma.slice(0, 10) : '—';

            const seccionInput = fila.querySelector('.seccion-input');
            const seccionTexto = fila.querySelector('.seccion-texto');
            const inputValor = fila.querySelector('.input-valor');
            const textoValor = fila.querySelector('.texto-valor');
            const estadoBadge = fila.querySelector('.estado-badge');

            const btnGuardar = fila.querySelector('.btn-guardar');
            const btnEditar = fila.querySelector('.btn-editar');
            const btnEliminar = fila.querySelector('.btn-eliminar');

            // Renderizar según si ya tiene un resultado o no
            if (ex.resultado !== null && ex.resultado.trim() !== '') {
                // Mostrar texto, ocultar input
                seccionInput.classList.add('d-none');
                seccionTexto.classList.remove('d-none');
                textoValor.textContent = ex.resultado;

                estadoBadge.textContent = 'Cargado';
                estadoBadge.className = 'badge bg-success estado-badge';
            } else {
                // Mostrar input, ocultar texto
                seccionInput.classList.remove('d-none');
                seccionTexto.classList.add('d-none');

                estadoBadge.textContent = 'Pendiente';
                estadoBadge.className = 'badge bg-secondary estado-badge';
            }

            // Evento Guardar / Modificar
            btnGuardar.onclick = async () => {
                const resultadoVal = inputValor.value.trim();
                if (!resultadoVal) {
                    alert('Debe escribir un resultado antes de guardar');
                    return;
                }
                btnGuardar.disabled = true;
                await guardarResultado(ex.id, resultadoVal);
            };

            // Evento Editar (Cambiar texto por input)
            btnEditar.onclick = () => {
                seccionTexto.classList.add('d-none');
                seccionInput.classList.remove('d-none');
                inputValor.value = ex.resultado || '';
                inputValor.focus();
            };

            // Evento Eliminar / Limpiar
            btnEliminar.onclick = async () => {
                if (!confirm('¿Seguro que deseas eliminar/limpiar el resultado de este examen?')) return;
                btnEliminar.disabled = true;
                await eliminarResultado(ex.id);
            };

            tbody.appendChild(fila);
        });

    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-danger text-center">Error al cargar exámenes para resultados</td></tr>';
    }
};

const guardarResultado = async (id, resultado) => {
    try {
        const res = await fetch(`/api/gestor_examenes/resultado/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resultado })
        });
        const data = await res.json();
        if (data.ok) {
            cargarExamenes();
        } else {
            alert('Error al guardar el resultado');
            cargarExamenes();
        }
    } catch (err) {
        alert('Error de red al guardar');
        cargarExamenes();
    }
};

const eliminarResultado = async (id) => {
    try {
        const res = await fetch(`/api/gestor_examenes/resultado/${id}`, {
            method: 'DELETE'
        });
        const data = await res.json();
        if (data.ok) {
            cargarExamenes();
        } else {
            alert('Error al eliminar el resultado');
            cargarExamenes();
        }
    } catch (err) {
        alert('Error de red al eliminar');
        cargarExamenes();
    }
};

// Cargar al entrar
cargarExamenes();
