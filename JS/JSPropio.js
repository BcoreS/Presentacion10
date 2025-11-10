// --- Inicialización global de todos los mapas al cargar la página ---
// Coordenadas destino UTN Alajuela
const DEST_UTN_ALAJUELA = { lat: 10.0162, lng: -84.2136 };

function initMap() {
  // Inicializar el mapa de distancia cuando se muestra la sección
  const collapse = document.getElementById('collapseFour');
  if (collapse) {
    collapse.addEventListener('shown.bs.collapse', () => {
      if (!distanceMap) initDistanceMap();
      google.maps.event.trigger(distanceMap, 'resize');
    });
    // Si ya está visible por cualquier motivo
    if (collapse.classList.contains('show')) {
      initDistanceMap();
    }
  } else {
    // Fallback si no existe el colapso o el contenedor ya es visible
    if (document.getElementById('map-distance-calc')) initDistanceMap();
  }
  console.log('Mapas inicializados');
}

// Mapa demo del botón "Verificar Geolocation"
function initGeolocationDemoMap() {
  const el = document.getElementById('map-geolocation-demo');
  if (!el) return;
  const map = new google.maps.Map(el, {
    center: { lat: 9.7489, lng: -83.7534 },
    zoom: 7
  });
  // Guardar referencia opcional
  el.__gm = map;
}

// Mapa de posición actual (map-current-position)
function initCurrentPositionMap() {
  const el = document.getElementById('map-current-position');
  if (!el) return;
  const fallbackCenter = { lat: 9.7489, lng: -83.7534 };
  const baseMap = new google.maps.Map(el, {
    center: fallbackCenter,
    zoom: 6
  });
  if (!navigator.geolocation) {
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      baseMap.setCenter(loc);
      baseMap.setZoom(15);
      new google.maps.Marker({
        position: loc,
        map: baseMap,
        title: 'Tu posición actual'
      });
    },
    (err) => console.warn('Geolocation error map-current-position:', err)
  );
}

// Múltiples contenedores con id "map-geolocation" (IDs duplicados)
function initAllRepeatedGeolocationMaps() {
  const els = document.querySelectorAll('#map-geolocation');
  if (!els.length) return;
  els.forEach((el, i) => {
    const map = new google.maps.Map(el, {
      center: { lat: 9.9, lng: -84.1 },
      zoom: 7,
      mapTypeId: 'roadmap'
    });
    // Marcador simple diferenciando índice
    new google.maps.Marker({
      position: { lat: 9.9, lng: -84.1 },
      map,
      label: String(i + 1),
      title: 'Ejemplo Geolocation (placeholder)'
    });
  });
}

// Mapa para ejemplo "Obtener Posición" (map-get-position)
function initGetPositionMap() {
  const el = document.getElementById('map-get-position');
  if (!el) return;
  const map = new google.maps.Map(el, {
    center: { lat: 9.7489, lng: -83.7534 },
    zoom: 6
  });
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        map.setCenter(loc);
        map.setZoom(14);
        new google.maps.Marker({
          position: loc,
          map,
          title: 'Posición obtenida'
        });
      },
      (err) => console.warn('Error get-position:', err)
    );
  }
}

// Mapa para manejo de errores (solo base visual)
function initErrorHandlingMap() {
  const el = document.getElementById('map-error-handling');
  if (!el) return;
  const map = new google.maps.Map(el, {
    center: { lat: 9.7489, lng: -83.7534 },
    zoom: 6
  });
  el.__gm = map;
}

// Ruta desde ubicación actual a UTN (map)
function initRouteMap() {
  const el = document.getElementById('map');
  if (!el) return;
  const map = new google.maps.Map(el, {
    center: DEST_UTN_ALAJUELA,
    zoom: 13
  });
  const destMarker = new google.maps.Marker({
    position: DEST_UTN_ALAJUELA,
    map,
    title: 'UTN Sede Central Alajuela'
  });

  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const origin = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      new google.maps.Marker({
        position: origin,
        map,
        title: 'Tu ubicación',
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
      });

      const ds = new google.maps.DirectionsService();
      const dr = new google.maps.DirectionsRenderer({ map });

      ds.route(
        {
          origin,
          destination: DEST_UTN_ALAJUELA,
          travelMode: google.maps.TravelMode.DRIVING
        },
        (res, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            dr.setDirections(res);
          } else {
            console.warn('Fallo trazando ruta:', status);
          }
        }
      );
    },
    (err) => console.warn('Error geolocalización para ruta:', err)
  );
}

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

