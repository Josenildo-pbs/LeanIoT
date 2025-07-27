
# Application Guide

## Environment Configuration

An example environment configuration file is provided in the project as `env.example`.

### Step 1: Create Your `.env` File

Rename the file:

```bash
mv env.example .env
```
### Step 2: Fill Out the Required Environment Variables

Edit the .env file and provide the appropriate values for your setup:

```
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_PORT=
POSTGRES_DB=
DATABASE_URL=postgresql://your_user:your_password@db:49154/your_database_name

MQTT_USERNAME=
MQTT_PASSWORD=

JWT_SECRET=
SALT_ROUNDS=
```

## Building Required Containers

To build and start the necessary containers using Docker Compose:

```bash
docker-compose -f scripts/docker-compose.yaml --env-file .env up --build
```

Use the following command to open the PostgreSQL terminal inside the container:

```bash
docker exec -it <CONTAINER_NAME> psql -h localhost -p <PORT> -U <USERNAME> -d <DATABASE_NAME>
````
## Prisma Workflow

### Generate the Prisma Client

Run this command to generate the Prisma client:

```bash
npx prisma generate
```

### Apply Migrations and Create Tables

Use the following command to apply migrations and create tables in the PostgreSQL database:

```bash
npx prisma migrate dev
```

## Mosquitto MQTT Broker Setup

### Step 1: Build the container

After building the container will generate a default `mosquitto.conf`:


### Step 2: Generate the Password File

Once the container is running, execute the following command inside the container terminal:

```bash
touch /mosquitto/config/passwordfile
```
```bash
chmod 700 /mosquitto/config/passwordfile
```
```bash
mosquitto_passwd -b /mosquitto/config/passwordfile $MQTT_USERNAME $MQTT_PASSWORD
```

This command creates the password file with the specified credentials.

### Step 3: Replace the config file

Go to `mosquitt_data` and replace the configuration with the `script/mosquitto_config/mosquitto.conf`.


