#!/bin/bash
# save as run.sh

DB_TYPE="postgres"  # Default database type

while [ "$#" -gt 0 ]; do
  case "$1" in
    --db)
      DB_TYPE="$2"
      shift 2
      ;;
    *)
      shift
      ;;
  esac
done

if [ "$DB_TYPE" = "postgres" ]; then
  export DB_TYPE="postgres"
  export DB_IMAGE="postgres:15"
  export DB_PORT="5432"
  export DB_CONTAINER_PORT="5432"
  export DB_URL="jdbc:postgresql://database:5432/mydatabase"
  export DB_DRIVER_CLASS_NAME="org.postgresql.Driver"
elif [ "$DB_TYPE" = "mysql" ]; then
  export DB_TYPE="mysql"
  export DB_IMAGE="mysql:8"
  export DB_PORT="3306"
  export DB_CONTAINER_PORT="3306"
  export DB_URL="jdbc:mysql://database:3306/mydatabase"
  export DB_DRIVER_CLASS_NAME="com.mysql.cj.jdbc.Driver"
else
  echo "Unsupported database type: $DB_TYPE"
  echo "Supported types: postgres, mysql"
  exit 1
fi

echo $DB_TYPE
echo $DB_IMAGE
echo $DB_PORT
echo $DB_CONTAINER_PORT
echo $DB_URL
echo $DB_DRIVER_CLASS_NAME



docker compose up -d