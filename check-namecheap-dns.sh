#!/bin/bash

# Namecheap API script to check DNS records
DOMAIN="social-ai.pro"
SLD="social-ai"
TLD="pro"

# Check if API credentials are set
if [ -z "$NAMECHEAP_API_KEY" ] || [ -z "$NAMECHEAP_API_USER" ]; then
    echo "Please set NAMECHEAP_API_KEY and NAMECHEAP_API_USER environment variables"
    echo "You can find these in your Namecheap account:"
    echo "1. Go to: https://ap.www.namecheap.com/settings/tools/apiaccess/"
    echo "2. Enable API access"
    echo "3. Whitelist your IP"
    echo "4. Get your API key"
    exit 1
fi

# API endpoint
API_URL="https://api.namecheap.com/xml.response"

# Get DNS records
echo "Fetching DNS records for $DOMAIN..."

curl -s -G "$API_URL" \
  --data-urlencode "ApiUser=$NAMECHEAP_API_USER" \
  --data-urlencode "ApiKey=$NAMECHEAP_API_KEY" \
  --data-urlencode "UserName=$NAMECHEAP_API_USER" \
  --data-urlencode "ClientIp=$(curl -s ifconfig.me)" \
  --data-urlencode "Command=namecheap.domains.dns.getHosts" \
  --data-urlencode "SLD=$SLD" \
  --data-urlencode "TLD=$TLD" | xmllint --format -

echo -e "\n\nTo update DNS records for Vercel, you need:"
echo "1. A record: @ -> 76.76.21.21"
echo "2. CNAME record: www -> cname.vercel-dns.com"