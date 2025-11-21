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

### Ejecutar Android DEV (nombre dev, package dev, URL dev)
```bash
npm run android:dev
```

### Ejecutar Android PROD (nombre real, package real, URL prod)
```bash
npm run android:prod
```

### Ejecutar Web DEV
```bash
npm run web:dev
```

### Ejecutar Web PROD
```bash
npm run web:prod
```

### Ejecutar DEV .apk esto solo se hace una vez para instalar modulos nativos y despues usar 
```bash
eas build --profile development --platform android
```
```bash
npx expo start --dev-client
```
### Ejecutar PROD .apk para construir la app de produccion
```bash
eas build --profile production --platform android
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


### Agregar la linea de "com.google.android.geo.API_KEY" en AndroidManifest.xml despues de <application
```bash
<meta-data android:name="com.google.android.geo.API_KEY" android:value="AIzaSyDgoT1jsWnp4t2O-5k-xklh6ZgPc5oOh_8"/>
```




### Para arrancar le proyecto el package.json debe estar asi
"scripts": {
    "dev": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web",
    "build": "npx expo export",
    "start": "npx serve -s dist",
    "start:dev": "expo start --config-path app.dev.json",
    "start:prod": "expo start --config-path app.prod.json"
},

### desarrollo (local)
y se arranca el proyecto asi
#### desarrollo (local)
npm run start:dev
#### producción (API real)
npm run start:prod



### Crear APK a produccion
✔ OPCIÓN A (Recomendada): Usar Expo Application Services (EAS)
NO necesitas Android Studio.
Solo haces:
eas build -p android --profile production
Te genera:
APK (para instalar directamente)
AAB (para Play Store)
📌 Tu configuración eas.json definiría el entorno de producción:
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_API_URL": "https://midominio.railway.app/api"
      }
    }
  }
}

✔ OPCIÓN B (Sin EAS): generar APK usando Android Studio
Este método no usa Expo Go, sino Expo Prebuild.
1. Genera carpeta android/ actualizada:
npx expo prebuild
2. Abre el proyecto:
android/
Con Android Studio.



### Crear IPA a produccion
Aquí no hay escapatoria:
√ Necesitas una Mac real o Mac en la nube.

Dos opciones:
✔ Opción A: EAS Build (la mejor)
eas build -p ios --profile production
Expo usa sus Macs → Te genera un .ipa.

✔ Opción B: Compilar local en Mac
npx expo prebuild
Luego abres:
ios/
En Xcode → Archive → Distribuir en App Store.