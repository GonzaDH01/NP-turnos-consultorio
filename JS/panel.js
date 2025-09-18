document.addEventListener("DOMContentLoaded", () => {
  const tabla = document.getElementById("tabla-turnos");
  const limpiarBtn = document.getElementById("limpiar-turnos");

  function cargarTurnos() {
    const turnos = JSON.parse(localStorage.getItem("turnos")) || [];

    // Ordenar por fecha y hora
    turnos.sort((a, b) => {
      if (a.fecha === b.fecha) return a.hora.localeCompare(b.hora);
      return a.fecha.localeCompare(b.fecha);
    });

    tabla.innerHTML = "";

    if (turnos.length === 0) {
      tabla.innerHTML = `<tr><td colspan="7" class="text-center">No hay turnos reservados</td></tr>`;
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
          <input type="checkbox" ${turno.atendido ? "checked" : ""} data-index="${index}" class="atendido">
        </td>
      `;
      tabla.appendChild(tr);
    });

    // Eventos para checkboxes
    document.querySelectorAll(".asistencia").forEach(checkbox => {
      checkbox.addEventListener("change", (e) => {
        const idx = e.target.dataset.index;
        turnos[idx].asistio = e.target.checked;
        localStorage.setItem("turnos", JSON.stringify(turnos));
      });
    });

    document.querySelectorAll(".atendido").forEach(checkbox => {
      checkbox.addEventListener("change", (e) => {
        const idx = e.target.dataset.index;
        turnos[idx].atendido = e.target.checked;
        localStorage.setItem("turnos", JSON.stringify(turnos));
      });
    });
  }

  // Limpiar todos los turnos
  limpiarBtn.addEventListener("click", () => {
    if (confirm("¿Desea eliminar todos los turnos?")) {
      localStorage.removeItem("turnos");
      cargarTurnos();
    }
  });

  cargarTurnos();
});
