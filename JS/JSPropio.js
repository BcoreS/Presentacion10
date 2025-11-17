// Área de JQuery

//Sintaxis Basica
//SI NECESITA DOCUMENT READY
$(document).ready(function () {
  $(".Ejemplo1A").css("background-color", "black");
  $(".Ejemplo1A").css("color", "white");

  $(".Ejemplo1B").css("background-color", "white");
  $(".Ejemplo1B").css("color", "black");
});

// Manipulacion del DOM

//.Append()
$(document).ready(function(){
  $("#btnAppend").click(function(){
    $("#contenedor1").append("<p class='text-success'>Texto agregado al final con .append()</p>");
  });
});


//.prepend()

$(document).ready(function(){
  $("#btnPrepend").click(function(){
    $("#contenedor2").prepend("<p class='text-primary'>Texto agregado al inicio con .prepend()</p>");
  });
});

//after
$(document).ready(function(){
  $("#btnAfter").click(function(){
    $("#contenedor3").after("<p class='text-warning'>Texto agregado después con .after()</p>");
  });
});

//before

$(document).ready(function(){
  $("#btnbefore").click(function(){
    $("#contenedor4").before("<p class='text-primary'>Texto agregado antes del contenedor con .before()</p>");
  });
});

//wrap


$(document).ready(function(){
  // Aplicar wrap
  $("#btnWrap").click(function(){
    $("p").wrap("<div class='border border-primary p-2 mb-2'></div>");
  });

  // unwrap
  $("#btnUnwrap").click(function(){
    $("p").unwrap();
  });
});


// .wrapInner()
    $("#btnWrapInner").click(function () {
        $(".caja").wrapInner("<span class='EjemploInner'></span>");
    });

    // Revertir .unwrap()
    $("#btnUnwrapInner").click(function () {
        $(".EjemploInner").contents().unwrap();
    });

//.remove()
$(document).ready(function () {
    // Cuando se hace clic en el botón X, elimina solo ese párrafo
    $(".btnEliminar").click(function () {
        $(this).parent().remove(); // Elimina el elemento padre del botón (el <p>)
    });
});

//.empty
$(document).ready(function () {
    $("#btnEmpty").click(function () {
        $("#contenedor").empty(); // Elimina solo el contenido interno
    });
});

//.detach()

$(document).ready(function () {
    let elemento;

    // Evento en el botón interno
    $("#btnEvento").click(function () {
        alert("¡Evento funcionando!");
    });

    // Eliminar con .detach()
    $("#btnDetach").click(function () {
        elemento = $("#contenedor4").detach(); // Se guarda el elemento con sus eventos
    });

    // Reinsertar el elemento
    $("#btnReinsertar3").click(function () {
        $(".cuerp1").append(elemento); // Se vuelve a agregar con el evento intacto
    });
});


//html()
$(document).ready(function () {
    // Cambiar contenido HTML
    $("#btnCambiar").click(function () {
        $("#miDiv").html("<strong>Nuevo contenido en negrita</strong>");
    });

    // Obtener contenido HTML
    $("#btnObtener").click(function () {
        alert($("#miDiv").html());
    });
});


//text()
$(document).ready(function () {
    // Cambiar texto (sin HTML)
    $("#btnCambiar5").click(function () {
        $("#miDiv2").text("Nuevo texto plano");
    });

    // Obtener texto
    $("#btnObtener5").click(function () {
        alert($("#miDiv2").text());
    });
});

//.val()

$(document).ready(function () {
    // Cambiar valor del input
    $("#btnCambiar6").click(function () {
        $("#miInput3").val("Nuevo valor desde jQuery");
    });

    // Obtener valor del input
    $("#btnObtener6").click(function () {
        alert($("#miInput3").val());
    });
});


//addClass()
$(document).ready(function () {
    $("#btnAgregar7").click(function () {
        $("#miCaja").addClass("resaltado");
    });
});


//hasClass()

$(document).ready(function () {
    $("#btnVerificar1").click(function () {
        if ($("#miCaja6").hasClass("activo")) {
            alert("La caja tiene la clase 'activo'");
        } else {
            alert("La caja NO tiene la clase 'activo'");
        }
    });
});


//removeClass()

$(document).ready(function(){
            $("#btnQuitar7").click(function(){
                $("#texto").removeClass("resaltado2");
            });
        });


//.toggleClass()

$(document).ready(function () {
    $("#btnAlternar8").click(function () {
        $("#miCaja8").toggleClass("activo2");
    });
});







//Eventos
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


