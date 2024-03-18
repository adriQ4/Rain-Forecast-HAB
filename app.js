window.onload = (event) => {
    setTimeout(function() {
        const loader = document.getElementById('loader');
        loader.style.display = 'none';
    }, 1000);
}
function loader(){
    const loader = document.getElementById('loader');
        loader.style.display = 'flex';
        setTimeout(function() {;
            loader.style.display = 'none';
        }, 5000);

}
//

const btn = document.getElementById('boton-principal');

btn.addEventListener('click', function() {
    loader()
    position()
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            let latitud = position.coords.latitude;
            let longitud = position.coords.longitude;
        }, function(error) {
            console.log('Error: ' + error.message);
        }, {
            maximumAge: 60000
        })
    } else {
        console.log('La Geolocalización no es soportada por este navegador.');
    }
});

function position(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            let url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=rain&forecast_days=1`
            fetch(url)
        .then(data => data.json())
        .then(response => console.log(response));;
        });
    } else { 
        console.log("La Geolocalización no es soportada por este navegador.");
    }

}





