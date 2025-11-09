#!/bin/bash
# Monitor Webhook Activity
# File: monitor-webhook.sh

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

clear

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}   WEBHOOK MONITORING DASHBOARD${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# Check if required tools are available
if ! command -v sqlite3 &> /dev/null; then
    echo -e "${RED}Error: sqlite3 is required but not installed${NC}"
    exit 1
fi

DB_PATH="database/database.sqlite"

if [ ! -f "$DB_PATH" ]; then
    echo -e "${RED}Error: Database not found at $DB_PATH${NC}"
    exit 1
fi

# Function to display stats
display_stats() {
    echo -e "${YELLOW}📊 Webhook Statistics${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    # Total webhooks today
    TOTAL_TODAY=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM payment_notifications WHERE DATE(created_at) = DATE('now')")
    echo -e "${GREEN}Total webhooks today:${NC} $TOTAL_TODAY"
    
    # Processed vs unprocessed
    PROCESSED=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM payment_notifications WHERE processed_at IS NOT NULL")
    UNPROCESSED=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM payment_notifications WHERE processed_at IS NULL")
    echo -e "${GREEN}Processed:${NC} $PROCESSED | ${YELLOW}Unprocessed:${NC} $UNPROCESSED"
    
    # Active subscriptions
    ACTIVE_SUBS=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM subscriptions WHERE status = 'active'")
    echo -e "${GREEN}Active subscriptions:${NC} $ACTIVE_SUBS"
    
    echo ""
}

# Function to display recent webhooks
display_recent() {
    echo -e "${YELLOW}📥 Recent Webhooks (Last 10)${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    sqlite3 -header -column "$DB_PATH" "
        SELECT 
            substr(order_id, 1, 20) as order_id,
            provider,
            CASE 
                WHEN processed_at IS NOT NULL THEN '✓'
                ELSE '✗'
            END as processed,
            datetime(created_at, 'localtime') as received_at
        FROM payment_notifications 
        ORDER BY created_at DESC 
        LIMIT 10
    "
    
    echo ""
}

# Function to display recent subscriptions
display_subscriptions() {
    echo -e "${YELLOW}💳 Recent Subscriptions (Last 10)${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    sqlite3 -header -column "$DB_PATH" "
        SELECT 
            id,
            user_id,
            package_id,
            status,
            datetime(created_at, 'localtime') as created,
            datetime(activated_at, 'localtime') as activated
        FROM subscriptions 
        ORDER BY created_at DESC 
        LIMIT 10
    "
    
    echo ""
}

# Function to tail Laravel logs
tail_logs() {
    echo -e "${YELLOW}📋 Live Laravel Logs${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${MAGENTA}Press CTRL+C to stop${NC}"
    echo ""
    
    tail -f storage/logs/laravel.log | while read line; do
        # Highlight webhook-related logs
        if [[ $line == *"webhook"* ]] || [[ $line == *"Midtrans"* ]]; then
            echo -e "${GREEN}$line${NC}"
        elif [[ $line == *"ERROR"* ]] || [[ $line == *"error"* ]]; then
            echo -e "${RED}$line${NC}"
        elif [[ $line == *"WARNING"* ]] || [[ $line == *"warning"* ]]; then
            echo -e "${YELLOW}$line${NC}"
        else
            echo "$line"
        fi
    done
}

# Main menu
while true; do
    echo -e "${CYAN}========================================${NC}"
    echo -e "${CYAN}Choose an option:${NC}"
    echo ""
    echo -e "${GREEN}1.${NC} Display statistics"
    echo -e "${GREEN}2.${NC} Show recent webhooks"
    echo -e "${GREEN}3.${NC} Show recent subscriptions"
    echo -e "${GREEN}4.${NC} Tail Laravel logs (live)"
    echo -e "${GREEN}5.${NC} Refresh all"
    echo -e "${GREEN}6.${NC} Exit"
    echo ""
    echo -n "Enter choice [1-6]: "
    read choice
    
    clear
    
    case $choice in
        1)
            display_stats
            echo ""
            read -p "Press Enter to continue..."
            clear
            ;;
        2)
            display_recent
            echo ""
            read -p "Press Enter to continue..."
            clear
            ;;
        3)
            display_subscriptions
            echo ""
            read -p "Press Enter to continue..."
            clear
            ;;
        4)
            tail_logs
            clear
            ;;
        5)
            display_stats
            display_recent
            display_subscriptions
            echo ""
            read -p "Press Enter to continue..."
            clear
            ;;
        6)
            echo -e "${GREEN}Goodbye!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid choice. Please try again.${NC}"
            sleep 2
            clear
            ;;
    esac
done
