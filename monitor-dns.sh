#!/bin/bash

# Momoto Café DNS Propagation Monitor
# Monitorea la propagación global del DNS para momotocafe.com

DOMAIN="momotocafe.com"
TARGET_NS="dns1.p01.nsone.net"
CHECK_INTERVAL=300  # 5 minutos

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Momoto Café DNS Propagation Monitor${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Dominio: $DOMAIN"
echo "Nameservers Esperados: Netlify (NSOne)"
echo "Intervalo de check: 5 minutos"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

check_dns() {
    echo -e "\n${YELLOW}⏱️  Check DNS - $(date '+%Y-%m-%d %H:%M:%S')${NC}"
    
    # Chequear con 8 nameservers públicos
    nameservers=(
        "8.8.8.8:Google"
        "1.1.1.1:Cloudflare"
        "208.67.222.222:OpenDNS"
        "9.9.9.9:Quad9"
        "213.0.113.1:RIPE"
        "156.154.70.1:Neustar"
        "ns1.google.com:Google NS"
        "8.26.56.26:Comodo"
    )
    
    propagated=0
    not_propagated=0
    
    for ns_info in "${nameservers[@]}"; do
        IFS=':' read -r ns_ip ns_name <<< "$ns_info"
        
        # Query el nameserver
        result=$(dig +short NS $DOMAIN @$ns_ip 2>/dev/null | grep "nsone" | head -1)
        
        if [ ! -z "$result" ]; then
            echo -e "${GREEN}✓${NC} $ns_name: $(echo $result | cut -d' ' -f1)"
            ((propagated++))
        else
            echo -e "${RED}✗${NC} $ns_name: No propagated yet"
            ((not_propagated++))
        fi
    done
    
    total=$((propagated + not_propagated))
    percentage=$((propagated * 100 / total))
    
    echo ""
    echo -e "Progreso Global: ${BLUE}${propagated}/${total} (${percentage}%)${NC}"
    
    if [ $propagated -eq $total ]; then
        echo -e "${GREEN}✅ DNS COMPLETAMENTE PROPAGADO!${NC}"
        echo -e "${GREEN}Tu dominio www.momotocafe.com está listo en Netlify${NC}"
        return 0
    else
        echo -e "${YELLOW}⏳ Esperando propagación completa...${NC}"
        return 1
    fi
}

# Check inmediato
check_dns
FIRST_CHECK=$?

# Loop de monitoreo cada 5 minutos
while [ $FIRST_CHECK -ne 0 ]; do
    echo -e "\n${BLUE}Siguiente check en 5 minutos... (Ctrl+C para salir)${NC}"
    sleep $CHECK_INTERVAL
    check_dns
    FIRST_CHECK=$?
done

echo -e "\n${GREEN}Monitoreo completado - DNS propagado correctamente!${NC}"
