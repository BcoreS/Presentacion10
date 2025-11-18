// ==================== GOOGLE MAPS ====================
// Variables globales
let mapRuta;
let directionsService;
let directionsRenderer;
let autocompleteA;
let autocompleteB;
let userCurrentLocation = null; // Guardar ubicación del usuario

function initMap() {
  // Crear un mapa centrado en una ubicación predeterminada
  const defaultLocation = { lat: 9.9281, lng: -84.0907 }; // San José, Costa Rica
  const map = new google.maps.Map(document.getElementById("map-ubicacion"), {
    zoom: 15,
    center: defaultLocation,
  });

  // Obtener la ubicación del usuario
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        // Guardar la ubicación del usuario globalmente
        userCurrentLocation = userLocation;

        map.setCenter(userLocation);

        const marker = new google.maps.Marker({
          position: userLocation,
          map: map,
          title: "Tu ubicación",
          animation: google.maps.Animation.DROP
        });

        // Establecer ubicación del usuario como punto A por defecto
        establecerUbicacionUsuarioComoPuntoA(userLocation);
      },
      (error) => {
        handleLocationError(error, map);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  } else {
    handleBrowserNotSupported(map);
  }

  // Inicializar el mapa de rutas
  initMapRuta();
}

// Establecer la ubicación del usuario como Punto A
function establecerUbicacionUsuarioComoPuntoA(location) {
  const geocoder = new google.maps.Geocoder();
  
  geocoder.geocode({ location: location }, (results, status) => {
    if (status === 'OK' && results[0]) {
      const inputA = document.getElementById('puntoA');
      if (inputA) {
        inputA.value = results[0].formatted_address;
        inputA.setAttribute('data-lat', location.lat);
        inputA.setAttribute('data-lng', location.lng);
      }
    }
  });
}

// Inicializar mapa de rutas
function initMapRuta() {
  const defaultLocation = { lat: 9.9281, lng: -84.0907 }; // San José, Costa Rica

  mapRuta = new google.maps.Map(document.getElementById("map-ruta"), {
    zoom: 13,
    center: defaultLocation,
  });

  // Inicializar servicios de direcciones
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({
    map: mapRuta,
    draggable: true,
    panel: null
  });

  // Configurar autocompletado para los campos de entrada
  const inputA = document.getElementById('puntoA');
  const inputB = document.getElementById('puntoB');

  if (inputA && inputB) {
    // Establecer UTN Sede Central como punto B por defecto
    inputB.value = 'UTN Sede Central, 2Q4M+RCG, 124, Provincia de Alajuela, Alajuela, Acequia Grande';
    
    autocompleteA = new google.maps.places.Autocomplete(inputA);
    autocompleteB = new google.maps.places.Autocomplete(inputB);

    autocompleteA.bindTo('bounds', mapRuta);
    autocompleteB.bindTo('bounds', mapRuta);

    // Agregar listener para actualizar coordenadas cuando se seleccione del autocomplete
    autocompleteA.addListener('place_changed', () => {
      const place = autocompleteA.getPlace();
      if (place.geometry) {
        inputA.setAttribute('data-lat', place.geometry.location.lat());
        inputA.setAttribute('data-lng', place.geometry.location.lng());
      }
    });
  }

  // Listener para cuando se cambie la ruta arrastrando
  directionsRenderer.addListener('directions_changed', () => {
    const directions = directionsRenderer.getDirections();
    if (directions) {
      mostrarResultadosRuta(directions);
    }
  });
}

