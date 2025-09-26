document.addEventListener("DOMContentLoaded", () => {
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

  flatpickr(fechaInput, {
    dateFormat: "Y-m-d",
    minDate: "today",
    enable: [
      function(date) {
        return [2,3,4].includes(date.getDay()); // Solo martes, miércoles, jueves
      }
    ],
    onChange: function(selectedDates, dateStr, instance) {
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

  // ---------------------------
  // 2. Botón Panel con contraseña
  // ---------------------------
  const accesoPanel = document.getElementById("acceso-panel");
  if (accesoPanel) {
    accesoPanel.addEventListener("click", (e) => {
      e.preventDefault();
      const clave = prompt("Ingrese la contraseña para acceder al panel:");
      if (clave === "panel2025") {
        window.location.href = "pages/panel.html";
      } else if (clave !== null) {
        alert("Contraseña incorrecta");
      }
    });
  }

  // ---------------------------
  // 3. Manejo de reservas y localStorage
  // ---------------------------
  const formTurnos = document.querySelector("form.caja");
  if (formTurnos) {
    formTurnos.addEventListener("submit", (e) => {
      e.preventDefault();

      const nombre = document.getElementById("nombre").value.trim();
      const email = document.getElementById("email").value.trim();
      const telefono = document.getElementById("telefono").value.trim();
      const fecha = fechaInput.value;
      const hora = horaSelect.value;

      if (!nombre || !email || !telefono || !fecha || !hora) {
        alert("Por favor complete todos los campos.");
        return;
      }

      const turnos = JSON.parse(localStorage.getItem("turnos")) || [];
      turnos.push({
        nombre,
        email,
        telefono,
        fecha,
        hora,
        asistio: false,
        atendido: false,
      });
      localStorage.setItem("turnos", JSON.stringify(turnos));

      alert(`✅ Turno reservado para ${nombre} el ${fecha} a las ${hora}.`);
      formTurnos.reset();
      horaSelect.innerHTML = `<option value="">Seleccione una hora</option>`;
    });
  }
});
