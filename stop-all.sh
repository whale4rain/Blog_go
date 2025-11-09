#!/bin/bash

# whale4blog - 关闭所有服务

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}========================================"
echo -e "  关闭 whale4blog 所有服务"
echo -e "========================================${NC}"
echo ""

# 关闭 Go 后端 (8080)
echo -e "${YELLOW}关闭 Go 后端 (端口 8080)...${NC}"
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    PID=$(lsof -Pi :8080 -sTCP:LISTEN -t)
    kill -15 $PID 2>/dev/null
    sleep 2
    
    # 检查是否还在运行
    if kill -0 $PID 2>/dev/null; then
        echo -e "  ${YELLOW}进程未响应，强制关闭...${NC}"
        kill -9 $PID
    fi
    echo -e "  ${GREEN}✓ 已关闭 (PID: $PID)${NC}"
else
    echo -e "  ${RED}未运行${NC}"
fi

# 关闭 Next.js 前端 (3000)
echo -e "${YELLOW}关闭 Next.js 前端 (端口 3000)...${NC}"
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    PID=$(lsof -Pi :3000 -sTCP:LISTEN -t)
    kill -15 $PID 2>/dev/null
    sleep 2
    
    if kill -0 $PID 2>/dev/null; then
        kill -9 $PID
    fi
    echo -e "  ${GREEN}✓ 已关闭 (PID: $PID)${NC}"
else
    echo -e "  ${RED}未运行${NC}"
fi

# 关闭 Vue 前端 (5173)
echo -e "${YELLOW}关闭 Vue 前端 (端口 5173)...${NC}"
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    PID=$(lsof -Pi :5173 -sTCP:LISTEN -t)
    kill -15 $PID 2>/dev/null
    sleep 1
    
    if kill -0 $PID 2>/dev/null; then
        kill -9 $PID
    fi
    echo -e "  ${GREEN}✓ 已关闭 (PID: $PID)${NC}"
else
    echo -e "  ${RED}未运行${NC}"
fi

echo ""
echo -e "${CYAN}========================================"
echo -e "  ${GREEN}所有服务已关闭！${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""
echo -e "${YELLOW}提示：${NC}"
echo "  - 使用 PM2: pm2 list 查看 PM2 管理的进程"
echo "  - 重新启动: ./start-services.sh"
echo "  - 检查状态: ./check-services.sh"
echo ""
