// Área de JQuery
//SI NECESITA DOCUMENT READY
$(document).ready(function () {
  $(".Ejemplo1A").css("background-color", "black");
  $(".Ejemplo1A").css("color", "white");

  $(".Ejemplo1B").css("background-color", "white");
  $(".Ejemplo1B").css("color", "black");
});

//Primer ejemplo
// Botón principal
$("#btnClick").click(function () {
  $("#cuadroClick")
    .text("¡Hiciste clic!")
    .css("background-color", "lightgreen");
});

// Botón de reinicio
$("#btnReset").click(function () {
  $("#cuadroClick")
    .text("Esperando clic...")
    .css("background-color", "lightgray");
});

//Segundo ejemplo
$("#cuadroDblClick").dblclick(function () {
  const cuadro = $(this);

  if (cuadro.hasClass("agrandado")) {
    // Volver al tamaño original
    cuadro
      .removeClass("agrandado")
      .css({
        "background-color": "lightblue",
        width: "150px",
        height: "150px",
      })
      .text("Doble clic aquí");
  } else {
    // Agrandar
    cuadro
      .addClass("agrandado")
      .css({
        "background-color": "orange",
        width: "250px",
        height: "250px",
      })
      .text("¡Doble clic detectado!");
  }
});

//Tercer Ejemplo

// Evento mouseover: cuando el mouse entra
$("#cuadroHover").mouseover(function () {
  $(this).css("background-color", "#b3e5fc").text("Mouse encima 👀");
});

// Evento mouseout: cuando el mouse sale
$("#cuadroHover").mouseout(function () {
  $(this).css("background-color", "#dcdcdc").text("Pasa el mouse aquí");
});

//Cuarto ejemplo

$("#inputKeyup").keyup(function () {
  const texto = $(this).val();
  $("#mensajeKeyup").text("Número de caracteres: " + texto.length);
});

//Quinto ejemplo

$("#formSubmit").submit(function (e) {
  e.preventDefault(); // Previene el envío real

  const nombre = $("#nombreSubmit").val();
  if (nombre.trim() === "") {
    $("#mensajeSubmit")
      .text("Por favor, ingresa tu nombre")
      .css("color", "red");
  } else {
    $("#mensajeSubmit")
      .text("¡Formulario enviado correctamente, " + nombre + "!")
      .css("color", "green");

    // Opcional: resetear formulario
    $(this)[0].reset();
  }
});

// Área de Google API

// --- Inicialización global de todos los mapas al cargar la página ---
// Coordenadas destino UTN Alajuela
const DEST_UTN_ALAJUELA = { lat: 10.0162, lng: -84.2136 };
// Coordenadas del Parque Central de Alajuela
const DEST_PARQUE_CENTRAL = { lat: 10.0162, lng: -84.2118 };

function initMap() {
  // Inicializar el mapa de distancia cuando se muestra la sección
  const collapse = document.getElementById("collapseFour");
  if (collapse) {
    collapse.addEventListener("shown.bs.collapse", () => {
      if (!distanceMap) initDistanceMap();
      google.maps.event.trigger(distanceMap, "resize");
    });
    // Si ya está visible por cualquier motivo
    if (collapse.classList.contains("show")) {
      initDistanceMap();
    }
  } else {
    // Fallback si no existe el colapso o el contenedor ya es visible
    if (document.getElementById("map-distance-calc")) initDistanceMap();
  }
  console.log("Mapas inicializados");
}

// Mapa demo del botón "Verificar Geolocation"
function initGeolocationDemoMap() {
  const el = document.getElementById("map-geolocation-demo");
  if (!el) return;
  const map = new google.maps.Map(el, {
    center: { lat: 9.7489, lng: -83.7534 },
    zoom: 7,
  });
  // Guardar referencia opcional
  el.__gm = map;
}

