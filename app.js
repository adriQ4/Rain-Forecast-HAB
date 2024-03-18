window.onload = (event) => {
loader(1500);
};

// ! Extracciones del DOM
const btn = document.getElementById("boton-principal");
const $cabecera = document.getElementById('cabecera');
const $coordenadas = document.getElementById('coordenadas');

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
        $coordenadas.innerText = `Latitud: ${latitud} Longitud: ${longitud}`//
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

function obtenerUrlAPI(latitud, longitud) {
    return `https://api.open-meteo.com/v1/forecast?latitude=${latitud}&longitude=${longitud}&hourly=rain,precipitation_probability&forecast_days=1`;
}

function position() {
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let url = obtenerUrlAPI(lat, lon);
    fetch(url)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log('Error:', error));
});
} else {
console.log("La Geolocalización no es soportada por este navegador.");
}
}
//* Añadido: 
// DesactivaElementos
function disableHTML(){
    $cabecera.style.fontSize = 
    $cabecera.innerText = "PRONOSTICO DE 24H";
    btn.style.display = "none"
}
