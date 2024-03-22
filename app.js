"use strict";

window.onload = (event) => {
  loader(100);
};

// ! Extracciones del DOM
const btn = document.querySelector(".boton");
const $cabecera = document.getElementById("cabecera");
const $title = document.getElementById("title");
const $coordenadas = document.getElementById("coordenadas");
const $forTabla = document.getElementById("forTabla");
const $rain = document.querySelector(".rain");
const $footer = document.querySelector("footer");

//!click en el boton
btn.addEventListener("click", function () {
  loader(2000);
  position();
  disableHTML();
  homeReturn();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        let latitud = position.coords.latitude;
        let longitud = position.coords.longitude;

        let coorSection = document.createElement("section");
        coorSection.className = "padreCoordenadas";

        let parLatitud = document.createElement("p");
        parLatitud.className = "coordenadas";
        parLatitud.textContent = `Latitud: ${latitud}`;
        coorSection.appendChild(parLatitud);

        let parLongitud = document.createElement("p");
        parLongitud.className = "coordenadas";
        parLongitud.textContent = `Longitud: ${longitud}`;
        coorSection.appendChild(parLongitud);

        btn.parentNode.insertBefore(coorSection, btn.nextSibling);
      },
      function (error) {
        console.log(`Error: ${error.message}`);
      },
      {
        maximumAge: 60000,
      }
    );
  } else {
    console.log("La Geolocalización no es soportada por este navegador.");
  }
});

// !loader()
function loader(miliseconds) {
  const loader = document.getElementById("loader");
  loader.style.display = "flex";
  setTimeout(function () {
    loader.style.display = "none";
  }, miliseconds);
}

function obtenerUrlAPI(lat, lon) {
  return `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=rain,precipitation_probability,temperature_2m&forecast_days=1`;
}
//! Creamos function() para obtener 'data', cree la tabla y le añada la info.
function position() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;
      let url = obtenerUrlAPI(lat, lon);

      fetch(url) //<-- Peticion.
        .then((response) => response.json())
        .then((data) => {
          const { precipitation_probability, rain, time, temperature_2m } =
            data.hourly;

          let hora = time.slice(0, 9).map((hora, index) => {
            let horas = new Date();
            horas.setHours(horas.getHours() + index);
            let hours = horas.getHours().toString().padStart(2, "0");
            let minutes = horas.getMinutes().toString().padStart(2, "0");
            return `${hours}:${minutes}`;
          });

          // <- Creamos la tabla.
          const tablaCreate = document.createElement("table"); //<-- Creamos la tabla.
          tablaCreate.classList = "tabla";
          $forTabla.appendChild(tablaCreate); // <-- La añadimos al section.

          const theadCreate = document.createElement("thead"); // <-- Creamos el <thead>.
          theadCreate.className = "tablaHead";
          const trCreate = document.createElement("tr"); // <-- creamos el <tr>.
          theadCreate.appendChild(trCreate); // <-- lo añadimos al <thead>.

          const thHoras = document.createElement("th"); // <-- creamos el <th> para las Horas.
          thHoras.textContent = "Horas";
          trCreate.appendChild(thHoras); // <-- lo añadimos a la tabla.

          const thLlueve = document.createElement("th"); // <-- creamos el <th> para si o no lloverá.
          thLlueve.textContent = "¿LLOVERÁ?";
          trCreate.appendChild(thLlueve); // <-- lo añadimos a la tabla.

          const thLLuvia = document.createElement("th"); // <-- creamos el <th> para % de lluvia.
          thLLuvia.textContent = "% Lluvia";
          trCreate.appendChild(thLLuvia); // <-- lo añadimos a la tabla.

          const thTemperatura = document.createElement("th"); // <-- creamos el <th> para la temperatura.
          thTemperatura.textContent = "Temperatura";
          trCreate.appendChild(thTemperatura);
          tablaCreate.appendChild(theadCreate); // <-- lo añadimos a la tabla.

          const tablaBody = document.createElement("tbody"); //<-- creamos el <tbody>.
          tablaBody.className = "tablaBody";
          tablaCreate.appendChild(tablaBody); // <-- lo añadimos a la tabla

          for (let i = 0; i <= 7; i++) {
            const filaTabla = document.createElement("tr"); // <-- crea la fila en cada iteración.

            const celdaHora = document.createElement("td"); //<-- crea la celda obtiene y mete los datos.
            celdaHora.textContent = `${hora[i]}`;
            filaTabla.appendChild(celdaHora);

            const celdaLLuvia = document.createElement("td"); //<-- crea la celda obtiene y mete los datos.
            celdaLLuvia.textContent = `${rain[i] > 0 ? "Sí 🌦️" : "No ☀️"}`;
            filaTabla.appendChild(celdaLLuvia);

            const celdaPrecipitacion = document.createElement("td"); //<-- crea la celda obtiene y mete los datos.
            celdaPrecipitacion.textContent = `${precipitation_probability[i]} %`;
            filaTabla.appendChild(celdaPrecipitacion);

            const celdaTemperatura = document.createElement("td"); //<-- crea la celda obtiene y mete los datos.
            celdaTemperatura.textContent = `${Math.round(
              temperature_2m[i]
            )} °C`;
            filaTabla.appendChild(celdaTemperatura);

            tablaBody.appendChild(filaTabla); //<--le metemos las filas a la tabla.

            if (rain[i] > 0) {
              tablaBody.style.backgroundImage = "url('imgs/raining.png')";
              tablaBody.style.backgroundSize = "cover";
            } else {
              tablaBody.style.backgroundImage = "url('imgs/soleado.png')";
              tablaBody.style.backgroundSize = "cover";
            }
          }
        })
        .catch((error) => console.log("Error:", error));
    });
  } else {
    console.log("La Geolocalización no es soportada por este navegador.");
  }
}

//! postClick()
function disableHTML() {
  $cabecera.style.fontSize = "2rem";
  $cabecera.style.textAlign = "center";
  $cabecera.style.fontSize = $cabecera.innerText =
    "PRONÓSTICO PRÓXIMAS 8 HORAS";
  btn.style.display = "none";
  $rain.style.display = "none";
}

//! QUITAR GOTAS DE LLUVIA PASADO UNOS SEGUNDOS
setTimeout(function () {
  $rain.style.opacity = "0.7";
}, 3000);
setTimeout(function () {
  $rain.style.opacity = "0.5";
}, 4000);
setTimeout(function () {
  $rain.style.opacity = "0.3";
}, 6000);
setTimeout(function () {
  $rain.style.opacity = "0.1";
}, 7000);
setTimeout(function () {
  $rain.style.display = "none";
}, 8000);

const icon = document.createElement("img");
function homeReturn() {
  icon.src = "imgs/home-automation.png";
  icon.alt = "home/return...";
  icon.className = "botonRetorno";
  $title.parentNode.insertBefore(icon, $title);
}

icon.addEventListener("click", () => {
  location.reload();
});
