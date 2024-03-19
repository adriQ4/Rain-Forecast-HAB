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
          let hora = time.map((hora) => {
            let horas = new Date(hora);
            let hours = horas.getHours().toString().padStart(2, "0");
            let minutes = horas.getMinutes().toString().padStart(2, "0");
            return `${hours}:${minutes}`;
          });
          for (let i = 0; i < precipitation_probability.length; i++) {
            rain[i] > 0 ? (rain[i] = "Si") : (rain[i] = "No");
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
//* Añadido:
// DesactivaElementos
function disableHTML() {
  $cabecera.style.fontSize = $cabecera.innerText = "PRONOSTICO DE 24H";
  btn.style.display = "none";
  $tablaPrincipal.style.display = "block";
}

// //! OBTENER HORA
// function currenthour() {
//   let fechaActual = new Date();

//   let horas = fechaActual.getHours();
//   let minutos = fechaActual.getMinutes();
//   let segundos = fechaActual.getSeconds();

//   let ampm = horas >= 12 ? "PM" : "AM";

//   horas = horas % 12;
//   horas = horas ? horas : 12; // la hora '0' debería ser '12'

//   minutos = minutos < 10 ? "0" + minutos : minutos;

//   let strHora = horas + ":" + minutos + ":" + segundos + " " + ampm;

//   console.log("Hora actual: " + strHora);
// }
// currenthour();

// * HORA ACTUAL
let fechaActual = new Date();
let hour = fechaActual.getHours();

function findHour(array) {
  let result = array.find((e) => e === hour);
  return console.log(result);
}
