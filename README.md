# Showcase for [AG Grid JPA Adapter](https://github.com/smolcan/ag-grid-jpa-adapter)

Showcase using chosen database, Spring boot backend and Angular client.

## Choose database you want to try:
Choose one of these:
- postgres
- mysql
- mariadb

## Start with:
Run shell script with databse you chose. If you do not specify the --db param, postgres database will be used.
```bash
./run.sh --db mysql
```
You can also run docker composition directly without shell script (postgres database will be used).
```bash
docker compose up
```

## Stop with:
```bash
docker compose down
```

Website available at http://localhost:4200