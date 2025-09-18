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
  const fechaInput = document.getElementById("fecha");
  const horaSelect = document.getElementById("hora");
  const form = document.querySelector("form");

  // Horarios disponibles por día de la semana
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
      const hh = h.toString().padStart(2, "0");
      const mm = m.toString().padStart(2, "0");
      horarios.push(`${hh}:${mm}`);
      m += intervalo;
      if (m >= 60) { m -= 60; h++; }
    }
    return horarios;
  }

  // Convierte string "YYYY-MM-DD" a Date de manera segura sin timezone
  function parseFecha(str) {
    const [año, mes, dia] = str.split("-").map(Number);
    return new Date(año, mes - 1, dia); // mes 0-index
  }

  fechaInput.addEventListener("change", () => {
    if (!fechaInput.value) return;

    const fecha = parseFecha(fechaInput.value);
    const diaSemana = fecha.getDay();

    horaSelect.innerHTML = `<option value="">Seleccione una hora</option>`; // reset

    if (horariosDisponibles[diaSemana]) {
      const { inicio, fin } = horariosDisponibles[diaSemana];
      const horarios = generarHorarios(inicio, fin, 10);

      // Filtrar horarios ya reservados
      const turnos = JSON.parse(localStorage.getItem("turnos")) || [];
      const fechaStr = fechaInput.value;

      const horariosLibres = horarios.filter(hora =>
        !turnos.some(turno => turno.fecha === fechaStr && turno.hora === hora)
      );

      horariosLibres.forEach(hora => {
        const option = document.createElement("option");
        option.value = hora;
        option.textContent = hora;
        horaSelect.appendChild(option);
      });

      if (horariosLibres.length === 0) {
        alert("No hay horarios disponibles para ese día.");
        fechaInput.value = "";
      }

    } else {
      alert("⚠️ Solo se pueden reservar turnos los días Martes, Miércoles o Jueves.");
      fechaInput.value = "";
    }
  });

  // Evento al enviar formulario
  form.addEventListener("submit", (e) => {
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

    // Guardar turno en localStorage
    const turnos = JSON.parse(localStorage.getItem("turnos")) || [];
    turnos.push({ nombre, email, telefono, fecha, hora });
    localStorage.setItem("turnos", JSON.stringify(turnos));

    alert(`✅ Turno reservado para ${fecha} a las ${hora}.\nGracias, ${nombre}!`);

    form.reset();
    horaSelect.innerHTML = `<option value="">Seleccione una hora</option>`;
  });
});
