
ENV_FILE="/Users/karanamraghuveer/Desktop/HOME/PROJECTS/GATEPASS/BACKEND/.env"

IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || ipconfig getifaddr en2 2>/dev/null)

if [ -z "$IP" ]; then
  echo "$(date): ❌ Could not detect IP. Skipping update." >> /tmp/gatepass-ip-update.log
  exit 1
fi

# Update APP_URL in .env
sed -i '' "s|^APP_URL=.*|APP_URL=http://$IP:3000|" "$ENV_FILE"

echo "$(date): ✅ Updated APP_URL=http://$IP:3000" >> /tmp/gatepass-ip-update.log
