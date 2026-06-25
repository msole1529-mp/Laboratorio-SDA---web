

let examenesData = [];

function validarRut(rut) {
    // Permitir cualquier RUT para facilitar pruebas con datos inventados
    return rut && rut.trim().length > 0;
}

function buscarPaciente() {
    const rut = document.getElementById('input-rut').value.trim();
    const msg = document.getElementById('msg-rut');
    if (!rut) { alert('Ingrese un RUT'); return; }
    if (!validarRut(rut)) { msg.textContent = 'RUT inválido'; msg.style.display = 'block'; return; }
    msg.style.display = 'none';
    fetch(`/api/pacientes/buscar?rut=${encodeURIComponent(rut)}`)
        .then(res => res.json())
        .then(data => {
            if (!data || data.error) { msg.textContent = 'Paciente no encontrado'; msg.style.display = 'block'; return; }
            document.getElementById('input-nombre-paciente').value = `${data.nombre} ${data.apellido}`;
        });
}

function calcularTotales() {
    const checks = [...document.querySelectorAll('.chk-examen:checked')];
    const bruto = checks.reduce((sum, cb) => sum + parseFloat(cb.dataset.precio), 0);
    const iva = Math.round(bruto * 0.19);
    const neto = bruto + iva;
    const bonif = parseFloat(document.getElementById('input-bonif').value) || 0;
    const seguro = parseFloat(document.getElementById('input-seguro').value) || 0;
    const copago = Math.max(0, neto - bonif - seguro);
    document.getElementById('res-bruto').textContent = `$${bruto.toLocaleString('es-CL')}`;
    document.getElementById('res-iva').textContent = `$${iva.toLocaleString('es-CL')}`;
    document.getElementById('res-neto').textContent = `$${neto.toLocaleString('es-CL')}`;
    document.getElementById('res-copago').textContent = `$${copago.toLocaleString('es-CL')}`;
}

async function guardar() {
    const rut = document.getElementById('input-rut').value.trim();
    const nombre_paciente = document.getElementById('input-nombre-paciente').value.trim();
    const fecha = document.getElementById('input-fecha').value;
    const examenes = [...document.querySelectorAll('.chk-examen:checked')].map(cb => parseInt(cb.value));
    if (!rut || !validarRut(rut)) { alert('RUT inválido'); return; }
    if (!nombre_paciente) { alert('Busque el paciente primero'); return; }
    if (!examenes.length) { alert('Seleccione al menos un examen'); return; }
    if (!fecha) { alert('Seleccione una fecha'); return; }
    const bruto = [...document.querySelectorAll('.chk-examen:checked')].reduce((sum, cb) => sum + parseFloat(cb.dataset.precio), 0);
    const iva = Math.round(bruto * 0.19);
    const neto = bruto + iva;
    const bonif = parseFloat(document.getElementById('input-bonif').value) || 0;
    const seguro = parseFloat(document.getElementById('input-seguro').value) || 0;
    const copago = Math.max(0, neto - bonif - seguro);
    const res = await fetch('/api/gestor_examenes/asignar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rut_paciente: rut, nombre_paciente, examenes, valor_bruto: bruto, iva, valor_neto: neto, bonif, seguro, copago, fecha_toma: fecha })
    });
    const data = await res.json();
    if (data.ok) { alert('✅ Guardado'); limpiar(); cargarTabla(); }
    else alert('Error al guardar');
}

async function cargarTabla() {
    const tbody = document.getElementById('cuerpo-tabla');
    const plantilla = document.getElementById('plantilla-fila');
    const res = await fetch('/api/gestor_examenes');
    const datos = await res.json();
    tbody.innerHTML = '';
    if (!datos.length) { tbody.innerHTML = '<tr><td colspan="12" class="text-center text-muted">Sin registros</td></tr>'; return; }
    datos.forEach(d => {
        const fila = plantilla.content.cloneNode(true);
        fila.querySelector('.col-id').textContent = d.id;
        fila.querySelector('.col-rut').textContent = d.rut_paciente;
        fila.querySelector('.col-paciente').textContent = d.nombre_paciente || '';
        fila.querySelector('.col-examenes').textContent = d.nombres_examenes || '';
        fila.querySelector('.col-bruto').textContent = `$${Number(d.valor_bruto).toLocaleString('es-CL')}`;
        fila.querySelector('.col-iva').textContent = `$${Number(d.iva).toLocaleString('es-CL')}`;
        fila.querySelector('.col-neto').textContent = `$${Number(d.valor_neto).toLocaleString('es-CL')}`;
        fila.querySelector('.col-bonif').textContent = `$${Number(d.bonif).toLocaleString('es-CL')}`;
        fila.querySelector('.col-seguro').textContent = `$${Number(d.seguro).toLocaleString('es-CL')}`;
        fila.querySelector('.col-copago').textContent = `$${Number(d.copago).toLocaleString('es-CL')}`;
        fila.querySelector('.col-fecha').textContent = d.fecha_toma ? d.fecha_toma.slice(0,10) : '—';
        fila.querySelector('.btn-eliminar').addEventListener('click', () => eliminar(d.ids_relacionados));
        fila.querySelector('.btn-pdf').addEventListener('click', () => generarBoleta(d));
        tbody.appendChild(fila);
    });
}

