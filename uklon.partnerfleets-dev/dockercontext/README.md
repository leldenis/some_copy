## Docker Compose

### 1) Stop the container(s) using the following command

```shell
docker-compose down
```

### 2) Remove any stopped containers and all unused images (not just dangling images):

```shell
docker system prune -a --volumes
```

### 3) [Build and run your app with Compose](https://docs.docker.com/compose/reference/up/)

```shell
docker-compose up --build --force-recreate --renew-anon-volumes --remove-orphans
```

or

## Gateway

1) Build the image

```shell
docker build -f Dockerfile.Gateway --build-arg CI_SERVER_HOST=gitlab.uklon.com.ua --build-arg CI_JOB_TOKEN= -t partnerfleets_gateway:dev .
```

2) Run the container

```shell
docker run -e ServiceName=PartnerFleets APPSETTINGS_DIRECTORY_PATH=/tmp --publish 8080:8080 --detach --name partnerfleets_gateway partnerfleets_gateway:dev
```

## UI

1) Build the image

```shell
docker build -f Dockerfile.UI -t partnerfleets_ui:dev .
```

2) Run the container

```shell
docker run -e ServiceName=PartnerFleets -e APPSETTINGS_DIRECTORY_PATH=/tmp -e NginxPort=4200 -e NginxGatewayHost=host.docker.internal:8080 --publish 4200:4200 --detach --name partnerfleets_ui partnerfleets_ui:dev
```

And done, your dockerized app will be accessible at http://localhost:4200
