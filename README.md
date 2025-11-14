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
### Construir APK en dev para ejecutar proyecto en android
#### Tener instalado antes de, solo una vez
```bash
npx expo install expo-dev-client
```
#### Ejecutar siempre que hay cambios nativos para desarrollar sobre una apk directamente
```bash
npx expo run:android
```
### Construir APK en dev para ejecutar proyecto en ios
```bash
npx expo run:ios
```
### Ejecutar proyecto en web
```bash
npx expo start --web
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


## Despliegue de aplicacion en android con https://expo.dev/
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


## Construccion de aplicacion en android de forma local
### Sentencia para ver logs conectado el celular por cable 
```bash
adb logcat *:S ReactNative:V ReactNativeJS:V 
```

### Construir el APK para produccion, lo crea en la carpeta android/app/build/outputs/apk/release/app-release.apk
```bash
npx expo prebuild
npx expo run:android --variant release
```

### En modo dev se debe correr el siguiente comando cada ves que se modifique:
#### - android/
#### - build.gradle
#### - AndroidManifest.xml
#### - librerías nativas
#### - Agregas o quitas dependencias nativas
```bash
npx expo run:android
```

### Para ver los logs y como esta corriendo la construccion ejecutar en otra terminar lo siguiente
```bash
npx expo prebuild
cd android
.\gradlew clear
.\gradlew assembleRelease --console=plain
```

### Si se quiere versión release (final)
```bash
cd android
./gradlew assembleRelease
```


### Configurar variables de entorno sobre terminal solo para esa sesion de terminal
set JAVA_HOME=C:\Program Files\Java\jdk-17
set PATH=%JAVA_HOME%\bin;%PATH%
java -version

set ANDROID_HOME=C:\Users\Alejandra\AppData\Local\Android\Sdk
set ANDROID_SDK_ROOT=C:\Users\Alejandra\AppData\Local\Android\Sdk


### Cada que se quiera reconstruir el .apk en modo dev usar estos comandos
#### Metodo 1 mas demorado pero mas garantizado
```bash
npx expo prebuild --clean
npx expo run:android
```
#### Metodo 2 menos demorado
```bash
npx expo prebuild
cd android
gradlew clean
cd ..
npx expo run:android
```