// Mapa de posición actual (map-current-position)
function initCurrentPositionMap() {
  const el = document.getElementById("map-current-position");
  if (!el) return;
  const fallbackCenter = { lat: 9.7489, lng: -83.7534 };
  const baseMap = new google.maps.Map(el, {
    center: fallbackCenter,
    zoom: 6,
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
        title: "Tu posición actual",
      });
    },
    (err) => console.warn("Geolocation error map-current-position:", err)
  );
}

// Múltiples contenedores con id "map-geolocation" (IDs duplicados)
function initAllRepeatedGeolocationMaps() {
  const els = document.querySelectorAll("#map-geolocation");
  if (!els.length) return;
  els.forEach((el, i) => {
    const map = new google.maps.Map(el, {
      center: { lat: 9.9, lng: -84.1 },
      zoom: 7,
      mapTypeId: "roadmap",
    });
    // Marcador simple diferenciando índice
    new google.maps.Marker({
      position: { lat: 9.9, lng: -84.1 },
      map,
      label: String(i + 1),
      title: "Ejemplo Geolocation (placeholder)",
    });
  });
}

// Mapa para ejemplo "Obtener Posición" (map-get-position)
function initGetPositionMap() {
  const el = document.getElementById("map-get-position");
  if (!el) return;
  const map = new google.maps.Map(el, {
    center: { lat: 9.7489, lng: -83.7534 },
    zoom: 6,
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
          title: "Posición obtenida",
        });
      },
      (err) => console.warn("Error get-position:", err)
    );
  }
}

// Mapa para manejo de errores (solo base visual)
function initErrorHandlingMap() {
  const el = document.getElementById("map-error-handling");
  if (!el) return;
  const map = new google.maps.Map(el, {
    center: { lat: 9.7489, lng: -83.7534 },
    zoom: 6,
  });
  el.__gm = map;
}

// Ruta desde ubicación actual a UTN (map)
function initRouteMap() {
  const mapDiv = document.getElementById("map");
  const routeInfo = document.getElementById("route-info");

  if (!mapDiv) return;

  // Crear mapa centrado en el Parque Central
  const map = new google.maps.Map(mapDiv, {
    center: DEST_PARQUE_CENTRAL,
    zoom: 13,
    mapTypeControl: true,
    streetViewControl: false,
  });

  // Marcador del destino (Parque Central)
  new google.maps.Marker({
    position: DEST_PARQUE_CENTRAL,
    map: map,
    title: "Parque Central de Alajuela",
    icon: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
    animation: google.maps.Animation.DROP,
  });

  // Verificar si geolocation está disponible
  if (!navigator.geolocation) {
    if (routeInfo) {
      routeInfo.className = "alert alert-danger mb-3";
      routeInfo.innerHTML =
        "<strong>Error:</strong> Tu navegador no soporta geolocalización.";
    }
    return;
  }

  // Obtener ubicación del usuario
  if (routeInfo) {
    routeInfo.className = "alert alert-warning mb-3";
    routeInfo.innerHTML =
      "<strong>Obteniendo:</strong> Solicitando tu ubicación...";
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      // Marcador de ubicación del usuario
      new google.maps.Marker({
        position: userLocation,
        map: map,
        title: "Tu ubicación actual",
        icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        animation: google.maps.Animation.DROP,
      });

      // Configurar DirectionsService y Renderer
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: "#4285F4",
          strokeWeight: 5,
          strokeOpacity: 0.8,
        },
      });

      if (routeInfo) {
        routeInfo.className = "alert alert-info mb-3";
        routeInfo.innerHTML =
          "<strong>Calculando:</strong> Trazando la mejor ruta...";
      }

      // Solicitar la ruta
      directionsService.route(
        {
          origin: userLocation,
          destination: DEST_PARQUE_CENTRAL,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(response);

            // Obtener información de la ruta
            const route = response.routes[0].legs[0];

            if (routeInfo) {
              routeInfo.className = "alert alert-success mb-3";
              routeInfo.innerHTML = `
                <strong>✓ Ruta calculada:</strong><br/>
                <i class="bi bi-geo-alt"></i> Distancia: <strong>${route.distance.text}</strong><br/>
                <i class="bi bi-clock"></i> Tiempo estimado: <strong>${route.duration.text}</strong><br/>
                <small class="text-muted">Desde tu ubicación hasta el Parque Central de Alajuela</small>
              `;
            }

            console.log(`Distancia: ${route.distance.text}`);
            console.log(`Duración: ${route.duration.text}`);
            console.log(`Dirección inicial: ${route.start_address}`);
            console.log(`Dirección final: ${route.end_address}`);
          } else {
            console.error("Error al trazar la ruta:", status);
            if (routeInfo) {
              routeInfo.className = "alert alert-danger mb-3";
              routeInfo.innerHTML = `<strong>Error:</strong> No se pudo calcular la ruta. Estado: ${status}`;
            }
          }
        }
      );
    },
    (error) => {
      console.error("Error de geolocalización:", error);
      let errorMsg = "Error desconocido";

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMsg =
            "Permiso denegado. Por favor, permite el acceso a tu ubicación.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMsg = "Ubicación no disponible.";
          break;
        case error.TIMEOUT:
          errorMsg = "Tiempo de espera agotado.";
          break;
      }

      if (routeInfo) {
        routeInfo.className = "alert alert-danger mb-3";
        routeInfo.innerHTML = `<strong>Error de Geolocalización:</strong> ${errorMsg}`;
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );

  console.log("Mapa de ruta inicializado");
}

