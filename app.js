"use strict";

window.onload = (event) => {
  loader(500);
};

// ! Extracciones del DOM
const btn = document.querySelector(".boton");
const $cabecera = document.getElementById("cabecera");
const $title = document.getElementById("title");
const $coordenadas = document.getElementById("coordenadas");
const $tablaBody = document.getElementById("tablaBody");
const $tablaPrincipal = document.getElementById("tabla-principal");
const $rain = document.querySelector(".rain");
const $footer = document.querySelector("footer");

// Ejecucion de Botón
btn.addEventListener("click", function () {
  loader(3000);
  position();
  disableHTML();
  homeReturn();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        let latitud = position.coords.latitude;
        let longitud = position.coords.longitude;
        console.log(latitud, longitud);
        let coorSection = document.createElement("section"); // CREO LA SECTION PARA COORDENADAS.
        coorSection.className = "padreCoordenadas"; // LE DOY CLASE.
        let parLatitud = document.createElement("p"); // CREO EL PÁRRAFO DE LATITUD;
        parLatitud.className = "coordenadas";
        parLatitud.textContent = `Latitud: ${latitud}`;
        coorSection.appendChild(parLatitud); // METO EL 'LATITUD' EN SECTION DE COORDENADAS.
        let parLongitud = document.createElement("p");
        parLongitud.className = "coordenadas";
        parLongitud.textContent = `Longitud: ${longitud}`;
        coorSection.appendChild(parLongitud); // METO EL 'LONGITUD' EN SECTION DE COORDENADAS.

        btn.parentNode.insertBefore(coorSection, btn.nextSibling); // AÑADO AL BODY LA SECTION COORDENADAS.
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

// *LOADER()
function loader(miliseconds) {
  const loader = document.getElementById("loader");
  loader.style.display = "flex";
  setTimeout(function () {
    loader.style.display = "none";
  }, miliseconds);
}

function obtenerUrlAPI(lat, lon) {
  return `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=rain,precipitation_probability&forecast_days=1`;
}
//*FUNCION PARA ENCONTRAR POSICION Y PROXIMAS HORAS DE LLUVIA
function position() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;
      let url = obtenerUrlAPI(lat, lon);
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const { precipitation_probability, rain, time } = data.hourly;
          let hora = time.slice(0, 9).map((hora, index) => {
            let horas = new Date();
            horas.setHours(horas.getHours() + index);
            let hours = horas.getHours().toString().padStart(2, "0");
            let minutes = horas.getMinutes().toString().padStart(2, "0");
            return `${hours}:${minutes}`;
          });
          for (let i = 0; i <= 7; i++) {
            // rain[i] > 0 ? (rain[i] = "Sí 🌦️") : (rain[i] = "No ☀️");
            if (rain[i] > 0) {
              rain[i] = "Sí 🌦️";
            } else {
              rain[i] = "No ☀️";
              $tablaBody.style.backgroundImage = "url('/imgs/soleado.png')";
              $tablaBody.style.backgroundSize = "cover";
              $tablaBody.style.opacity = "0.8";
            }
            $tablaBody.innerHTML += `<tr><td>${hora[i]}</td><td>${rain[i]}</td><td>${precipitation_probability[i]}%</td></tr>`;
          }

          console.log(data.hourly);
        })
        .catch((error) => console.log("Error:", error));
    });
  } else {
    console.log("La Geolocalización no es soportada por este navegador.");
  }
}

// *POSTCLICK()
function disableHTML() {
  $cabecera.style.fontSize = "2.3rem";
  $cabecera.style.textAlign = "center";
  $cabecera.style.fontSize = $cabecera.innerText =
    "PRONÓSTICO PRÓXIMAS 8 HORAS";
  btn.style.display = "none";
  $tablaPrincipal.style.display = "flex";
  $rain.style.display = "none";
}

// *QUITAR GOTAS DE LLUVIA PASADO UNOS SEGUNDOS
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
  icon.src = "/imgs/home-automation.png";
  icon.alt = "home/return...";
  icon.className = "botonRetorno";
  $title.parentNode.insertBefore(icon, $title);
}

icon.addEventListener("click", () => {
  location.reload();
});
