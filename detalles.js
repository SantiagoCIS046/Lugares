document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const lugarId = urlParams.get("id");

  if (!lugarId) {
    window.location.href = "index.html";
    return;
  }

  try {
    // Cargar datos desde localStorage o archivo JSON
    let lugares = JSON.parse(localStorage.getItem("lugares"));

    if (!lugares) {
      const response = await axios.get("./lugares.json");
      lugares = response.data;
      localStorage.setItem("lugares", JSON.stringify(lugares));
    }

    // Buscar el lugar específico
    const lugarSeleccionado = lugares.find((lugar) => lugar.id == lugarId);

    if (!lugarSeleccionado) {
      throw new Error("Lugar no encontrado");
    }

    // Mostrar los detalles
    renderDetail(lugarSeleccionado);

    // Establecer el color de fondo
    const detailContainer = document.querySelector(".detail-container");
    const primaryColor = lugarSeleccionado.categoria.colorPrimario;
    const secondaryColor = lugarSeleccionado.categoria.colorSecundario;
    detailContainer.style.background = `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor})`;
  } catch (error) {
    console.error("Error al cargar los datos:", error);
    window.location.href = "index.html";
  }
});

function renderDetail(lugar) {
  const detailContent = document.getElementById("detail-content");

  // Crear HTML para los datos interesantes
  const datosHTML =
    lugar.datosInteresantes
      ?.map(
        (dato) => `
        <div class="fact-item">
            <strong>${dato.titulo}:</strong> ${dato.valor}
        </div>
    `
      )
      .join("") || "<p>No hay datos interesantes disponibles</p>";

  // Crear HTML para las actividades
  const actividadesHTML =
    lugar.actividadesRecomendadas
      ?.map(
        (actividad) => `
        <div class="activity-item">${actividad}</div>
    `
      )
      .join("") || "<p>No hay actividades recomendadas</p>";

  // Construir el contenido completo
  detailContent.innerHTML = `
        <div class="detail-header">
            <img src="${lugar.url_imagen}" alt="${
    lugar.nombre
  }" class="detail-image">
            <h1 class="detail-title">${lugar.nombre}</h1>
            <h2 class="detail-subtitle">${lugar.ciudad}, ${lugar.pais}</h2>
        </div>
        
        <div class="detail-section">
            <h3>Descripción</h3>
            <p>${lugar.descripcion || "No hay descripción disponible"}</p>
        </div>
        
        <div class="detail-section">
            <h3>Datos Interesantes</h3>
            ${datosHTML}
        </div>
        
        <div class="detail-section">
            <h3>Actividades Recomendadas</h3>
            <div class="activity-list">
                ${actividadesHTML}
            </div>
        </div>
        
        <div class="detail-section">
            <h3>Ubicación</h3>
            <p>${
              lugar.coordenadas
                ? `Latitud: ${lugar.coordenadas.latitud}, Longitud: ${lugar.coordenadas.longitud}`
                : "Ubicación no disponible"
            }</p>
        </div>
    `;
}
