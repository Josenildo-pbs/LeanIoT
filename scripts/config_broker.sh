#!/bin/sh
set -e

CONFIG_FILE="/mosquitto/config/mosquitto.conf"
PASS_FILE="/mosquitto/config/passwordfile"

# Create password file if it doesn't exist
if [ ! -f "$PASS_FILE" ]; then
  echo "Creating Mosquitto password file..."
  if [ -z "$MQTT_USERNAME" ] || [ -z "$MQTT_PASSWORD" ]; then
    echo "MQTT_USERNAME and MQTT_PASSWORD must be set!"
    exit 1
  fi

  touch "$PASS_FILE"
  mosquitto_passwd -b "$PASS_FILE" "$MQTT_USERNAME" "$MQTT_PASSWORD"
else
  echo "Mosquitto password file already exists, skipping creation."
fi

# Create mosquitto.conf if it doesn't exist
if [ ! -f "$CONFIG_FILE" ]; then
  echo "Creating Mosquitto configuration file..."
  cat > "$CONFIG_FILE" <<EOF
allow_anonymous false
password_file $PASS_FILE
listener 1883
listener 9001
protocol websockets
EOF
else
  echo "Mosquitto configuration file already exists, skipping creation."
fi

# Start Mosquitto
exec mosquitto -c "$CONFIG_FILE"
