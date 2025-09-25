/*
document.addEventListener("DOMContentLoaded", () => {
  const fechaInput = document.getElementById("fecha");
  const horaSelect = document.getElementById("hora");

  // Configuración de días y horarios
  const horariosDisponibles = {
    2: { inicio: "10:30", fin: "12:00" }, // Martes
    3: { inicio: "14:00", fin: "16:00" }, // Miércoles
    4: { inicio: "09:00", fin: "12:00" }, // Jueves
  };

  // Generar intervalos de horarios
  function generarHorarios(inicio, fin, intervalo) {
    const horarios = [];
    let [h, m] = inicio.split(":").map(Number);
    const [hf, mf] = fin.split(":").map(Number);

    while (h < hf || (h === hf && m <= mf)) {
      const hh = h.toString().padStart(2, "0");
      const mm = m.toString().padStart(2, "0");
      horarios.push(`${hh}:${mm}`);

      m += intervalo;
      if (m >= 60) {
        m -= 60;
        h++;
      }
    }
    return horarios;
  }

  // Evento: cuando cambia la fecha
  fechaInput.addEventListener("change", () => {
    const fecha = new Date(fechaInput.value);
    const diaSemana = fecha.getDay(); // 0=Domingo ... 6=Sábado

    horaSelect.innerHTML = `<option value="">Seleccione una hora</option>`; // reset

    if (horariosDisponibles[diaSemana]) {
      // Generar horarios del día válido
      const { inicio, fin } = horariosDisponibles[diaSemana];
      const horarios = generarHorarios(inicio, fin, 10);

      horarios.forEach(hora => {
        const option = document.createElement("option");
        option.value = hora;
        option.textContent = hora;
        horaSelect.appendChild(option);
      });
    } else {
      alert("⚠️ Solo se pueden reservar turnos los días Martes, Miércoles o Jueves.");
      fechaInput.value = ""; // limpiar fecha inválida
    }
  });
});
*/
document.addEventListener("DOMContentLoaded", () => {
  // ---------------------------
  // 1. Manejo de turnos
  // ---------------------------
  const fechaInput = document.getElementById("fecha");
  const horaSelect = document.getElementById("hora");

  // Configuración de días y horarios
  const horariosDisponibles = {
    2: { inicio: "10:30", fin: "12:00" }, // Martes
    3: { inicio: "14:00", fin: "16:00" }, // Miércoles
    4: { inicio: "09:00", fin: "12:00" }, // Jueves
  };

  // Generar intervalos de horarios
  function generarHorarios(inicio, fin, intervalo) {
    const horarios = [];
    let [h, m] = inicio.split(":").map(Number);
    const [hf, mf] = fin.split(":").map(Number);

    while (h < hf || (h === hf && m <= mf)) {
      const hh = h.toString().padStart(2, "0");
      const mm = m.toString().padStart(2, "0");
      horarios.push(`${hh}:${mm}`);

      m += intervalo;
      if (m >= 60) {
        m -= 60;
        h++;
      }
    }
    return horarios;
  }

  // Evento: cuando cambia la fecha
  if (fechaInput && horaSelect) {
    fechaInput.addEventListener("change", () => {
      const [year, month, day] = fechaInput.value.split("-").map(Number);
      // Hora fija a mediodía para evitar desajustes de zona horaria
      const fecha = new Date(year, month - 1, day, 12, 0, 0);
      const diaSemana = fecha.getDay(); // 0=Domingo ... 6=Sábado

      horaSelect.innerHTML = `<option value="">Seleccione una hora</option>`; // reset

      if (horariosDisponibles[diaSemana]) {
        const { inicio, fin } = horariosDisponibles[diaSemana];
        const horarios = generarHorarios(inicio, fin, 10);

        horarios.forEach((hora) => {
          const option = document.createElement("option");
          option.value = hora;
          option.textContent = hora;
          horaSelect.appendChild(option);
        });
      } else {
        alert("⚠️ Solo se pueden reservar turnos los días Martes, Miércoles o Jueves.");
        fechaInput.value = ""; // limpiar fecha inválida
      }
    });
  }

  // ---------------------------
  // 2. Botón Panel con contraseña
  // ---------------------------
  const accesoPanel = document.getElementById("acceso-panel");
  if (accesoPanel) {
    accesoPanel.addEventListener("click", (e) => {
      e.preventDefault(); // evita comportamiento por defecto del link
      const clave = prompt("Ingrese la contraseña para acceder al panel:");
      if (clave === "panel2025") { // <-- contraseña para demo
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
      const fecha = document.getElementById("fecha").value;
      const hora = document.getElementById("hora").value;

      if (!nombre || !email || !telefono || !fecha || !hora) {
        alert("Por favor complete todos los campos.");
        return;
      }

      // Guardar turno en localStorage
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

      alert("✅ Turno reservado correctamente.");
      formTurnos.reset();
      horaSelect.innerHTML = `<option value="">Seleccione una hora</option>`;
    });
  }
});


