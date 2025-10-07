# 📱 Sicte SAS CCOT


## Instalación local
### Instalar node_modules
```bash
npm install
```
### Ejecutar proyecto borrando cache (-c)
```bash
npx expo start -c
```
### Ejecutar proyecto borrando cache y ejcutando por tuneles (--tunnel)
```bash
npx expo start -c --tunnel
```


## Despliegue de aplicacion en web
### Subir el proyecto a giithub para que railway lo despliegue automaticamente


## Despliegue de aplicacion en android
### Examinar que todas las librerias esten bien
```bash
npx expo-doctor
```
### Construir APK
```bash
eas build -p android --clear-cache
```