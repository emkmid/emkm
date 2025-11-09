#!/bin/bash
# Script untuk Automasi Testing Webhook
# File: start-webhook-test.sh

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}========================================"
echo -e "  WEBHOOK TESTING AUTOMATION SCRIPT"
echo -e "========================================${NC}"
echo ""

# Function untuk cek port
check_port() {
    nc -z localhost $1 2>/dev/null
    return $?
}

# 1. Cek Laravel Server
echo -e "${YELLOW}[1/5] Checking Laravel Server...${NC}"
if check_port 8000; then
    echo -e "  ${GREEN}✓ Laravel server is running on port 8000${NC}"
else
    echo -e "  ${RED}✗ Laravel server is NOT running${NC}"
    echo -e "  ${YELLOW}Starting Laravel server...${NC}"
    
    # Start Laravel di background
    php artisan serve > /dev/null 2>&1 &
    LARAVEL_PID=$!
    
    sleep 3
    
    if check_port 8000; then
        echo -e "  ${GREEN}✓ Laravel server started successfully (PID: $LARAVEL_PID)${NC}"
    else
        echo -e "  ${RED}✗ Failed to start Laravel server${NC}"
        echo -e "  ${YELLOW}Please start manually: php artisan serve${NC}"
        exit 1
    fi
fi

echo ""

# 2. Cek ngrok
echo -e "${YELLOW}[2/5] Checking ngrok...${NC}"
if command -v ngrok &> /dev/null; then
    echo -e "  ${GREEN}✓ ngrok is installed${NC}"
else
    echo -e "  ${RED}✗ ngrok is NOT installed${NC}"
    echo ""
    echo -e "  ${YELLOW}Please install ngrok:${NC}"
    echo -e "  ${CYAN}1. Download from: https://ngrok.com/download${NC}"
    echo -e "  ${CYAN}2. Extract and move to /usr/local/bin${NC}"
    echo -e "  ${CYAN}3. Or add to PATH${NC}"
    exit 1
fi

echo ""

# 3. Start ngrok
echo -e "${YELLOW}[3/5] Starting ngrok tunnel...${NC}"

# Kill existing ngrok process
pkill ngrok 2>/dev/null

# Start ngrok di background
ngrok http 8000 > /dev/null 2>&1 &
NGROK_PID=$!

echo -e "  ${YELLOW}Waiting for ngrok to initialize...${NC}"
sleep 4

# 4. Get ngrok URL via API
echo ""
echo -e "${YELLOW}[4/5] Retrieving ngrok URL...${NC}"

# Try to get ngrok URL
for i in {1..5}; do
    NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"https://[^"]*' | cut -d'"' -f4 | head -n1)
    
    if [ -n "$NGROK_URL" ]; then
        break
    fi
    
    echo -e "  ${YELLOW}Attempt $i/5...${NC}"
    sleep 2
done

if [ -n "$NGROK_URL" ]; then
    WEBHOOK_URL="${NGROK_URL}/webhooks/midtrans"
    
    echo -e "  ${GREEN}✓ ngrok tunnel created successfully${NC}"
    echo ""
    echo -e "${CYAN}  ================================================${NC}"
    echo -e "${GREEN}  PUBLIC URL: $NGROK_URL${NC}"
    echo -e "${GREEN}  WEBHOOK URL: $WEBHOOK_URL${NC}"
    echo -e "${CYAN}  ================================================${NC}"
    echo ""
    
    # Copy to clipboard (jika ada xclip atau pbcopy)
    if command -v xclip &> /dev/null; then
        echo -n "$WEBHOOK_URL" | xclip -selection clipboard
        echo -e "  ${GREEN}✓ Webhook URL copied to clipboard!${NC}"
    elif command -v pbcopy &> /dev/null; then
        echo -n "$WEBHOOK_URL" | pbcopy
        echo -e "  ${GREEN}✓ Webhook URL copied to clipboard!${NC}"
    elif command -v clip.exe &> /dev/null; then
        echo -n "$WEBHOOK_URL" | clip.exe
        echo -e "  ${GREEN}✓ Webhook URL copied to clipboard!${NC}"
    fi
else
    echo -e "  ${RED}✗ Failed to get ngrok URL${NC}"
    echo -e "  ${YELLOW}Make sure ngrok is running on port 4040${NC}"
    exit 1
fi

echo ""

# 5. Instructions
echo -e "${YELLOW}[5/5] Next Steps:${NC}"
echo ""
echo -e "  ${CYAN}1. Open Midtrans Dashboard:${NC}"
echo -e "     https://dashboard.sandbox.midtrans.com/"
echo ""
echo -e "  ${CYAN}2. Go to: Settings > Configuration${NC}"
echo ""
echo -e "  ${CYAN}3. Paste Webhook URL:${NC}"
echo -e "     ${WEBHOOK_URL}"
echo ""
echo -e "  ${CYAN}4. Open ngrok Inspector:${NC}"
echo -e "     http://localhost:4040"
echo ""
echo -e "  ${CYAN}5. Monitor Laravel logs:${NC}"
echo -e "     tail -f storage/logs/laravel.log"
echo ""
echo -e "  ${CYAN}6. Test webhook:${NC}"
echo -e "     php test-webhook-local.php"
echo ""
echo -e "${CYAN}========================================${NC}"
echo -e "${GREEN}  Ready for testing!${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# Save PIDs to file for cleanup
echo "$LARAVEL_PID" > .webhook-test.pid
echo "$NGROK_PID" >> .webhook-test.pid

# Keep script running
echo -e "${YELLOW}Press CTRL+C to stop all services...${NC}"

# Trap CTRL+C
trap cleanup INT

cleanup() {
    echo ""
    echo -e "${YELLOW}Stopping services...${NC}"
    
    if [ -f .webhook-test.pid ]; then
        while read pid; do
            kill $pid 2>/dev/null
        done < .webhook-test.pid
        rm .webhook-test.pid
    fi
    
    pkill ngrok 2>/dev/null
    
    echo -e "${GREEN}Done!${NC}"
    exit 0
}

# Wait
wait