// Mapa demo del botón "Verificar Geolocation"
function initGeolocationDemoMap() {
  const el = document.getElementById("map-geolocation-demo");
  if (!el) return;
  const map = new google.maps.Map(el, {
    center: { lat: 9.7489, lng: -83.7534 },
    zoom: 7,
  });
  // Guardar referencia opcional
  el.__gm = map;
}

// Mapa de posición actual (map-current-position)
function initCurrentPositionMap() {
  const el = document.getElementById("map-current-position");
  if (!el) return;
  const fallbackCenter = { lat: 9.7489, lng: -83.7534 };
  const baseMap = new google.maps.Map(el, {
    center: fallbackCenter,
    zoom: 6,
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
        title: "Tu posición actual",
      });
    },
    (err) => console.warn("Geolocation error map-current-position:", err)
  );
}

// Múltiples contenedores con id "map-geolocation" (IDs duplicados)
function initAllRepeatedGeolocationMaps() {
  const els = document.querySelectorAll("#map-geolocation");
  if (!els.length) return;
  els.forEach((el, i) => {
    const map = new google.maps.Map(el, {
      center: { lat: 9.9, lng: -84.1 },
      zoom: 7,
      mapTypeId: "roadmap",
    });
    // Marcador simple diferenciando índice
    new google.maps.Marker({
      position: { lat: 9.9, lng: -84.1 },
      map,
      label: String(i + 1),
      title: "Ejemplo Geolocation (placeholder)",
    });
  });
}

// Mapa para ejemplo "Obtener Posición" (map-get-position)
function initGetPositionMap() {
  const el = document.getElementById("map-get-position");
  if (!el) return;
  const map = new google.maps.Map(el, {
    center: { lat: 9.7489, lng: -83.7534 },
    zoom: 6,
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
          title: "Posición obtenida",
        });
      },
      (err) => console.warn("Error get-position:", err)
    );
  }
}

// Mapa para manejo de errores (solo base visual)
function initErrorHandlingMap() {
  const el = document.getElementById("map-error-handling");
  if (!el) return;
  const map = new google.maps.Map(el, {
    center: { lat: 9.7489, lng: -83.7534 },
    zoom: 6,
  });
  el.__gm = map;
}

