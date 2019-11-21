# Форумчик

Развернуть в дев режиме
```bash
cd client
npm run&
cd ../server
gradle build jar
java -jar ./build/libs/chan-1.0.0-SNAPSHOT.jar
```

Выкатить готовый бинарь (там что-то сломалось с копированием ресурсов)
```bash
cd server
gradle copyFrontendData build jar
```
Бинарь будет лежать в server/build/libs