async function eliminar(ids) {
    if (!confirm('¿Eliminar?')) return;
    await fetch(`/api/gestor_examenes/${ids}`, { method: 'DELETE' });
    cargarTabla();
}

function generarBoleta(d) {
    const v = window.open('', '_blank', 'width=700,height=700');
    v.document.write(`<html><head><style>
        body{font-family:'Segoe UI',sans-serif;padding:30px;max-width:600px;margin:auto;}
        h2{color:#0a3d62;text-align:center;}
        hr{border-color:#0a3d62;}
        table{width:100%;border-collapse:collapse;margin-top:15px;}
        td{padding:6px 4px;}
        .valor{text-align:right;font-weight:bold;}
        .copago{background:#0a3d62;color:white;font-size:1.2em;}
        .seccion{background:#f0f4f8;padding:10px;border-radius:8px;margin:10px 0;}
        .btn{background:#0a3d62;color:white;padding:10px 24px;border:none;border-radius:6px;cursor:pointer;margin-top:20px;}
    </style></head><body>
        <h2>Laboratorio Clínico SDA</h2>
        <p style="text-align:center;color:#666;">Boleta de Exámenes Clínicos</p>
        <hr>
        <div class="seccion">
            <strong>Datos del Paciente</strong><br>
            Nombre: ${d.nombre_paciente || ''}<br>
            RUT: ${d.rut_paciente}<br>
            Fecha: ${d.fecha_toma ? d.fecha_toma.slice(0,10) : ''}
        </div>
        <div class="seccion"><strong>Exámenes:</strong><br>${d.nombres_examenes || ''}</div>
        <hr>
        <table>
            <tr><td>Valor Bruto</td><td class="valor">$${Number(d.valor_bruto).toLocaleString('es-CL')}</td></tr>
            <tr><td>IVA (19%)</td><td class="valor">$${Number(d.iva).toLocaleString('es-CL')}</td></tr>
            <tr><td>Valor Neto</td><td class="valor">$${Number(d.valor_neto).toLocaleString('es-CL')}</td></tr>
            <tr><td>Bonif. FONASA/ISAPRE</td><td class="valor">-$${Number(d.bonif).toLocaleString('es-CL')}</td></tr>
            <tr><td>Seguro Complementario</td><td class="valor">-$${Number(d.seguro).toLocaleString('es-CL')}</td></tr>
            <tr class="copago"><td><strong>COPAGO</strong></td><td class="valor"><strong>$${Number(d.copago).toLocaleString('es-CL')}</strong></td></tr>
        </table>
        <div style="text-align:center;"><button class="btn" onclick="window.print()">🖨️ Imprimir</button></div>
    </body></html>`);
}

function limpiar() {
    document.getElementById('input-rut').value = '';
    document.getElementById('input-nombre-paciente').value = '';
    document.getElementById('input-fecha').value = '';
    document.getElementById('input-bonif').value = '0';
    document.getElementById('input-seguro').value = '0';
    document.querySelectorAll('.chk-examen').forEach(cb => cb.checked = false);
    document.getElementById('res-bruto').textContent = '$0';
    document.getElementById('res-iva').textContent = '$0';
    document.getElementById('res-neto').textContent = '$0';
    document.getElementById('res-copago').textContent = '$0';
    document.getElementById('msg-rut').style.display = 'none';
}

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('input-rut').addEventListener('input', function() {
        let valor = this.value.replace(/[^0-9kK]/g, '').toUpperCase();
        if (valor.length > 1) valor = valor.slice(0,-1) + '-' + valor.slice(-1);
        this.value = valor;
    });
    document.getElementById('input-bonif').addEventListener('input', calcularTotales);
    document.getElementById('input-seguro').addEventListener('input', calcularTotales);
    fetch('/api/examenes').then(r => r.json()).then(examenes => {
        const contenedor = document.getElementById('lista-examenes');
        contenedor.innerHTML = '';
        examenes.forEach(ex => {
            contenedor.innerHTML += `
                <div class="form-check mb-1">
                    <input class="form-check-input chk-examen" type="checkbox" value="${ex.id}" data-precio="${ex.precio}" id="chk_${ex.id}">
                    <label class="form-check-label" for="chk_${ex.id}">
                        <strong>${ex.nombre}</strong>
                        <span class="text-muted ms-2">$${Number(ex.precio).toLocaleString('es-CL')}</span>
                    </label>
                </div>`;
        });
        contenedor.addEventListener('change', calcularTotales);
    });
    cargarTabla();
});