// Ruta desde ubicación actual a UTN (map)
function initRouteMap() {
  const mapDiv = document.getElementById("map");
  const routeInfo = document.getElementById("route-info");

  if (!mapDiv) return;

  // Crear mapa centrado en el Parque Central
  const map = new google.maps.Map(mapDiv, {
    center: DEST_PARQUE_CENTRAL,
    zoom: 13,
    mapTypeControl: true,
    streetViewControl: false,
  });

  // Marcador del destino (Parque Central)
  new google.maps.Marker({
    position: DEST_PARQUE_CENTRAL,
    map: map,
    title: "Parque Central de Alajuela",
    icon: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
    animation: google.maps.Animation.DROP,
  });

  // Verificar si geolocation está disponible
  if (!navigator.geolocation) {
    if (routeInfo) {
      routeInfo.className = "alert alert-danger mb-3";
      routeInfo.innerHTML =
        "<strong>Error:</strong> Tu navegador no soporta geolocalización.";
    }
    return;
  }

  // Obtener ubicación del usuario
  if (routeInfo) {
    routeInfo.className = "alert alert-warning mb-3";
    routeInfo.innerHTML =
      "<strong>Obteniendo:</strong> Solicitando tu ubicación...";
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      // Marcador de ubicación del usuario
      new google.maps.Marker({
        position: userLocation,
        map: map,
        title: "Tu ubicación actual",
        icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        animation: google.maps.Animation.DROP,
      });

      // Configurar DirectionsService y Renderer
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: "#4285F4",
          strokeWeight: 5,
          strokeOpacity: 0.8,
        },
      });

      if (routeInfo) {
        routeInfo.className = "alert alert-info mb-3";
        routeInfo.innerHTML =
          "<strong>Calculando:</strong> Trazando la mejor ruta...";
      }

      // Solicitar la ruta
      directionsService.route(
        {
          origin: userLocation,
          destination: DEST_PARQUE_CENTRAL,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(response);

            // Obtener información de la ruta
            const route = response.routes[0].legs[0];

            if (routeInfo) {
              routeInfo.className = "alert alert-success mb-3";
              routeInfo.innerHTML = `
                <strong>✓ Ruta calculada:</strong><br/>
                <i class="bi bi-geo-alt"></i> Distancia: <strong>${route.distance.text}</strong><br/>
                <i class="bi bi-clock"></i> Tiempo estimado: <strong>${route.duration.text}</strong><br/>
                <small class="text-muted">Desde tu ubicación hasta el Parque Central de Alajuela</small>
              `;
            }

            console.log(`Distancia: ${route.distance.text}`);
            console.log(`Duración: ${route.duration.text}`);
            console.log(`Dirección inicial: ${route.start_address}`);
            console.log(`Dirección final: ${route.end_address}`);
          } else {
            console.error("Error al trazar la ruta:", status);
            if (routeInfo) {
              routeInfo.className = "alert alert-danger mb-3";
              routeInfo.innerHTML = `<strong>Error:</strong> No se pudo calcular la ruta. Estado: ${status}`;
            }
          }
        }
      );
    },
    (error) => {
      console.error("Error de geolocalización:", error);
      let errorMsg = "Error desconocido";

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMsg =
            "Permiso denegado. Por favor, permite el acceso a tu ubicación.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMsg = "Ubicación no disponible.";
          break;
        case error.TIMEOUT:
          errorMsg = "Tiempo de espera agotado.";
          break;
      }

      if (routeInfo) {
        routeInfo.className = "alert alert-danger mb-3";
        routeInfo.innerHTML = `<strong>Error de Geolocalización:</strong> ${errorMsg}`;
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );

  console.log("Mapa de ruta inicializado");
}

