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
### Ejecutar proyecto para que sirva por cable y web despues de instalar el adb y la variable de entorno
```bash
npx expo start --localhost
```


### para ejecutar proyecto por tunnel ngrok pero antes se debe habilitar esto para que pueda ser accesible el backend en desarrollo
```bash
ngrok http 8120
```
### para cerrar el servicio ADB
```bash
adb kill-server
```
### para abrir el servicio ADB
```bash
adb start-server
```


## Despliegue de aplicacion en web
### Subir el proyecto a giithub para que railway lo despliegue automaticamente


## Despliegue de aplicacion en android
### Examinar que todas las librerias esten bien
```bash
npx expo-doctor
```
### Construir .aab
```bash
eas build -p android
```
### Esto genera el .aab y lo sube a Google Play
```bash
eas build -p android --profile production
eas submit -p android --profile production
```
### Genera .apk para pruebas internas
```bash
eas build -p android --profile preview
```
### Genera versión con Expo Go / Development Client para debugging
```bash
eas build -p android --profile development
```
#### o
```bash
eas build -p android --clear-cache
```
### Actualizar APK
```bash
eas update
```
### Actualizar APK con mensaje 
```bash
eas update --branch preview --message "Implementa auto update al iniciar la app"
```

### Sentencia para ver logs conectado el celular por cable 
```bash
adb logcat *:S ReactNative:V ReactNativeJS:V 
```

### Construir el APK para produccion, lo crea en la carpeta android/app/build/outputs/apk/release/app-release.apk
```bash
npx expo prebuild
npx expo run:android --variant release
```

### Para ver los logs y como esta corriendo la construccion ejecutar en otra terminar lo siguiente
```bash
npx expo prebuild
cd android
.\gradlew clear
.\gradlew assembleRelease --console=plain
```

### Link para descargar java 21 https://adoptium.net/es/temurin/releases?version=21&os=any&arch=any

### Si se quiere versión release (final)
```bash
cd android
./gradlew assembleRelease
```