// Función para generar la ruta
function generarRuta() {
  const puntoAInput = document.getElementById('puntoA');
  const puntoB = document.getElementById('puntoB').value.trim();
  const resultDiv = document.getElementById('resultadp');

  let puntoA = puntoAInput.value.trim();

  // Si no hay punto A, usar la ubicación actual del usuario
  if (!puntoA && userCurrentLocation) {
    puntoA = new google.maps.LatLng(userCurrentLocation.lat, userCurrentLocation.lng);
  }

  // Validar que ambos puntos tengan valor
  if (!puntoA || !puntoB) {
    resultDiv.className = 'alert alert-warning';
    resultDiv.innerHTML = `
      <i class="bi bi-exclamation-triangle"></i> 
      <strong>Atención:</strong> Por favor, ingresa el destino (Punto B) para calcular la ruta.
    `;
    return;
  }

  // Mostrar mensaje de carga
  resultDiv.className = 'alert alert-info';
  resultDiv.innerHTML = `
    <div class="spinner-border spinner-border-sm me-2" role="status">
      <span class="visually-hidden">Cargando...</span>
    </div>
    Calculando ruta desde tu ubicación...
  `;

  // Usar coordenadas si están disponibles, sino usar el texto
  const lat = puntoAInput.getAttribute('data-lat');
  const lng = puntoAInput.getAttribute('data-lng');
  const origin = (lat && lng) ? new google.maps.LatLng(parseFloat(lat), parseFloat(lng)) : puntoA;

  // Configurar la solicitud de direcciones
  const request = {
    origin: origin,
    destination: puntoB,
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.METRIC,
  };

  // Realizar la solicitud
  directionsService.route(request, (result, status) => {
    if (status === 'OK') {
      directionsRenderer.setDirections(result);
      mostrarResultadosRuta(result);
    } else {
      manejarErrorRuta(status, resultDiv);
    }
  });
}

// Mostrar los resultados de la ruta
function mostrarResultadosRuta(result) {
  const resultDiv = document.getElementById('resultadp');
  const route = result.routes[0];
  const leg = route.legs[0];

  // Calcular tiempo estimado
  const duracionMinutos = Math.round(leg.duration.value / 60);
  const horas = Math.floor(duracionMinutos / 60);
  const minutos = duracionMinutos % 60;
  const tiempoFormateado = horas > 0
    ? `${horas}h ${minutos}min`
    : `${minutos} minutos`;

  resultDiv.className = 'alert alert-success';
  resultDiv.innerHTML = `
        <h5 class="alert-heading">
            <i class="bi bi-check-circle"></i> Ruta Calculada
        </h5>
        <hr>
        <div class="row">
            <div class="col-md-6">
                <p><strong>Origen:</strong><br>${leg.start_address}</p>
            </div>
            <div class="col-md-6">
                <p><strong>Destino:</strong><br>${leg.end_address}</p>
            </div>
        </div>
        <hr>
        <div class="row text-center">
            <div class="col-md-6">
                <h4 class="text-primary">${leg.distance.text}</h4>
                <small class="text-muted">Distancia Total</small>
            </div>
            <div class="col-md-6">
                <h4 class="text-primary">${tiempoFormateado}</h4>
                <small class="text-muted">Tiempo Estimado</small>
            </div>            
        </div>
        <hr>
        <small class="text-muted">
            <i class="bi bi-info-circle"></i> 
            Puedes arrastrar la ruta en el mapa para ajustarla
        </small>
    `;
}

// Manejar errores al calcular la ruta
function manejarErrorRuta(status, resultDiv) {
  let errorMessage = '';

  switch (status) {
    case 'NOT_FOUND':
      errorMessage = 'No se pudo encontrar una o ambas ubicaciones. Verifica las direcciones ingresadas.';
      break;
    case 'ZERO_RESULTS':
      errorMessage = 'No se encontró ninguna ruta entre estos puntos.';
      break;
    case 'INVALID_REQUEST':
      errorMessage = 'La solicitud de ruta es inválida.';
      break;
    case 'OVER_QUERY_LIMIT':
      errorMessage = 'Se ha excedido el límite de consultas a la API.';
      break;
    case 'REQUEST_DENIED':
      errorMessage = 'La solicitud fue denegada.';
      break;
    case 'UNKNOWN_ERROR':
      errorMessage = 'Error desconocido del servidor. Intenta nuevamente.';
      break;
    default:
      errorMessage = `Error al calcular la ruta: ${status}`;
  }

  resultDiv.className = 'alert alert-danger';
  resultDiv.innerHTML = `
        <h5 class="alert-heading">
            <i class="bi bi-exclamation-triangle"></i> Error al Calcular Ruta
        </h5>
        <p>${errorMessage}</p>
        <small>Código de error: ${status}</small>
    `;
}