// Función para verificar si Geolocation está disponible
function checkGeolocation() {
  const resultDiv = document.getElementById("geolocation-check-result");
  const mapDiv = document.getElementById("map-geolocation-demo");

  // Ejecutar el código de verificación
  if (navigator.geolocation) {
    console.log("Geolocation está disponible");

    // Mostrar resultado en la página
    resultDiv.className = "alert alert-success";
    resultDiv.innerHTML =
      '<strong>✓ Resultado:</strong> Geolocation está disponible<br><small class="text-muted">console.log: "Geolocation está disponible"</small>';

    // Obtener ubicación y mostrar en el mapa
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        resultDiv.innerHTML += `<br><strong>Ubicación obtenida:</strong> Lat: ${lat.toFixed(
          4
        )}, Lng: ${lng.toFixed(4)}`;

        // Crear el mapa
        const map = new google.maps.Map(mapDiv, {
          center: { lat: lat, lng: lng },
          zoom: 15,
        });

        // Agregar marcador
        new google.maps.Marker({
          position: { lat: lat, lng: lng },
          map: map,
          title: "Tu ubicación",
          animation: google.maps.Animation.DROP,
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          },
        });

        // Agregar círculo de precisión
        new google.maps.Circle({
          strokeColor: "#4285F4",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#4285F4",
          fillOpacity: 0.2,
          map: map,
          center: { lat: lat, lng: lng },
          radius: position.coords.accuracy,
        });
      },
      function (error) {
        resultDiv.innerHTML += `<br><strong>⚠ Error:</strong> ${error.message}`;

        // Mostrar mapa por defecto
        const map = new google.maps.Map(mapDiv, {
          center: { lat: 9.7489, lng: -83.7534 },
          zoom: 8,
        });
      }
    );
  } else {
    console.log("Geolocation no está disponible");

    // Mostrar resultado en la página
    resultDiv.className = "alert alert-danger";
    resultDiv.innerHTML =
      '<strong>✗ Resultado:</strong> Geolocation NO está disponible en este navegador<br><small class="text-muted">console.log: "Geolocation no está disponible"</small>';

    // Mostrar mensaje en el mapa
    mapDiv.innerHTML =
      '<div class="d-flex align-items-center justify-content-center h-100"><p class="text-danger fw-bold">Geolocation no está disponible</p></div>';
  }
}

// Utilidad para actualizar el alert
function setGeoAlert(type, html) {
  const el = document.getElementById("geo-error-result");
  if (!el) return;
  el.className = "alert"; // reset
  const map = {
    info: "alert alert-info",
    success: "alert alert-success",
    warning: "alert alert-warning",
    danger: "alert alert-danger",
  };
  el.className = map[type] || "alert alert-info";
  el.innerHTML = html;
}

// Limpia resultado
function geoClearResult() {
  setGeoAlert("info", "Haz clic en un botón para ver el resultado aquí.");
}

// Éxito: muestra coordenadas
function handleGeoSuccess(position) {
  const { latitude, longitude, accuracy } = position.coords;
  console.log(
    `Latitud: ${latitude}, Longitud: ${longitude}, Precisión: ${accuracy}m`
  );
  setGeoAlert(
    "success",
    `<strong>OK:</strong> Latitud: ${latitude.toFixed(
      6
    )}, Longitud: ${longitude.toFixed(6)} (±${Math.round(accuracy)} m)`
  );
}

// Error: mapea los códigos a mensajes
function handleGeoError(error) {
  // Códigos: 1=PERMISSION_DENIED, 2=POSITION_UNAVAILABLE, 3=TIMEOUT
  console.error("Error al obtener la posición:", error);
  switch (error.code) {
    case 1:
      setGeoAlert(
        "danger",
        "<strong>PERMISSION_DENIED:</strong> El usuario denegó la solicitud de geolocalización."
      );
      break;
    case 2:
      setGeoAlert(
        "warning",
        "<strong>POSITION_UNAVAILABLE:</strong> La información de ubicación no está disponible."
      );
      break;
    case 3:
      setGeoAlert(
        "warning",
        "<strong>TIMEOUT:</strong> La solicitud de ubicación ha caducado."
      );
      break;
    default:
      setGeoAlert(
        "danger",
        `<strong>Error desconocido:</strong> ${error.message || ""}`
      );
  }
}

// Botón: pedir ubicación (si niegas el permiso, verás PERMISSION_DENIED)
function geoRequestPermissionDenied() {
  if (!("geolocation" in navigator)) {
    setGeoAlert("danger", "Geolocation no está disponible en este navegador.");
    return;
  }
  navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError);
}

