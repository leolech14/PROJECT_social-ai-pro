#!/usr/bin/env python3
import requests
import xml.etree.ElementTree as ET
import sys

# Configuration
API_KEY = "66cf1d42f91848d2898d8882a531cf99"
DOMAIN = "social-ai.pro"
SLD = "social-ai"
TLD = "pro"

# Vercel DNS settings
VERCEL_A_RECORD = "76.76.21.21"
VERCEL_CNAME = "cname.vercel-dns.com"

def get_client_ip():
    """Get client's public IP"""
    return requests.get('https://api.ipify.org').text

def namecheap_api_call(command, params={}):
    """Make API call to Namecheap"""
    base_params = {
        'ApiUser': USERNAME,
        'ApiKey': API_KEY,
        'UserName': USERNAME,
        'ClientIp': get_client_ip(),
        'Command': command
    }
    base_params.update(params)
    
    response = requests.get('https://api.namecheap.com/xml.response', params=base_params)
    print(f"\nDebug - API Response:\n{response.text}\n")
    return ET.fromstring(response.text)

def update_dns_records():
    """Update DNS records to point to Vercel"""
    print(f"🔄 Updating DNS records for {DOMAIN}...")
    
    # DNS records for Vercel
    records = [
        {'HostName': '@', 'RecordType': 'A', 'Address': VERCEL_A_RECORD, 'TTL': '1800'},
        {'HostName': 'www', 'RecordType': 'CNAME', 'Address': VERCEL_CNAME, 'TTL': '1800'}
    ]
    
    # Build parameters for setHosts
    params = {
        'SLD': SLD,
        'TLD': TLD
    }
    
    # Add each record
    for i, record in enumerate(records, 1):
        params[f'HostName{i}'] = record['HostName']
        params[f'RecordType{i}'] = record['RecordType']
        params[f'Address{i}'] = record['Address']
        params[f'TTL{i}'] = record['TTL']
    
    # Update DNS
    result = namecheap_api_call('namecheap.domains.dns.setHosts', params)
    
    # Check if successful
    if result.get('Status') == 'OK':
        print("✅ DNS records updated successfully!")
        print("\n📝 DNS Records set:")
        print(f"   A Record: @ → {VERCEL_A_RECORD}")
        print(f"   CNAME: www → {VERCEL_CNAME}")
        print("\n⏱️  DNS propagation can take 5-60 minutes")
        print(f"\n🌐 Your site will be available at: https://{DOMAIN}")
        return True
    else:
        error = result.find('.//Error')
        if error is not None:
            print(f"❌ Error: {error.text}")
        else:
            print("❌ Unknown error occurred")
        return False

if __name__ == "__main__":
    if len(sys.argv) > 1:
        USERNAME = sys.argv[1]
    else:
        USERNAME = input("Enter your Namecheap username: ")
    
    print(f"\n🚀 Configuring {DOMAIN} to point to Vercel...")
    print(f"👤 Username: {USERNAME}")
    print(f"🌍 Your IP: {get_client_ip()}")
    
    if update_dns_records():
        print("\n✅ All done! Now add the domain in Vercel:")
        print("   1. Go to: https://vercel.com/lbl14/social-ai-pro/settings/domains")
        print("   2. Click 'Add Domain'")
        print(f"   3. Enter: {DOMAIN}")
        print("   4. Click 'Add' - it should verify immediately")
    else:
        print("\n❌ Failed to update DNS records")
        print("Make sure:")
        print("1. Your IP is whitelisted in Namecheap API settings")
        print("2. API access is enabled")
        print("3. Username is correct")