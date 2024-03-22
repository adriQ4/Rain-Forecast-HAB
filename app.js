"use strict";

window.onload = (event) => {
  loader(1000);
};

// ! Extracciones del DOM
const btn = document.getElementById("btn8");
const btn24 = document.getElementById("btn24");
const $cabecera = document.getElementById("cabecera");
const $title = document.getElementById("title");
const $coordenadas = document.getElementById("coordenadas");
const $forTabla = document.getElementById("forTabla");
const $rain = document.querySelector(".rain");
const $footer = document.querySelector("footer");

//!click en el boton 8 horas.
btn.addEventListener("click", async function () {
  loader(2500);
  try {
    await obtenerCoordenadas();
    await position(7);
    disableHTML();
    homeReturn();
    $cabecera.style.fontSize = $cabecera.innerText =
      "PRONÓSTICO PRÓXIMAS 8 HORAS";
  } catch (error) {
    console.log(`Error: ${error}`);
  }
});

//!click en el boton 24 horas.
btn24.addEventListener("click", async function () {
  loader(2500);
  try {
    await obtenerCoordenadas();
    await position(23);
    disableHTML();
    homeReturn();
    $cabecera.style.fontSize = $cabecera.innerText =
      "PRONÓSTICO PRÓXIMAS 24 HORAS";
  } catch (error) {
    console.log(`Error: ${error}`);
  }
});

//!coordenadas
function obtenerCoordenadas() {
  return new Promise((resolve, reject) => {
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
          resolve();
        },
        function (error) {
          console.log(`Error: ${error.message}`);
          reject(error);
        },
        {
          maximumAge: 60000,
        }
      );
    } else {
      const error = "La Geolocalización no es soportada por este navegador.";
      console.log(error);
      reject(error);
    }
  });
}

// !loader()
function loader(miliseconds) {
  const loader = document.getElementById("loader");
  loader.style.display = "flex";
  setTimeout(function () {
    loader.style.display = "none";
  }, miliseconds);
}

//! URL API
function obtenerUrlAPI(lat, lon) {
  return `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=rain,precipitation_probability,temperature_2m&forecast_days=1`;
}

//!peticion API
function position(forLength) {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        let url = obtenerUrlAPI(lat, lon);

        try {
          let response = await fetch(url);
          let data = await response.json();

          const { precipitation_probability, rain, time, temperature_2m } =
            data.hourly;

          let hora = time.slice(0, 24).map((hora, index) => {
            let horas = new Date();
            horas.setHours(horas.getHours() + index);
            let hours = horas.getHours().toString().padStart(2, "0");
            let minutes = horas.getMinutes().toString().padStart(2, "0");
            return `${hours}:${minutes}`;
          });

          // <- Creamos la tabla.
          const tablaCreate = document.createElement("table");
          tablaCreate.classList = "tabla";
          $forTabla.appendChild(tablaCreate);

          const theadCreate = document.createElement("thead");
          theadCreate.className = "tablaHead";
          const trCreate = document.createElement("tr");
          trCreate.classList = "filaHead";
          theadCreate.appendChild(trCreate);

          const thHoras = document.createElement("th");
          thHoras.textContent = "HORA";
          thHoras.classList = "celdaHead";
          trCreate.appendChild(thHoras);

          const thLlueve = document.createElement("th");
          thLlueve.textContent = "¿LLOVERÁ?";
          thLlueve.classList = "celdaHead";
          trCreate.appendChild(thLlueve);

          const thLLuvia = document.createElement("th");
          thLLuvia.textContent = "% LLUVIA";
          thLLuvia.classList = "celdaHead";
          trCreate.appendChild(thLLuvia);

          const thTemperatura = document.createElement("th");
          thTemperatura.textContent = "TEMPERATURA";
          thTemperatura.classList = "celdaHead";
          trCreate.appendChild(thTemperatura);
          tablaCreate.appendChild(theadCreate);

          const tablaBody = document.createElement("tbody");
          tablaBody.className = "tablaBody";
          tablaCreate.appendChild(tablaBody);

          for (let i = 0; i <= forLength; i++) {
            const filaTabla = document.createElement("tr");
            filaTabla.classList = "filaBody";

            const celdaHora = document.createElement("td");
            celdaHora.classList = "celdaDatos";
            celdaHora.textContent = `${hora[i]}`;
            filaTabla.appendChild(celdaHora);

            const celdaLLuvia = document.createElement("td");
            celdaLLuvia.classList = "celdaDatos";
            celdaLLuvia.textContent = `${rain[i] > 0 ? "Sí 🌦���" : "No ☀️"}`;
            filaTabla.appendChild(celdaLLuvia);

            const celdaPrecipitacion = document.createElement("td");
            celdaPrecipitacion.classList = "celdaDatos";
            celdaPrecipitacion.textContent = `${precipitation_probability[i]} %`;
            filaTabla.appendChild(celdaPrecipitacion);

            const celdaTemperatura = document.createElement("td");
            celdaTemperatura.classList = "celdaDatos";
            celdaTemperatura.textContent = `${Math.round(
              temperature_2m[i]
            )} °C`;
            filaTabla.appendChild(celdaTemperatura);

            tablaBody.appendChild(filaTabla);

            if (rain[i] > 0) {
              tablaBody.style.backgroundImage = "url('imgs/raining.png')";
              tablaBody.style.backgroundSize = "cover";
            } else {
              tablaBody.style.backgroundImage = "url('imgs/soleado.png')";
              tablaBody.style.backgroundSize = "cover";
            }
          }

          resolve();
        } catch (error) {
          console.log("Error:", error);
          reject(error);
        }
      });
    } else {
      const error = "La Geolocalización no es soportada por este navegador.";
      console.log(error);
      reject(error);
    }
  });
}

//! postClick()
function disableHTML() {
  $cabecera.style.fontSize = "2rem";
  $cabecera.style.textAlign = "center";
  btn.style.display = "none";
  btn24.style.display = "none";
  $rain.style.display = "none";
}

//!efecto gotas de lluvia
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

//!creamos img"inicio" y hacemos el reload
function homeReturn() {
  const icon = document.createElement("img");
  icon.src = "imgs/home-automation.png";
  icon.alt = "home/return...";
  icon.className = "botonRetorno";
  icon.style.margin = "5px auto auto 5px";
  $title.parentNode.insertBefore(icon, $title);

  icon.addEventListener("click", () => {
    location.reload();
  });
}
