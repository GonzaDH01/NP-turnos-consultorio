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
