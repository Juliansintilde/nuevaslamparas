const Compilador = require('parcel-bundler');
const WebSocket = require('ws');
const app = require('express')();
const ngrok = require('ngrok');
const videoStream = require('./stream');
const server = require('http').createServer(app);
const entrada = 'src/index.html';
const opciones = {}; // Opciones en https://parceljs.org/api.html
const compilador = new Compilador(entrada, opciones);
const { v4: uuidv4 } = require('uuid');
const puerto = 7070;
const Gpio = require('onoff').Gpio;
const ON = 1;
const OFF = 0;

const token = '';

async function cargarNgrok() {
  try {
    const url = await ngrok.connect({
      authtoken: token,
      subdomain: 'ventana',
      addr: 7070,
    });
    console.log('Ventana abierta en: ' + url);
  } catch (err) {
    console.log(err);
  }
}

cargarNgrok();

videoStream.acceptConnections(
  app,
  {
    width: 1280,
    height: 720,
    fps: 16,
    encoding: 'JPEG',
    quality: 7, //lower is faster
  },
  '/stream.mjpg',
  false
);

(async function () {
  const url = await ngrok.connect();
})();

const lamparas = {
  lampara1: new Gpio(17, 'out'),
  // lampara2: null,
  // lampara3: null,
  // lampara4: null,
  // lampara5: null,
  // lampara6: null
};

// process.on('SIGINT', (_) => {
//   for (let lamparaI in lamparas) {
//     const lampara = lamparas[lamparaI];
//     lampara.writeSync(OFF);
//     lampara.unexport();
//   }
// });

app.use(compilador.middleware());
const ws = new WebSocket.Server({ server });
let usuariosConectados = {};

function existenOtrosUsuariosConectados() {
  return Object.keys(usuariosConectados).length > 1;
}

ws.on('connection', (usuario) => {
  // Creamos un id único en cada usuario usando la libreria uuid
  usuario.id = uuidv4();

  // agregamos este nuevo usuario a una lista global que va a contener todos los ususarios conectados actualmente.
  usuariosConectados[usuario.id] = usuario;

  usuario.send(
    JSON.stringify({
      accion: 'bienvenida',
      miId: usuario.id,
    })
  );

  // Para probar vamos a hacer que el primero en conectarse sea el que transmite su webcam.
  if (!existenOtrosUsuariosConectados()) {
    usuario.send(JSON.stringify({ accion: 'eresTransmisor' }));
    proximoEnIniciarLlamada = usuario;
  } else {
    proximoEnIniciarLlamada.send(
      JSON.stringify({
        accion: 'llamarA',
        llamarA: usuario.id,
      })
    );

    usuario.send(
      JSON.stringify({
        accion: 'eresReceptor',
        recibirLlamadaDe: proximoEnIniciarLlamada.id,
      })
    );
    // proximoEnIniciarLlamada = usuario;
  }

  // Esperamos a que lleguen mensajes de este ususario.
  usuario.on('message', (datos) => {
    datos = JSON.parse(datos);

    switch (datos.accion) {
      case 'prender':
        if (!Gpio.accessible || !lamparas.hasOwnProperty(`lampara${datos.lampara}`)) return;
        lamparas[`lampara${datos.lampara}`].writeSync(ON);
        break;

      case 'apagar':
        if (!Gpio.accessible || !lamparas.hasOwnProperty(`lampara${datos.lampara}`)) return;
        lamparas[`lampara${datos.lampara}`].writeSync(OFF);
        break;

      case 'ofrecerSeñal':
        if (!usuariosConectados.hasOwnProperty(datos.enviarA)) return;
        usuariosConectados[datos.enviarA].send(
          JSON.stringify({
            accion: 'conectarSeñal',
            idDelUsuario: usuario.id,
            señal: datos.signal,
          })
        );
        break;
    }
  });

  // Esperamos a ver si el usuario se desconecta.
  usuario.on('close', () => {
    // Por último eliminamos al ususario de la lista de usuarios conectados.
    delete usuariosConectados[usuario.id];
  });
});

server.listen(puerto, () => {
  console.log(`La página se puede ver en: localhost:${puerto}`);
});
