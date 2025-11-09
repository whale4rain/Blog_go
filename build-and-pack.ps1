# whale4blog - 本地构建并打包

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  本地构建 Next.js (用于服务器部署)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectPath = "d:\task\go_blog\blog-nextjs"

# 进入项目目录
Set-Location $projectPath

# 检查环境配置
Write-Host "检查生产环境配置..." -ForegroundColor Yellow

if (-Not (Test-Path ".env.production")) {
    Write-Host ""
    Write-Host "警告: 未找到 .env.production 文件！" -ForegroundColor Red
    Write-Host "请创建 .env.production 并配置：" -ForegroundColor Yellow
    Write-Host "  NEXT_PUBLIC_API_BASE_URL=https://whale4blog.com/api"
    Write-Host "  NEXT_PUBLIC_APP_URL=https://whale4blog.com"
    Write-Host ""
    
    $response = Read-Host "是否继续？(y/n)"
    if ($response -ne "y") {
        exit
    }
}

# 清理旧构建
Write-Host ""
Write-Host "清理旧构建..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next
}

# 构建项目
Write-Host ""
Write-Host "开始构建项目..." -ForegroundColor Yellow
Write-Host "（这可能需要几分钟）" -ForegroundColor Gray
Write-Host ""

npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "构建失败！" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✓ 构建成功！" -ForegroundColor Green

# 准备打包
Write-Host ""
Write-Host "准备打包..." -ForegroundColor Yellow

$outputPath = "d:\task\go_blog\nextjs-deploy.zip"

# 删除旧的压缩包
if (Test-Path $outputPath) {
    Remove-Item $outputPath
}

# 创建压缩包
Write-Host "压缩文件（包含 .next, public, package.json 等）..." -ForegroundColor Yellow

$filesToInclude = @(
    ".next",
    "public",
    "package.json",
    "package-lock.json",
    "next.config.js",
    ".env.production"
)

# 检查文件是否存在
$existingFiles = @()
foreach ($file in $filesToInclude) {
    if (Test-Path $file) {
        $existingFiles += $file
    }
}

Compress-Archive -Path $existingFiles -DestinationPath $outputPath -CompressionLevel Optimal

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✓ 打包完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "打包文件：" -ForegroundColor Yellow
Write-Host "  $outputPath" -ForegroundColor Cyan

$fileSize = (Get-Item $outputPath).Length / 1MB
Write-Host "  大小: $([math]::Round($fileSize, 2)) MB" -ForegroundColor Gray

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  上传到服务器" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "方法 1: 使用 SCP" -ForegroundColor Yellow
Write-Host "  scp $outputPath user@server-ip:/var/www/whale4blog/blog-nextjs/"
Write-Host ""

Write-Host "方法 2: 使用 FTP 工具" -ForegroundColor Yellow
Write-Host "  使用 FileZilla 等工具上传到服务器"
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  在服务器上部署" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "连接到服务器后执行：" -ForegroundColor Yellow
Write-Host ""
Write-Host "cd /var/www/whale4blog/blog-nextjs" -ForegroundColor Gray
Write-Host ""
Write-Host "# 解压文件" -ForegroundColor Gray
Write-Host "unzip -o nextjs-deploy.zip" -ForegroundColor Gray
Write-Host ""
Write-Host "# 安装生产依赖" -ForegroundColor Gray
Write-Host "npm install --production" -ForegroundColor Gray
Write-Host ""
Write-Host "# 启动或重启服务" -ForegroundColor Gray
Write-Host "pm2 restart whale4blog-frontend" -ForegroundColor Gray
Write-Host "# 或首次启动" -ForegroundColor Gray
Write-Host "pm2 start npm --name 'whale4blog-frontend' -- start" -ForegroundColor Gray
Write-Host "pm2 save" -ForegroundColor Gray
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# # 询问是否直接上传
# $hasSSH = Read-Host "是否配置了 SSH？想要直接上传吗？(y/n)"

# if ($hasSSH -eq "y") {
#     Write-Host ""
#     $serverUser = Read-Host "服务器用户名"
#     $serverIP = Read-Host "服务器 IP"
    
#     Write-Host ""
#     Write-Host "正在上传..." -ForegroundColor Yellow
    
#     scp $outputPath "${serverUser}@${serverIP}:/var/www/whale4blog/blog-nextjs/"
    
#     if ($LASTEXITCODE -eq 0) {
#         Write-Host "✓ 上传成功！" -ForegroundColor Green
#         Write-Host ""
#         Write-Host "现在在服务器上执行：" -ForegroundColor Yellow
#         Write-Host "  ssh ${serverUser}@${serverIP}"
#         Write-Host "  cd /var/www/whale4blog/blog-nextjs"
#         Write-Host "  unzip -o nextjs-deploy.zip"
#         Write-Host "  npm install --production"
#         Write-Host "  pm2 restart whale4blog-frontend"
#     } else {
#         Write-Host "✗ 上传失败！请检查 SSH 配置" -ForegroundColor Red
#     }
# }

# Write-Host ""
