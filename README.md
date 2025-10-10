# API de Cálculo de Fechas Hábiles 

Este proyecto implementa una API REST desarrollada en TypeScript con Express que permite calcular fecha hábiles, teniendo en cuenta las condiciones laborales de Colombia

## Características

- Implementación en TypeScript con tipado explicito.

- Cálculo de fechas hábiles según calendario colombiano.

- Excluye automáticamente fines de semana y festivos nacionales.

- Considera el horario laboral de 8:00 a.m. a 5:00 p.m.

- Excluye la hora de almuerzo de 12:00 p.m. a 1:00 p.m.

- Endpoint público /business-days

- Preparado para despliegue en Render.



## Requisitos previos

Para poder compilar el API se debe contar con:

- [Node.js](https://nodejs.org/es)

- [Git](https://git-scm.com/)

## Instalación local

Clonar el repositorio:

1. Ejecutar el siguiente comando en la terminal

```bash
git clone https://github.com/danielagarom2-web/API-FechasHabiles.git
```


2. Ingresar a la carpeta del proyecto:

```bash
cd API-FechasHabiles
```

3. Instalar las dependencias:

```bash
npm install
```

4. Compilar y ejecutar la API:
```bash
npm run build
npm start
```

Una vez ejecutados estos comandos se podra acceder al navegador y la API estará disponible en:

```bash
http://localhost:3000/business-days
```


## Ejemplos de uso:
1. Petición un viernes a las 5:00 p.m. con "hours=1"

```bash
http://localhost:3000/business-days?date=2025-10-03T17:00:00&hours=1
```

- Resultado esperado: lunes a las 9:00 a.m. (hora Colombia) → "2025-XX-XXT14:00:00Z" (UTC)

2. Petición un sábado a las 2:00 p.m. con "hours=1"
```bash
http://localhost:3000/business-days?date=2025-10-04T14:00:00&hours=1
```
- Resultado esperado: lunes a las 9:00 a.m. (hora Colombia) → "2025-XX-XXT14:00:00Z" (UTC)

3. Petición con "days=1" y "hours=4" desde un martes a las 3:00 p.m
```bash
http://localhost:3000/business-days?date=2025-10-07T15:00:00&days=1&hours=4
```
- Resultado esperado: jueves a las 10:00 a.m. (hora Colombia) → "2025-XX-XXT15:00:00Z" (UTC)

4. Petición con "days=1" desde un domingo a las 6:00 p.m.

```bash
http://localhost:3000/business-days?date=2025-10-05T18:00:00Z&days=1
```
- Resultado esperado: lunes a las 5:00 p.m. (hora Colombia) → "2025-XX-XXT22:00:00Z" (UTC)

5. Petición con "hours=8"  desde un día laboral a las 8:00 a.m.

```bash
http://localhost:3000/business-days?date=2025-10-06T08:00:00Z&hours=8
```
Resultado esperado: mismo día a las 5:00 p.m. (hora Colombia) → "2025-XX-XXT22:00:00Z" (UTC)

6. Petición con "days=1"  desde un día laboral a las 8:00 a.m.

```bash
http://localhost:3000/business-days?date=2025-10-06T13:00:00Z&days=1
```
- Resultado esperado: siguiente día laboral a las 8:00 a.m. (hora Colombia) → "2025-XX-XXT13:00:00Z" (UTC)

7. Petición con "days=1"  desde un día laboral a las 12:30 p.m.

```bash
http://localhost:3000/business-days?days=1&date=2025-10-09T17:30:00Z
```

- Resultado esperado: siguiente día laboral a las 12:00 p.m. (hora Colombia) → "2025-XX-XXT17:00:00Z" (UTC)

8. Petición con "hours=3"  desde un día laboral a las 11:30 a.m.

```bash
http://localhost:3000/business-days?hours=3&date=2025-10-09T16:30:00Z
```
- Resultado esperado: mismo día laboral a las 3:30 p.m. (hora Colombia) → 2025-XX-XXT20:30:00Z (UTC)

9. Petición con "date=2025-04-10T15:00:00.000Z" y "days=5" y "hours=4"  (el 17 y 18 de abril son festivos)

```bash
http://localhost:3000/business-days?date=2025-04-10T15:00:00.000Z&days=5&hours=4
```

-  Resultado esperado: 21 de abril a las 3:00 p.m. (hora Colombia) → "2025-04-21T20:00:00.000Z" (UTC)



**URL de despliegue:** 
```bash
https://api-fechashabiles.onrender.com
```
**Ejemplo de uso:**
```bash
https://api-fechashabiles.onrender.com?date=2025-10-09T15:00:00.000Z&days=5&hours=4
```









