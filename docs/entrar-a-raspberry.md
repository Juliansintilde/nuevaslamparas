# Acceder a la Raspberry desde el computador

Las credenciales de la raspberry son:

Usuario: **pi**  
Clave: **raspberry**

El computador debe estar conectado a la misma red. Desde el terminal:

```bash
ssh pi@raspberrypi.local
```

Por facilidad podemos usar el nombre predeterminado de la raspberry en la red que es `raspberry.local`. Si tenemos varias en la misma red debemos usar la IP. Por ejemplo: `ssh pi@192.168.10.14` (La IP puede ser diferente en su red).

![ssh](./imgs/SSH.gif)

## Actualizar sistema operativo

Primero actualizamos todos los registros:

```bash
sudo apt update
```

Ahora podemos actualizar todo (puede tomar un tiempo dependiendo de la conexión a internet y velocidad de la SD)

```bash
sudo apt dist-upgrade --yes
```
