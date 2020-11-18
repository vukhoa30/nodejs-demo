# Tech stacks:
- NodeJS, Typescript, Express
- PostgreSQL, knex, objection
- Jest

# Start app:
To start an API HTTP server
## Prerequisite
- A PostgreSQL server (tested against v13)
- NodeJS (tested against v12)
- (For Docker app mode) Docker
### Dev mode:
- Install dependencies: `npm i`
- Create .env file following the template file ".env.example"
- Start app: `npm run dev`
### Production mode:
- Compile to production code: `npm run build`
- Create .env file to the folder "<project>/dist" following the template file ".env.example"
- Start app: `npm start`
### Production container mode:
<TBD: more deployment testing>
- Build image: `npm run build -t khoa/football_demo:1.0.0 .`
- Run app:
```
docker run -d --network=host \
  -e "DB_DBNAME=your_db" \
  -e "DB_PORT=5432" \
  -e "DB_USER=your_db_user" \
  -e "DB_PASS=your_db_password" \
  -e "DB_HOST=127.0.0.1" \
  --name khoa/football_demo:1.0.0
```

# Test
- Coverage: all route controllers
- To run test, run `npm test`

# API Documentation
<TBD: more completely done with Swagger>
- Get clubs:
```
curl --location --request GET 'http://localhost:3000/api/clubs?name=fc&code=LEE&page=1'
```
- Get club by ID: 
```
curl --location --request GET 'http://localhost:3000/api/clubs/55'
```
- Add a club: 
```
curl --location --request POST 'http://localhost:3000/api/clubs' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Hoang Anh Gia Lai 2 FC",
    "code": "HAG2",
    "country": "Vietnam"
}'
```
- Update a club:
```
curl --location --request PUT 'http://localhost:3000/api/clubs/1' \
--header 'Content-Type: application/json' \
--data-raw '{
    "country": "Poland"
}'
```
- Delete a club:
```
curl --location --request DELETE 'http://localhost:3000/api/clubs/34'
```

# Notes:
- Default API per page is 10