// Función para limpiar los campos y el mapa
function limpiarPuntosRuta() {
  document.getElementById('puntoA').value = '';
  document.getElementById('puntoB').value = '';

  const resultDiv = document.getElementById('resultadp');
  resultDiv.className = 'alert alert-info';
  resultDiv.innerHTML = 'Selecciona dos puntos en el mapa o ingresa las direcciones';

  // Limpiar la ruta del mapa
  if (directionsRenderer) {
    directionsRenderer.setDirections({ routes: [] });
  }
}

// ==================== GOOGLE TRANSLATE ====================

// Función para traducir texto usando Google Translate API
async function traducirTexto() {
  const textoOriginal = document.getElementById('textoOriginal').value.trim();
  const textoTraducido = document.getElementById('textoTraducido');
  
  if (!textoOriginal) {
    textoTraducido.value = 'Por favor, ingresa un texto para traducir.';
    return;
  }

  // Mostrar mensaje de carga
  textoTraducido.value = 'Traduciendo...';

  try {
    // API Key de Google Translate
    const url = `https://translation.googleapis.com/language/translate/v2?key=AIzaSyD3OjxkORJpZjaMuBZNbnT0TPGGM0sHpDA`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: textoOriginal,
        source: 'es',
        target: 'en',
        format: 'text'
      })
    });

    if (!response.ok) {
      throw new Error('Error en la solicitud de traducción');
    }

    const data = await response.json();
    
    if (data.data && data.data.translations && data.data.translations.length > 0) {
      textoTraducido.value = data.data.translations[0].translatedText;
    } else {
      textoTraducido.value = 'No se pudo obtener la traducción.';
    }

  } catch (error) {
    console.error('Error al traducir:', error);
    textoTraducido.value = 'Error al traducir. Verifica tu conexión a internet y la API key.';
  }
}

// ==================== GOOGLE CHARTS ====================

// Cargar la librería de Google Charts
google.charts.load('current', {
  'packages': ['corechart', 'geochart'],
  'mapsApiKey': 'AIzaSyD3OjxkORJpZjaMuBZNbnT0TPGGM0sHpDA'
});

// Configurar callback para dibujar los gráficos cuando se cargue la librería
google.charts.setOnLoadCallback(initCharts);

function initCharts() {
  // Los gráficos se dibujarán cuando el usuario abra cada acordeón
  setupChartListeners();
}

// Configurar listeners para los acordeones de charts
function setupChartListeners() {
  // Gráfico de Pastel
  document.getElementById('chartsUno')?.addEventListener('shown.bs.collapse', function () {
    dibujarGraficoPastel();
  });

  // Gráfico de Columnas
  document.getElementById('chartsDos')?.addEventListener('shown.bs.collapse', function () {
    dibujarGraficoColumnas();
  });

  // Gráfico de Líneas
  document.getElementById('chartsTres')?.addEventListener('shown.bs.collapse', function () {
    dibujarGraficoLineas();
  });

  // Gráfico de Área
  document.getElementById('chartsCuatro')?.addEventListener('shown.bs.collapse', function () {
    dibujarGraficoArea();
  });

  // Gráfico Geográfico
  document.getElementById('chartsCinco')?.addEventListener('shown.bs.collapse', function () {
    dibujarGraficoGeografico();
  });
}

// 1. Gráfico de Pastel - Distribución de tecnologías web
function dibujarGraficoPastel() {
  const data = google.visualization.arrayToDataTable([
    ['Tecnología', 'Porcentaje de Uso'],
    ['JavaScript', 35],
    ['Python', 25],
    ['Java', 15],
    ['C#', 10],
    ['PHP', 8],
    ['Otros', 7]
  ]);

  const options = {
    title: 'Tecnologías Web Más Populares 2024',
    pieHole: 0.4,
    colors: ['#4285F4', '#34A853', '#FBBC04', '#EA4335', '#9C27B0', '#607D8B'],
    chartArea: { width: '90%', height: '80%' },
    legend: { position: 'bottom' },
    animation: {
      startup: true,
      duration: 1000,
      easing: 'out'
    }
  };

  const chart = new google.visualization.PieChart(document.getElementById('graficoPastel'));
  chart.draw(data, options);
}

