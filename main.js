document.addEventListener("DOMContentLoaded", async () => {
  let lugares = await axios.get("./lugares.json");

  console.log(lugares.data);

  let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

  function renderPlaces(placesToRender) {
    const root = document.getElementById("root");
    root.innerHTML = "";

    placesToRender.forEach((element) => {
      const isFavorite = favoritos.includes(element.id);

      const placeCard = document.createElement("div");
      placeCard.className = "place-card";
      placeCard.innerHTML = `
                <a href="detalles.html?id=${element.id}" class="card-link">
                    <img class="image" src="${element.url_imagen}" alt="${
        element.nombre
      }" loading="lazy">
                    <div class="texto">
                        <h3>${element.nombre}</h3>
                        <p>${element.descripcion}</p>
                        <p><strong>Ciudad:</strong> ${element.ciudad}</p>
                        <h4>${element.pais}</h4>
                    </div>
                </a>
                <button type="button" class="${
                  isFavorite ? "favorite-btn" : ""
                }" data-id="${element.id}">
                    ${
                      isFavorite
                        ? "❤️ Quitar de favoritos"
                        : "💙 Añadir a favoritos"
                    }
                </button>
            `;

      root.appendChild(placeCard);
    });

    document.querySelectorAll("[data-id]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        toggleFavorite(btn.dataset.id);
      });
    });
  }

  function toggleFavorite(id) {
    const index = favoritos.indexOf(Number(id));
    if (index === -1) {
      favoritos.push(Number(id));
    } else {
      favoritos.splice(index, 1);
    }
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    renderPlaces(
      currentFilter === "favorites"
        ? lugares.filter((l) => favoritos.includes(l.id))
        : lugares
    );
  }

  let currentFilter = "all";

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active-filter"));
      btn.classList.add("active-filter");

      currentFilter = btn.dataset.filter;

      switch (currentFilter) {
        case "all":
          renderPlaces(lugares);
          break;
        case "favorites":
          renderPlaces(lugares.filter((l) => favoritos.includes(l.id)));
          break;
        case "ciudad":
          renderPlaces(
            lugares.filter((l) => l.categoria.nombre.includes("Ciudad"))
          );
          break;
        case "naturaleza":
          renderPlaces(
            lugares.filter((l) => l.categoria.nombre.includes("Natural"))
          );
          break;
        case "historia":
          renderPlaces(
            lugares.filter(
              (l) =>
                l.categoria.nombre.includes("Histórico") ||
                l.categoria.nombre.includes("Antiguo")
            )
          );
          break;
        default:
          renderPlaces(lugares);
      }
    });
  });

  renderPlaces(lugares.data);
});
