'use strict'

window.onload = (event) => {
  loader(1500);
};

// ! Extracciones del DOM
const btn = document.getElementById("boton-principal");
const $cabecera = document.getElementById("cabecera");
const $coordenadas = document.getElementById("coordenadas");
const $tablaBody = document.getElementById("tablaBody");
const $tablaPrincipal = document.getElementById("tabla-principal");

// * Creaciones del DOM

// Ejecucion de Botón
btn.addEventListener("click", function () {
  loader(3000);
  position();
  disableHTML();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        let latitud = position.coords.latitude;
        let longitud = position.coords.longitude;
        $coordenadas.innerText = `Latitud: ${latitud} Longitud: ${longitud}`; //
      }, //! Añadido
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

// *FUNCION PARA LOADER
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
          for (let i = 0; i <= 8; i++) {
            rain[i] > 0 ? (rain[i] = "Sí 🌦️") : (rain[i] = "No ☀️");
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

// *FUNCION PARA DESACTIVAR ELEMENTOS
function disableHTML() {
  $cabecera.style.fontSize ="2rem"
  $cabecera.style.fontSize = $cabecera.innerText = "PRONÓSTICO PRÓXIMAS 8 HORAS";
  btn.style.display = "none";
  //!modificado 
  $tablaPrincipal.style.display = "inline-block";
}
