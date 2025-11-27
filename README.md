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
#### En caso donde es necesito reconstruir la caprtea android
```bash
npx expo prebuild --platform android --clean
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
Solo haces para crear el canal una vez:
npx eas channel:create production 
para construir el proyecto una vez
eas build --platform android --profile prod
para actualizar la aplicacion
npx expo update --channel production


✔ OPCIÓN B (Sin EAS): generar APK usando Android Studio
Este método no usa Expo Go, sino Expo Prebuild.
1. Genera carpeta android/ actualizada:
npx expo prebuild
2. Abre el proyecto:
android/
Con Android Studio.

con la configuracion del script con esto, ahora se puede construir la app en forma de produccion
"prebuild:dev": "EXPO_PUBLIC_APP_ENV=dev npx expo prebuild",
"prebuild:prod": "EXPO_PUBLIC_APP_ENV=prod npx expo prebuild"
npm run prebuild:prod
android/
En android studio dar click en Assamble 'app' Run Configuration 
despues dar click en build
despues dar click en Generate Signed App Bundle or APKs
y despues Generate APKs
esto genera una apk en android/app/release/app-release.apk


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




## LLAVE keytool
keytool -genkeypair -v -keystore sicte-release-key.jks -storepass Sicte2025* -keypass Sicte2025* -alias sicte_key -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Sicte, OU=IT, O=Sicte, L=Bogota, S=Cundinamarca, C=CO"
5f0fc98c0cGenerando par de claves RSA de 2,048 bits para certificado autofirmado (SHA256withRSA) con una validez de 10,000 días
        para: CN=Sicte, OU=IT, O=Sicte, L=Bogota, ST=Cundinamarca, C=CO
[Almacenando sicte-release-key.jks]



### Subir APK a github
Flujo recomendado (profesional)
1️⃣ Crear tag local
git tag v1.0.1

2️⃣ Subir tag al repo
git push origin v1.0.1

3️⃣ Crear release con archivo APK
gh release create v1.0.1 Sicte_CCOT-v1.0.1.apk -t "v1.0.1" -n "Nueva versión con mejoras"


### Borrar la release anterior en github y cargar la nueva
gh release delete v1.0.3
gh release create v1.0.3 Sicte_CCOT-v1.0.3.apk -t "v1.0.3" -n "Nueva versión con mejoras v3"

### Reemplazar archivo en release existente
gh release upload v1.0.3 Sicte_CCOT-v1.0.3.apk --clobber


### Manejo de entorno Dev cuando se hizo Pro antes
npm run android

### Manejo de entorno Pro
Validar que esta variable este definida 
setx NODE_ENV "production"
Remove-Item -Recurse -Force android ó rmdir /s /q android
npm install
npm run prebuild:prod
cd android
./gradlew clean
despues abrir android studio en blanco
esperar a que sincronice android studio
despues dar click en build
despues dar click en Generate Signed App Bundle or APKs



### Ejecutar para limpiar el proyecto
cd android
./gradlew clean
Borrar despues de ejecutar
android/.gradle
android/.cxx  
salir de android y ejecutar
npm run prebuild:prod