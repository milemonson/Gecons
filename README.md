# Instrucciones para correr y desarrollar en esta rama

Para poder correr y colaborar en este proyecto, vas a necesitar [Node](https://nodejs.org/es/) si no lo tenés todavía. Yo tengo instalada la versión 12.17.0, 
pero calculo que con la última versión estable (la 14.15.0) no debería haber problemas.

## Moverse entre ramas:

Con hacer un pull del repo remoto debería de traerte la rama nueva con todos los cambios que tiene avisame cualquier cosa.

`git pull`

si todo sale bien, al hacer `git branch --list` te debería salir algo como lo siguiente:

```
  dev
* master

```

El asterisco te va a marcar en qué rama estás parada, que si ya estabas trabajando en `master` es ahí en donde deberías estar.
Para cambiar de rama es con `git checkout dev`.

Igual, al hacer `git status` o abajo en la izquierda en VS Code te debería aparecer la rama en la que estás.

## Instalando dependencias y cambiando variables de entorno

Como me contaste que ya conocías el **package.json** asumo que ya conocés las dependencias, pero si no, te digo que para
instalarlas basta con `npm install` en el mismo directorio en el que está el JSON, esto te va a crear una carpeta **node_modules** 
en donde te va a bajar todos los paquetes de las librerías que estemos usando. Esta carpeta está ignorada adentro de **.gitignore** y
mejor que se quede así porque tiene mucho texto....

Otro archivito muy interesante es **.envexample**, está nombrado así para que lo copies, y a la copia le cambies el nombre a **.env**.
Ahí adentro hay lo que se llaman **variables de entorno**, que son variables que cambian dependiendo del entorno en el que corras la aplicación,
por ejemplo en tu compu o directamente en el servicio de hosting (recontra cheto). Ahí adentro hay una sola variable por ahora que es **APP_PORT**.

Esta variable indica el puerto en el que corre el servidor, yo generalmente le pongo **3000**, te recomiendo ese número de puerto salvo que lo estés 
usando para otra cosa.

## Ejecutar el servidor

Ya adentro del package.json están los scripts que se pueden usar para correr el servidor, por ahora sólo hay uno que es **start** (no le des pelota al de
testing..). Por lo que para ejecutarlo tenés que usar el comando `npm run start`.

Si todo sale bien, te debería salir un mensaje del tipo `Escuchando en el puerto 3000` (o en el puerto que hayas elegido, asumo que va a ser el 3000),
de ahí ya podés ir a tu navegador y poner `localhost:3000/` y te debería cargar la página. Es más, si tenés tu celu conectado a la misma red que la compu
en la que estás corriendo el servidor, también podés entrar desde ahí poniendo **IP:3000** (la IP es la de tu máquina).

**Para cortar el servidor** basta conque vayas a la consola en la que lo pusiste a ejecutar y apretar `ctrl + C`.

### Script de PHP

Vas a ver que lo borré al script de PHP, no es de yeta pero vamos a tener que usar una librería llamada [nodemailer](https://nodemailer.com/about/) para poder
interactuar con el servicio **SMTP** (protocolo simple de envío de mails, ponete a pensar que es otro protocolo como el HTTP que venimos manejando) de la plataforma
en la que lo hosteemos. Teneme paciencia porque no tengo mucha experiencia con esto último :c
