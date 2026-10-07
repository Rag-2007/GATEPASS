#!/bin/bash
# Auto-detects the current machine IP and updates APP_URL in .env before starting Docker.

IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null)

if [ -z "$IP" ]; then
  echo "❌ Could not detect IP address. Are you connected to Wi-Fi?"
  exit 1
fi

echo "✅ Detected IP: $IP"

# Update APP_URL in .env
sed -i '' "s|^APP_URL=.*|APP_URL=http://$IP:3000|" .env

echo "✅ Updated APP_URL=http://$IP:3000 in .env"
echo "🚀 Starting Docker..."

docker compose up --build
