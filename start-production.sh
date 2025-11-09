#!/bin/bash

# whale4blog - 启动生产环境（使用 PM2）

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

PROJECT_ROOT="/var/www/whale4blog"
BACKEND_DIR="$PROJECT_ROOT/server"
FRONTEND_DIR="$PROJECT_ROOT/blog-nextjs"

echo -e "${CYAN}========================================"
echo -e "  whale4blog 生产环境启动"
echo -e "========================================${NC}"
echo ""

# 检查是否安装了 PM2
if ! command -v pm2 &> /dev/null; then
    echo -e "${RED}错误: PM2 未安装！${NC}"
    echo ""
    echo "安装 PM2:"
    echo "  sudo npm install -g pm2"
    echo ""
    exit 1
fi

# 检查项目目录
if [ ! -d "$BACKEND_DIR" ]; then
    echo -e "${RED}错误: 后端目录不存在: $BACKEND_DIR${NC}"
    echo "请修改脚本中的 PROJECT_ROOT 变量"
    exit 1
fi

if [ ! -d "$FRONTEND_DIR" ]; then
    echo -e "${RED}错误: 前端目录不存在: $FRONTEND_DIR${NC}"
    echo "请修改脚本中的 PROJECT_ROOT 变量"
    exit 1
fi

# 启动 Go 后端
echo -e "${YELLOW}启动 Go 后端...${NC}"
cd "$BACKEND_DIR"

# 检查是否已编译
if [ ! -f "main" ]; then
    echo "  编译 Go 程序..."
    go build -o main main.go
    if [ $? -ne 0 ]; then
        echo -e "  ${RED}✗ 编译失败${NC}"
        exit 1
    fi
fi

# 启动后端
pm2 delete whale4blog-backend 2>/dev/null
pm2 start ./main --name "whale4blog-backend"
echo -e "  ${GREEN}✓ 后端已启动${NC}"

sleep 2

# 启动 Next.js 前端
echo -e "${YELLOW}启动 Next.js 前端...${NC}"
cd "$FRONTEND_DIR"

# 检查是否已构建
if [ ! -d ".next" ]; then
    echo "  构建 Next.js..."
    npm install
    npm run build
    if [ $? -ne 0 ]; then
        echo -e "  ${RED}✗ 构建失败${NC}"
        exit 1
    fi
fi

# 启动前端
pm2 delete whale4blog-frontend 2>/dev/null
pm2 start npm --name "whale4blog-frontend" -- start
echo -e "  ${GREEN}✓ 前端已启动${NC}"

# 保存 PM2 配置
pm2 save

echo ""
echo -e "${CYAN}========================================"
echo -e "  ${GREEN}✓ 所有服务已启动！${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""
echo -e "${YELLOW}访问地址：${NC}"
echo -e "  前端: ${CYAN}http://localhost:3000${NC}"
echo -e "  API:  ${CYAN}http://localhost:8080/api${NC}"
echo ""
echo -e "${YELLOW}管理命令：${NC}"
echo "  pm2 list                      - 查看所有进程"
echo "  pm2 logs                      - 查看日志"
echo "  pm2 logs whale4blog-frontend  - 查看前端日志"
echo "  pm2 logs whale4blog-backend   - 查看后端日志"
echo "  pm2 restart all               - 重启所有服务"
echo "  pm2 stop all                  - 停止所有服务"
echo "  pm2 monit                     - 监控面板"
echo ""
echo -e "${YELLOW}设置开机自启：${NC}"
echo "  pm2 startup"
echo "  pm2 save"
echo ""

# 显示当前状态
pm2 list
