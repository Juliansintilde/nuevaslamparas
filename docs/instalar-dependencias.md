# Instalar dependencias

## Git

```bash
sudo apt install git
```

## Nodejs

Recomendado usar [NVM](https://github.com/nvm-sh/nvm)

Seguir las instrucciones actualizadas en el repositorio de [NVM](https://github.com/nvm-sh/nvm) pero acá un resumen:

El siguiente comando usa la versión `0.38` pero revisar en el repo de NVM si es la más reciente antes de instalar.

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
```

Reiniciar bash para que podamos usar el comando `nvm` sin reiniciar el terminal.

```bash
source ~/.bashrc
```

Buscar la versión más reciente marcada como **Latest LTS**

```bash
nvm ls-remote
```

Usar la versión LTS para instalar Node

```bash
nvm install 14.17.6 # cambiar el numero de la versión por la que se quiera instalar.
```

## Yarn

```bash
npm install --global yarn
```
