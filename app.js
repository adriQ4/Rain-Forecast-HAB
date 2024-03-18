window.onload = (event) => {
loader(1500);
};

// Ejecucion de Botón

const btn = document.getElementById("boton-principal");
btn.addEventListener("click", function () {
loader(5000);
position();
redirigir();
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
    function (position) {
        let latitud = position.coords.latitude;
        let longitud = position.coords.longitude;
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

// *FUNCION PARA LOADER
function loader(miliseconds) {
const loader = document.getElementById("loader");
loader.style.display = "flex";
setTimeout(function () {
    loader.style.display = "none";
}, miliseconds);
}

function position() {
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=rain&forecast_days=1`;
    fetch(url)
        .then((data) => data.json())
        .then((response) => console.log(response))
        .catch((error) => console.log(`Error Fetch: ${error.message}`));
    });
} else {
    console.log("La Geolocalización no es soportada por este navegador.");
}
}
// ! REDIRIGIR A LA PAGINA DEL RESULTADO
function redirigir() {
window.location.href = "index2.html";
}
