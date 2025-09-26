document.addEventListener("DOMContentLoaded", () => {
  // ---------------------------
  // 0. Modal de confirmación de turno
  // ---------------------------
  const turnoModalElem = document.getElementById("turnoConfirmModal");
  const turnoModal = turnoModalElem ? new bootstrap.Modal(turnoModalElem) : null;
  const turnoModalBody = document.getElementById("turnoConfirmBody");

  function mostrarTurnoModal(texto) {
    if (turnoModalBody) turnoModalBody.innerHTML = texto;
    if (turnoModal) turnoModal.show();
  }

  // ---------------------------
  // 1. Manejo de turnos con Flatpickr
  // ---------------------------
  const fechaInput = document.getElementById("fecha");
  const horaSelect = document.getElementById("hora");

  const horariosDisponibles = {
    2: { inicio: "10:30", fin: "12:00" }, // Martes
    3: { inicio: "14:00", fin: "16:00" }, // Miércoles
    4: { inicio: "09:00", fin: "12:00" }, // Jueves
  };

  function generarHorarios(inicio, fin, intervalo) {
    const horarios = [];
    let [h, m] = inicio.split(":").map(Number);
    const [hf, mf] = fin.split(":").map(Number);

    while (h < hf || (h === hf && m <= mf)) {
      horarios.push(`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`);
      m += intervalo;
      if (m >= 60) { m -= 60; h++; }
    }
    return horarios;
  }

  if (fechaInput && typeof flatpickr !== "undefined") {
    flatpickr(fechaInput, {
      dateFormat: "Y-m-d",
      minDate: "today",
      enable: [date => [2,3,4].includes(date.getDay())], // solo martes, miércoles, jueves
      onChange: function(selectedDates) {
        if (!selectedDates.length) return;
        const dia = selectedDates[0].getDay();
        horaSelect.innerHTML = `<option value="">Seleccione una hora</option>`;
        const { inicio, fin } = horariosDisponibles[dia];
        generarHorarios(inicio, fin, 10).forEach(h => {
          const opt = document.createElement("option");
          opt.value = h;
          opt.textContent = h;
          horaSelect.appendChild(opt);
        });
      }
    });
  }

  // ---------------------------
  // 2. Botón Panel con modal de contraseña
  // ---------------------------
  const accesoPanel = document.getElementById("acceso-panel");
  const loginModalElem = document.getElementById("loginPanelModal");
  const loginModal = loginModalElem ? new bootstrap.Modal(loginModalElem) : null;
  const claveInput = document.getElementById("clavePanel");
  const errorDiv = document.getElementById("errorPanel");
  const ingresarBtn = document.getElementById("ingresarPanel");

  if (accesoPanel) {
    accesoPanel.addEventListener("click", e => {
      e.preventDefault();
      if (loginModal && claveInput && errorDiv) {
        claveInput.value = "";
        errorDiv.classList.add("d-none");
        loginModal.show();
      }
    });
  }

  if (ingresarBtn && claveInput && loginModal && errorDiv) {
    ingresarBtn.addEventListener("click", () => {
      const clave = claveInput.value.trim();
      if (clave === "panel2025") {
        loginModal.hide();
        window.location.href = "pages/panel.html";
      } else {
        errorDiv.classList.remove("d-none");
      }
    });
  }

  // ---------------------------
  // 3. Manejo de reservas y localStorage
  // ---------------------------
  const formTurnos = document.querySelector("form.caja");

  if (formTurnos) {
    formTurnos.addEventListener("submit", e => {
      e.preventDefault();

      const nombre = document.getElementById("nombre").value.trim();
      const email = document.getElementById("email").value.trim();
      const telefono = document.getElementById("telefono").value.trim();
      const fecha = fechaInput ? fechaInput.value : "";
      const hora = horaSelect ? horaSelect.value : "";

      if (!nombre || !email || !telefono || !fecha || !hora) {
        mostrarTurnoModal("⚠️ Por favor complete todos los campos.");
        return;
      }

      const turnos = JSON.parse(localStorage.getItem("turnos")) || [];
      turnos.push({ nombre, email, telefono, fecha, hora, asistio:false, atendido:false });
      localStorage.setItem("turnos", JSON.stringify(turnos));

      mostrarTurnoModal(`✅ Turno reservado para <strong>${nombre}</strong> el <strong>${fecha}</strong> a las <strong>${hora}</strong>.`);

      formTurnos.reset();
      if (horaSelect) horaSelect.innerHTML = `<option value="">Seleccione una hora</option>`;
    });
  }
});