// Utilidad para actualizar el alert
function setGeoAlert(type, html) {
  const el = document.getElementById('geo-error-result');
  if (!el) return;
  el.className = 'alert'; // reset
  const map = {
    info: 'alert alert-info',
    success: 'alert alert-success',
    warning: 'alert alert-warning',
    danger: 'alert alert-danger',
  };
  el.className = map[type] || 'alert alert-info';
  el.innerHTML = html;
}

// Limpia resultado
function geoClearResult() {
  setGeoAlert('info', 'Haz clic en un botón para ver el resultado aquí.');
}

// Éxito: muestra coordenadas
function handleGeoSuccess(position) {
  const { latitude, longitude, accuracy } = position.coords;
  console.log(`Latitud: ${latitude}, Longitud: ${longitude}, Precisión: ${accuracy}m`);
  setGeoAlert(
    'success',
    `<strong>OK:</strong> Latitud: ${latitude.toFixed(6)}, Longitud: ${longitude.toFixed(6)} (±${Math.round(accuracy)} m)`
  );
}

// Error: mapea los códigos a mensajes
function handleGeoError(error) {
  // Códigos: 1=PERMISSION_DENIED, 2=POSITION_UNAVAILABLE, 3=TIMEOUT
  console.error('Error al obtener la posición:', error);
  switch (error.code) {
    case 1:
      setGeoAlert('danger', '<strong>PERMISSION_DENIED:</strong> El usuario denegó la solicitud de geolocalización.');
      break;
    case 2:
      setGeoAlert('warning', '<strong>POSITION_UNAVAILABLE:</strong> La información de ubicación no está disponible.');
      break;
    case 3:
      setGeoAlert('warning', '<strong>TIMEOUT:</strong> La solicitud de ubicación ha caducado.');
      break;
    default:
      setGeoAlert('danger', `<strong>Error desconocido:</strong> ${error.message || ''}`);
  }
}

// Botón: pedir ubicación (si niegas el permiso, verás PERMISSION_DENIED)
function geoRequestPermissionDenied() {
  if (!('geolocation' in navigator)) {
    setGeoAlert('danger', 'Geolocation no está disponible en este navegador.');
    return;
  }
  navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError);
}

// Botón: forzar TIMEOUT usando un timeout extremadamente bajo
function geoForceTimeout() {
  if (!('geolocation' in navigator)) {
    setGeoAlert('danger', 'Geolocation no está disponible en este navegador.');
    return;
  }
  navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError, {
    enableHighAccuracy: true,
    timeout: 1, // 1ms para provocar timeout
    maximumAge: 0,
  });
}

// Botón: simular POSITION_UNAVAILABLE (demostración sin invocar al GPS)
function geoSimulatePositionUnavailable() {
  handleGeoError({ code: 2, message: 'Simulado: la información de ubicación no está disponible.' });
}

// ====== Cálculo de distancia entre dos puntos (mostrar resultado en el mapa) ======
let distanceMap;
let distanceMarkers = { A: null, B: null };
let distanceLine = null;
let distanceInfoWindow = null;

function initDistanceMap() {
  const el = document.getElementById('map-distance-calc');
  if (!el) return;
  distanceMap = new google.maps.Map(el, {
    center: { lat: 9.7489, lng: -83.7534 },
    zoom: 7,
  });
}

function initMap() {
  // Inicializar el mapa de distancia cuando se muestra la sección
  const collapse = document.getElementById('collapseFour');
  if (collapse) {
    collapse.addEventListener('shown.bs.collapse', () => {
      if (!distanceMap) initDistanceMap();
      google.maps.event.trigger(distanceMap, 'resize');
    });
    // Si ya está visible por cualquier motivo
    if (collapse.classList.contains('show')) {
      initDistanceMap();
    }
  } else {
    // Fallback si no existe el colapso o el contenedor ya es visible
    if (document.getElementById('map-distance-calc')) initDistanceMap();
  }
  console.log('Mapas inicializados');
}

// Inicializa cuando la página cargue
$(document).ready(function() {
  console.log("Página lista. Mapas se inicializan con callback initMap.");
});
