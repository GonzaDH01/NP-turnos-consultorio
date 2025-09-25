document.addEventListener("DOMContentLoaded", () => {
  const tabla = document.getElementById("tabla-turnos");
  const limpiarBtn = document.getElementById("limpiar-turnos");

  // Modal diagnóstico
  const diagnosticoModal = new bootstrap.Modal(document.getElementById("diagnosticoModal"));
  const diagnosticoTexto = document.getElementById("diagnosticoTexto");
  const guardarDiagnosticoBtn = document.getElementById("guardarDiagnostico");

  // Modal comentarios
  const comentariosModal = new bootstrap.Modal(document.getElementById("comentariosModal"));
  const comentariosTexto = document.getElementById("comentariosTexto");
  const guardarComentariosBtn = document.getElementById("guardarComentarios");

  let turnoIndexActual = null;
  let modo = null; // "diagnostico" o "comentarios"

  function cargarTurnos() {
    const turnos = JSON.parse(localStorage.getItem("turnos")) || [];

    // Ordenar por fecha y hora
    turnos.sort((a, b) => {
      if (a.fecha === b.fecha) return a.hora.localeCompare(b.hora);
      return a.fecha.localeCompare(b.fecha);
    });

    tabla.innerHTML = "";

    if (turnos.length === 0) {
      tabla.innerHTML = `<tr><td colspan="9" class="text-center">No hay turnos reservados</td></tr>`;
      return;
    }

    turnos.forEach((turno, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${turno.nombre}</td>
        <td>${turno.email}</td>
        <td>${turno.telefono}</td>
        <td>${turno.fecha}</td>
        <td>${turno.hora}</td>
        <td class="text-center">
          <input type="checkbox" ${turno.asistio ? "checked" : ""} data-index="${index}" class="asistencia">
        </td>
        <td class="text-center">
          <select class="form-select estado-medico" data-index="${index}">
            <option value="">Seleccione</option>
            <option value="Atendido" ${turno.estadoMedico === "Atendido" ? "selected" : ""}>Atendido</option>
            <option value="No atendido" ${turno.estadoMedico === "No atendido" ? "selected" : ""}>No atendido</option>
            <option value="Ausente" ${turno.estadoMedico === "Ausente" ? "selected" : ""}>Ausente</option>
          </select>
        </td>
        <td class="text-center">
          <button class="btn btn-sm btn-primary diagnostico-btn" data-index="${index}">
            ${turno.diagnostico ? "Ver / Editar" : "Agregar"}
          </button>
        </td>
        <td class="text-center">
          <button class="btn btn-sm btn-secondary comentarios-btn" data-index="${index}">
            ${turno.comentarios ? "Ver / Editar" : "Agregar"}
          </button>
        </td>
      `;
      tabla.appendChild(tr);
    });

    // Eventos: asistencia
    document.querySelectorAll(".asistencia").forEach(checkbox => {
      checkbox.addEventListener("change", (e) => {
        const turnos = JSON.parse(localStorage.getItem("turnos")) || [];
        const idx = e.target.dataset.index;
        turnos[idx].asistio = e.target.checked;
        localStorage.setItem("turnos", JSON.stringify(turnos));
      });
    });

    // Eventos: estado médico
    document.querySelectorAll(".estado-medico").forEach(select => {
      select.addEventListener("change", (e) => {
        const turnos = JSON.parse(localStorage.getItem("turnos")) || [];
        const idx = e.target.dataset.index;
        turnos[idx].estadoMedico = e.target.value;
        localStorage.setItem("turnos", JSON.stringify(turnos));
      });
    });

    // Eventos: diagnóstico
    document.querySelectorAll(".diagnostico-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const turnos = JSON.parse(localStorage.getItem("turnos")) || [];
        turnoIndexActual = e.target.dataset.index;
        diagnosticoTexto.value = turnos[turnoIndexActual].diagnostico || "";
        modo = "diagnostico";
        diagnosticoModal.show();
      });
    });

    // Eventos: comentarios
    document.querySelectorAll(".comentarios-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const turnos = JSON.parse(localStorage.getItem("turnos")) || [];
        turnoIndexActual = e.target.dataset.index;
        comentariosTexto.value = turnos[turnoIndexActual].comentarios || "";
        modo = "comentarios";
        comentariosModal.show();
      });
    });
  }

  // Guardar diagnóstico
  guardarDiagnosticoBtn.addEventListener("click", () => {
    if (turnoIndexActual !== null) {
      const turnos = JSON.parse(localStorage.getItem("turnos")) || [];
      turnos[turnoIndexActual].diagnostico = diagnosticoTexto.value.trim();
      localStorage.setItem("turnos", JSON.stringify(turnos));
      diagnosticoModal.hide();
      cargarTurnos();
    }
  });

  // Guardar comentarios
  guardarComentariosBtn.addEventListener("click", () => {
    if (turnoIndexActual !== null) {
      const turnos = JSON.parse(localStorage.getItem("turnos")) || [];
      turnos[turnoIndexActual].comentarios = comentariosTexto.value.trim();
      localStorage.setItem("turnos", JSON.stringify(turnos));
      comentariosModal.hide();
      cargarTurnos();
    }
  });

  // Limpiar todos los turnos
  limpiarBtn.addEventListener("click", () => {
    if (confirm("¿Desea eliminar todos los turnos?")) {
      localStorage.removeItem("turnos");
      cargarTurnos();
    }
  });

  cargarTurnos();
});
