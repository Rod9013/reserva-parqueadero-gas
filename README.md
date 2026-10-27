# Programador Automatico de Solicitudes de Parqueadero

Script desarrollado en Google Apps Script para automatizar el envío de correos electrónicos de solicitud de cupo en el parqueadero de la empresa de manera inteligente, evitando días no hábiles (fines de semana, festivos en Colombia) y días de teletrabajo.

---

## Para que sirve

Si en tu empresa debes solicitar un cupo de parqueadero diariamente o con cierta periodicidad mediante un correo electrónico, este script se encarga de:
1. Verificar el calendario: Comprueba si el día actual es hábil.
2. Evaluar reglas de asistencia: Calcula automáticamente el siguiente día hábil y excluye los días fijos de teletrabajo (por ejemplo, los martes).
3. Festivos de Colombia: Integra una función matemática para calcular de forma dinámica todos los días festivos oficiales de Colombia (según la Ley Emiliani y el cálculo del domingo de Pascua).
4. Envío Automatizado: Redacta y envía el correo con los datos correctos de fecha, nombre, placa y empresa directamente a través de Gmail.

---

## Estructura del Proyecto

* codigo.js: Contiene toda la lógica principal del programa, cálculo de fechas, festivos y automatización de correos.
* config.js.example: Plantilla de configuración con datos genéricos para que otros usuarios sepan qué parámetros rellenar.
* config.js: Archivo local privado (excluido en .gitignore) donde almacenas tus datos reales de forma segura.

---

## Guia de Configuracion e Instalacion

Sigue estos pasos para poner a funcionar tu propio programador en tu cuenta de Google:

### 1. Clonar el repositorio
Abre tu terminal y clona este repositorio en tu computadora:

    git clone [https://github.com/Rod9013/project_01.git](https://github.com/Rod9013/project_01.git)
    cd project_01

### 2. Configurar tus datos personales
1. Duplica o renombra el archivo config.js.example como config.js.
2. Rellenalo con tu información personal real dentro de config.js:

    var CONFIG = {
      NOMBRE_COMPLETO: "Tu Nombre Completo",
      EMPRESA: "Nombre de tu Empresa",
      PLACA_MOTO: "ABC-123",
      DESTINATARIO: "correo_lider@empresa.com"
    };

(Nota: Asegúrate de que config.js esté listado en tu archivo .gitignore para que nunca se suba a GitHub).

### 3. Subir a Google Apps Script
1. Entra a script.google.com.
2. Crea un Nuevo proyecto.
3. Copia y pega el contenido de codigo.js y crea un archivo adicional llamado config.js pegando tu configuración privada.
4. Guarda los cambios.

### 4. Automatizar con un Desencadenador (Triggers)
Para que el script se ejecute solo todos los días:
1. En Google Apps Script, haz clic en el icono de Reloj (Activadores / Triggers) en la barra lateral izquierda.
2. Haz clic en Añadir activador.
3. Selecciona la función enviarReservaParqueadero.
4. Configura el evento basado en tiempo: Elije el tipo de cabecera de tiempo -> Basado en días -> Selecciona tu hora preferida.
5. Guarda el activador y autoriza los permisos de Gmail que te solicite Google.

---

## Privacidad y Seguridad

Este repositorio utiliza un archivo .gitignore para asegurar que los datos personales sensibles (como tu nombre, placa del vehículo y correos corporativos) permanezcan seguros en tu entorno local y no se expongan públicamente en GitHub.