// 2. Gráfico de Columnas - Ventas mensuales
function dibujarGraficoColumnas() {
  const data = google.visualization.arrayToDataTable([
    ['Mes', 'Producto A', 'Producto B', 'Producto C'],
    ['Enero', 1000, 800, 600],
    ['Febrero', 1170, 900, 750],
    ['Marzo', 660, 1120, 890],
    ['Abril', 1030, 950, 720],
    ['Mayo', 1200, 1050, 980],
    ['Junio', 1350, 1180, 1100]
  ]);

  const options = {
    title: 'Comparación de Ventas Mensuales por Producto',
    chartArea: { width: '80%', height: '70%' },
    colors: ['#4285F4', '#34A853', '#FBBC04'],
    hAxis: {
      title: 'Mes',
      minValue: 0
    },
    vAxis: {
      title: 'Ventas ($)'
    },
    legend: { position: 'top' },
    animation: {
      startup: true,
      duration: 1000,
      easing: 'out'
    }
  };

  const chart = new google.visualization.ColumnChart(document.getElementById('graficoColumnas'));
  chart.draw(data, options);
}

// 3. Gráfico de Líneas - Tendencia de crecimiento
function dibujarGraficoLineas() {
  const data = google.visualization.arrayToDataTable([
    ['Año', 'Usuarios Activos', 'Nuevos Registros'],
    ['2019', 1000, 400],
    ['2020', 1500, 600],
    ['2021', 2300, 850],
    ['2022', 3200, 1100],
    ['2023', 4500, 1500],
    ['2024', 6000, 2000]
  ]);

  const options = {
    title: 'Crecimiento de Usuarios (2019-2024)',
    curveType: 'function',
    legend: { position: 'bottom' },
    colors: ['#4285F4', '#34A853'],
    chartArea: { width: '85%', height: '70%' },
    hAxis: {
      title: 'Año'
    },
    vAxis: {
      title: 'Cantidad de Usuarios'
    },
    animation: {
      startup: true,
      duration: 1000,
      easing: 'out'
    }
  };

  const chart = new google.visualization.LineChart(document.getElementById('graficoLineas'));
  chart.draw(data, options);
}

// 4. Gráfico de Área - Evolución del tráfico web
function dibujarGraficoArea() {
  const data = google.visualization.arrayToDataTable([
    ['Hora', 'Visitas Desktop', 'Visitas Móvil', 'Visitas Tablet'],
    ['00:00', 200, 150, 50],
    ['04:00', 100, 80, 30],
    ['08:00', 500, 400, 150],
    ['12:00', 1200, 1000, 400],
    ['16:00', 1500, 1300, 500],
    ['20:00', 900, 800, 300],
    ['23:00', 400, 350, 120]
  ]);

  const options = {
    title: 'Distribución de Tráfico Web por Dispositivo',
    isStacked: true,
    chartArea: { width: '85%', height: '70%' },
    colors: ['#4285F4', '#34A853', '#FBBC04'],
    hAxis: {
      title: 'Hora del Día'
    },
    vAxis: {
      title: 'Número de Visitas'
    },
    legend: { position: 'top' },
    animation: {
      startup: true,
      duration: 1000,
      easing: 'out'
    }
  };

  const chart = new google.visualization.AreaChart(document.getElementById('graficoArea'));
  chart.draw(data, options);
}

// 5. Gráfico Geográfico - Distribución de usuarios por país
function dibujarGraficoGeografico() {
  const data = google.visualization.arrayToDataTable([
    ['País', 'Usuarios'],
    ['United States', 5000],
    ['Brazil', 3500],
    ['Mexico', 3000],
    ['Germany', 2800],
    ['United Kingdom', 2500],
    ['France', 2200],
    ['Spain', 2000],
    ['Italy', 1800],
    ['Canada', 1500],
    ['Argentina', 1200],
    ['Colombia', 1100],
    ['Chile', 900],
    ['Peru', 800],
    ['Costa Rica', 600]
  ]);

  const options = {
    title: 'Distribución Global de Usuarios',
    colorAxis: { colors: ['#e3f2fd', '#2196F3', '#0d47a1'] },
    backgroundColor: '#f5f5f5',
    datalessRegionColor: '#e0e0e0',
    defaultColor: '#f5f5f5',
    legend: 'none',
    tooltip: { isHtml: true }
  };

  const chart = new google.visualization.GeoChart(document.getElementById('graficoGeografico'));
  chart.draw(data, options);
}
