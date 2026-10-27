function enviarReservaParqueadero() {
    var hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
  
    var fechaObjetivo = calcularFechaSolicitud(hoy);
    if (!fechaObjetivo) return;
  
    // Se cargan los datos de forma segura desde el archivo de configuración
    var nombreCompleto = CONFIG.NOMBRE_COMPLETO;
    var empresa = CONFIG.EMPRESA;
    var placaMoto = CONFIG.PLACA_MOTO;
    var destinatario = CONFIG.DESTINATARIO;
  
    var dias = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
    var meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
                 "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  
    var diferenciaDias = Math.round((fechaObjetivo - hoy) / 86400000);
    var textoTemporal = (diferenciaDias === 1 ? "mañana " : "el próximo ") +
                        dias[fechaObjetivo.getDay()] + " " + fechaObjetivo.getDate() +
                        " de " + meses[fechaObjetivo.getMonth()];
  
    var diaStr = ("0" + fechaObjetivo.getDate()).slice(-2);
    var mesStr = ("0" + (fechaObjetivo.getMonth() + 1)).slice(-2);
    var fechaCortaStr = diaStr + "/" + mesStr + "/" + fechaObjetivo.getFullYear();
  
    var asunto = "Solicitud de autorización de acceso al parqueadero - " + fechaCortaStr;
    var cuerpo = "Buen día. Me comunico para solicitar la autorización de acceso al parqueadero para " +
                 textoTemporal + ".\n\n" +
                 "Nombre y Apellidos: " + nombreCompleto + "\n" +
                 "Empresa a la que pertenece: " + empresa + "\n" +
                 "Placa de la moto: " + placaMoto + "\n" +
                 "Fecha para la cual requiere el cupo: " + fechaCortaStr;
  
    GmailApp.sendEmail(destinatario, asunto, cuerpo);
    Logger.log("Solicitud enviada para: " + fechaCortaStr);
  }
  
  /**
   * Devuelve la fecha para la que se debe pedir parqueo hoy, o null si no se envía nada.
   */
  function calcularFechaSolicitud(hoy) {
    if (!esDiaHabil(hoy)) {
      Logger.log("Hoy no es día hábil. No se envía solicitud.");
      return null;
    }
    var objetivo = siguienteDiaHabil(hoy);
    if (objetivo.getDay() === 2) {
      Logger.log("El próximo día hábil es martes (teletrabajo). No se envía solicitud.");
      return null;
    }
    var finContrato = new Date(2026, 11, 30); // 30/12/2026 (los meses van de 0 a 11)
    if (objetivo > finContrato) {
      Logger.log("La fecha objetivo es posterior al fin del contrato. No se envía solicitud.");
      return null;
    }
    return objetivo;
  }
  
  function esDiaHabil(fecha) {
    var d = fecha.getDay();
    return d !== 0 && d !== 6 && !esFestivoColombia(fecha);
  }
  
  function siguienteDiaHabil(fecha) {
    var f = new Date(fecha);
    do {
      f.setDate(f.getDate() + 1);
    } while (!esDiaHabil(f));
    return f;
  }
  
  /**
   * Festivos de Colombia calculados para cualquier año (Ley 51 de 1983).
   */
  function esFestivoColombia(fecha) {
    var lista = festivosColombia(fecha.getFullYear());
    return lista.indexOf(formatoISO(fecha)) !== -1;
  }
  
  function festivosColombia(año) {
    var lista = [];
    function fijo(mes, dia)   { lista.push(formatoISO(new Date(año, mes - 1, dia))); }
    function lunes(mes, dia)  { lista.push(formatoISO(moverALunes(new Date(año, mes - 1, dia)))); }
    function pascuaMas(n)     { var f = new Date(pascua); f.setDate(f.getDate() + n); lista.push(formatoISO(f)); }
  
    var pascua = domingoDePascua(año);
  
    fijo(1, 1);     // Año Nuevo
    lunes(1, 6);    // Reyes Magos
    lunes(3, 19);   // San José
    pascuaMas(-3);  // Jueves Santo
    pascuaMas(-2);  // Viernes Santo
    fijo(5, 1);     // Día del Trabajo
    pascuaMas(43);  // Ascensión (lunes)
    pascuaMas(64);  // Corpus Christi (lunes)
    pascuaMas(71);  // Sagrado Corazón (lunes)
    lunes(6, 29);   // San Pedro y San Pablo
    fijo(7, 20);    // Independencia
    fijo(8, 7);     // Batalla de Boyacá
    lunes(8, 15);   // Asunción
    lunes(10, 12);  // Día de la Raza
    lunes(11, 1);   // Todos los Santos
    lunes(11, 11);  // Independencia de Cartagena
    fijo(12, 8);    // Inmaculada Concepción
    fijo(12, 25);   // Navidad
    return lista;
  }
  
  function moverALunes(f) {
    f.setDate(f.getDate() + (8 - f.getDay()) % 7);
    return f;
  }
  
  function domingoDePascua(año) {
    var a = año % 19, b = Math.floor(año / 100), c = año % 100;
    var d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
    var g = Math.floor((b - f + 1) / 3);
    var h = (19 * a + b - d - g + 15) % 30;
    var i = Math.floor(c / 4), k = c % 4;
    var l = (32 + 2 * e + 2 * i - h - k) % 7;
    var m = Math.floor((a + 11 * h + 22 * l) / 451);
    var mes = Math.floor((h + l - 7 * m + 114) / 31);
    var dia = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(año, mes - 1, dia);
  }
  
  function formatoISO(fecha) {
    return fecha.getFullYear() + "-" +
           ("0" + (fecha.getMonth() + 1)).slice(-2) + "-" +
           ("0" + fecha.getDate()).slice(-2);
  }
  
  /**
   * Prueba sin enviar correos: muestra en el registro qué haría el script
   * cada día de los próximos 90 días.
   */
  function probarCalendario() {
    var f = new Date();
    f.setHours(0, 0, 0, 0);
    for (var n = 0; n < 90; n++) {
      var objetivo = calcularFechaSolicitud(new Date(f));
      if (objetivo) Logger.log(formatoISO(f) + " → pide para " + formatoISO(objetivo));
      f.setDate(f.getDate() + 1);
    }
  }