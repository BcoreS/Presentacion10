// Función para verificar si Geolocation está disponible
function checkGeolocation() {
  const resultDiv = document.getElementById('geolocation-check-result');
  const mapDiv = document.getElementById('map-geolocation-demo');
  
  // Ejecutar el código de verificación
  if (navigator.geolocation) {
    console.log("Geolocation está disponible");
    
    // Mostrar resultado en la página
    resultDiv.className = 'alert alert-success';
    resultDiv.innerHTML = '<strong>✓ Resultado:</strong> Geolocation está disponible<br><small class="text-muted">console.log: "Geolocation está disponible"</small>';
    
    // Obtener ubicación y mostrar en el mapa
    navigator.geolocation.getCurrentPosition(
      function(position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        resultDiv.innerHTML += `<br><strong>Ubicación obtenida:</strong> Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
        
        // Crear el mapa
        const map = new google.maps.Map(mapDiv, {
          center: { lat: lat, lng: lng },
          zoom: 15
        });
        
        // Agregar marcador
        new google.maps.Marker({
          position: { lat: lat, lng: lng },
          map: map,
          title: 'Tu ubicación',
          animation: google.maps.Animation.DROP,
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
          }
        });
        
        // Agregar círculo de precisión
        new google.maps.Circle({
          strokeColor: '#4285F4',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#4285F4',
          fillOpacity: 0.2,
          map: map,
          center: { lat: lat, lng: lng },
          radius: position.coords.accuracy
        });
      },
      function(error) {
        resultDiv.innerHTML += `<br><strong>⚠ Error:</strong> ${error.message}`;
        
        // Mostrar mapa por defecto
        const map = new google.maps.Map(mapDiv, {
          center: { lat: 9.7489, lng: -83.7534 },
          zoom: 8
        });
      }
    );
    
  } else {
    console.log("Geolocation no está disponible");
    
    // Mostrar resultado en la página
    resultDiv.className = 'alert alert-danger';
    resultDiv.innerHTML = '<strong>✗ Resultado:</strong> Geolocation NO está disponible en este navegador<br><small class="text-muted">console.log: "Geolocation no está disponible"</small>';
    
    // Mostrar mensaje en el mapa
    mapDiv.innerHTML = '<div class="d-flex align-items-center justify-content-center h-100"><p class="text-danger fw-bold">Geolocation no está disponible</p></div>';
  }
}

// Función para inicializar el mapa (requerida por Google Maps API)
function initMap() {
  // Esta función se ejecuta automáticamente cuando Google Maps API se carga
  console.log("Google Maps API cargada correctamente");
}

// Inicializar cuando la página cargue
$(document).ready(function() {
  console.log("Página lista. Haz clic en 'Verificar Geolocation' para probar.");
});
