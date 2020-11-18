Start app with Docker:

docker run -d --network=host \
  -e "DB_DBNAME=your_db" \
  -e "DB_PORT=5432" \
  -e "DB_USER=your_db_user" \
  -e "DB_PASS=your_db_password" \
  -e "DB_HOST=127.0.0.1" \
  --name foobar foo/bar
  
Todo: finish the services, camelCase the app data, add Docker scripts, add tests