// Botón: forzar TIMEOUT usando un timeout extremadamente bajo
function geoForceTimeout() {
  if (!("geolocation" in navigator)) {
    setGeoAlert("danger", "Geolocation no está disponible en este navegador.");
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
  handleGeoError({
    code: 2,
    message: "Simulado: la información de ubicación no está disponible.",
  });
}

// ====== Cálculo de distancia entre dos puntos ======
let distanceMap;
let distanceMarkers = { A: null, B: null };
let distanceLine = null;
let distanceInfoWindow = null;

function initDistanceMap() {
  const container = document.getElementById("map-distance-calc");
  if (!container || typeof google === "undefined" || !google.maps) return;

  // Evitar re-inicialización
  if (distanceMap) {
    google.maps.event.trigger(distanceMap, "resize");
    fitDistanceBounds();
    return;
  }

  const defaultCenter = { lat: 9.7489, lng: -83.7534 }; // Costa Rica
  distanceMap = new google.maps.Map(container, {
    center: defaultCenter,
    zoom: 7,
    mapTypeControl: true,
    streetViewControl: false,
  });

  distanceInfoWindow = new google.maps.InfoWindow();

  // Click en el mapa para colocar/mover puntos
  distanceMap.addListener("click", (e) => {
    if (!distanceMarkers.A) {
      distanceMarkers.A = createDraggableMarker(e.latLng, "A");
    } else if (!distanceMarkers.B) {
      distanceMarkers.B = createDraggableMarker(e.latLng, "B");
    } else {
      // Si ya hay dos puntos, mueve el punto B
      distanceMarkers.B.setPosition(e.latLng);
    }
    computeAndShowDistance();
  });

  // Autocomplete para inputs
  wireDistanceAutocomplete("placeA", "A");
  wireDistanceAutocomplete("placeB", "B");

  console.log("Mapa de distancias inicializado");
}

function createDraggableMarker(position, label) {
  const marker = new google.maps.Marker({
    position,
    map: distanceMap,
    draggable: true,
    label: {
      text: label,
      color: "white",
      fontWeight: "bold",
    },
    animation: google.maps.Animation.DROP,
  });
  marker.addListener("dragend", computeAndShowDistance);
  return marker;
}

function wireDistanceAutocomplete(inputId, which) {
  const input = document.getElementById(inputId);
  if (!input || !distanceMap) return;

  const ac = new google.maps.places.Autocomplete(input, {
    fields: ["geometry", "name", "formatted_address"],
  });
  ac.bindTo("bounds", distanceMap);

  ac.addListener("place_changed", () => {
    const place = ac.getPlace();
    if (!place.geometry || !place.geometry.location) {
      console.warn("No se encontró la ubicación para:", input.value);
      return;
    }

    if (!distanceMarkers[which]) {
      distanceMarkers[which] = createDraggableMarker(
        place.geometry.location,
        which
      );
    } else {
      distanceMarkers[which].setPosition(place.geometry.location);
    }
    distanceMarkers[which].setTitle(
      place.formatted_address || place.name || which
    );

    distanceMap.panTo(place.geometry.location);
    computeAndShowDistance();
  });
}

function computeAndShowDistance() {
  const a = distanceMarkers.A?.getPosition();
  const b = distanceMarkers.B?.getPosition();
  const out = document.getElementById("distance-result");

  if (!a || !b) {
    if (distanceLine) {
      distanceLine.setMap(null);
      distanceLine = null;
    }
    if (distanceInfoWindow) distanceInfoWindow.close();
    if (out) {
      out.className = "alert alert-info py-2 mb-3";
      out.textContent =
        "Selecciona ambos puntos A y B para calcular la distancia.";
    }
    return;
  }

  // Línea entre A y B
  if (!distanceLine) {
    distanceLine = new google.maps.Polyline({
      path: [a, b],
      strokeColor: "#0d6efd",
      strokeOpacity: 0.9,
      strokeWeight: 4,
      map: distanceMap,
    });
  } else {
    distanceLine.setPath([a, b]);
    distanceLine.setMap(distanceMap);
  }

  // Cálculo de distancia con geometry.spherical
  const point1 = new google.maps.LatLng(a.lat(), a.lng());
  const point2 = new google.maps.LatLng(b.lat(), b.lng());
  const meters = google.maps.geometry.spherical.computeDistanceBetween(
    point1,
    point2
  );
  const km = (meters / 1000).toFixed(3);

  // Mostrar en el alert
  if (out) {
    out.className = "alert alert-success py-2 mb-3";
    out.innerHTML = `<strong>✓ Distancia calculada:</strong> ${meters.toFixed(
      0
    )} metros (${km} km)`;
  }

  // InfoWindow en el punto medio de la línea
  const mid = new google.maps.LatLng(
    (a.lat() + b.lat()) / 2,
    (a.lng() + b.lng()) / 2
  );
  distanceInfoWindow.setContent(
    `<div style="padding:8px; min-width:160px; text-align:center;">
       <strong style="color:#0d6efd;">Distancia</strong><br/>
       <span style="font-size:1.1em;">${meters.toFixed(0)} m</span><br/>
       <span style="color:#666;">(${km} km)</span>
     </div>`
  );
  distanceInfoWindow.setPosition(mid);
  distanceInfoWindow.open(distanceMap);

  console.log(`Distancia: ${meters} metros (${km} km)`);
}

function fitDistanceBounds() {
  const a = distanceMarkers.A?.getPosition();
  const b = distanceMarkers.B?.getPosition();
  if (!distanceMap) return;

  if (a && b) {
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(a);
    bounds.extend(b);
    distanceMap.fitBounds(bounds);
  } else if (a || b) {
    distanceMap.setCenter(a || b);
    distanceMap.setZoom(15);
  } else {
    distanceMap.setZoom(7);
    distanceMap.setCenter({ lat: 9.7489, lng: -83.7534 });
  }
}

function clearDistancePoints() {
  if (distanceMarkers.A) {
    distanceMarkers.A.setMap(null);
    distanceMarkers.A = null;
  }
  if (distanceMarkers.B) {
    distanceMarkers.B.setMap(null);
    distanceMarkers.B = null;
  }

  if (distanceLine) {
    distanceLine.setMap(null);
    distanceLine = null;
  }
  if (distanceInfoWindow) distanceInfoWindow.close();

  const out = document.getElementById("distance-result");
  if (out) {
    out.className = "alert alert-info py-2 mb-3";
    out.textContent =
      "Indica dos puntos haciendo clic en el mapa o usando las cajas de búsqueda.";
  }

  const inpA = document.getElementById("placeA");
  const inpB = document.getElementById("placeB");
  if (inpA) inpA.value = "";
  if (inpB) inpB.value = "";

  fitDistanceBounds();
}

// Modificar initMap para inicializar cuando se abre el acordeón
function initMap() {
  // Inicializar el mapa de distancia cuando se muestra la sección
  const collapse = document.getElementById("collapseFour");
  if (collapse) {
    collapse.addEventListener("shown.bs.collapse", () => {
      if (!distanceMap) initDistanceMap();
      google.maps.event.trigger(distanceMap, "resize");
    });
    // Si ya está visible por cualquier motivo
    if (collapse.classList.contains("show")) {
      initDistanceMap();
    }
  } else {
    // Fallback si no existe el colapso o el contenedor ya es visible
    if (document.getElementById("map-distance-calc")) initDistanceMap();
  }

  // Inicializar mapa de ruta cuando se expande su acordeón
  const routeCollapse = document.getElementById("collapseFive");
  if (routeCollapse) {
    routeCollapse.addEventListener("shown.bs.collapse", () => {
      initRouteMap();
    });
    // Si ya está abierto
    if (routeCollapse.classList.contains("show")) {
      initRouteMap();
    }
  }

  // Inicializar otros mapas
  const distanceCollapse = document.getElementById("mapsCollapseFour");
  if (distanceCollapse) {
    distanceCollapse.addEventListener("shown.bs.collapse", () => {
      initDistanceMap();
    });
  }

  console.log("Todos los mapas configurados");
}

// Inicializa cuando la página cargue
$(document).ready(function () {
  console.log("Página lista. Mapas se inicializan con callback initMap.");
});
