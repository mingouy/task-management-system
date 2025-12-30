@echo off
chcp 65001 >nul
echo ============================================
echo        任务管理系统 - 启动器
echo ============================================
echo.

cd /d "%~dp0"

REM 检查是否安装了Node.js
node -v >nul 2>&1
if errorlevel 1 (
    echo [错误] 未检测到 Node.js
    echo.
    echo 请先安装 Node.js:
    echo 1. 访问 https://nodejs.org/zh-cn/
    echo 2. 下载并安装 LTS 版本
    echo 3. 重新运行此脚本
    echo.
    pause
    exit /b 1
)

echo [1/3] ✓ Node.js 环境正常

REM 检查dist目录是否存在
if not exist "dist" (
    echo [错误] 未找到 dist 目录
    echo.
    echo 请先运行 npm run build 构建项目
    echo.
    pause
    exit /b 1
)

echo [2/3] ✓ 项目文件已就绪

echo.
echo [3/3] 启动开发服务器...
echo.
echo ============================================
echo   服务器已启动！
echo ============================================
echo.
echo   本地访问: http://localhost:5173
echo.
echo   按 Ctrl+C 可停止服务器
echo ============================================
echo.

npm run dev

pause
