@echo off
chcp 65001 >nul
echo ============================================
echo      上传代码到 GitHub
echo ============================================
echo.

cd /d "%~dp0"

REM 检查Git是否安装
git --version >nul 2>&1
if errorlevel 1 (
    echo [错误] Git 未安装！
    echo.
    echo 请先运行 "安装Git.bat" 安装 Git
    echo.
    pause
    exit /b 1
)

echo [1/6] Git 已就绪

REM 配置用户信息
echo.
echo ----- 设置用户信息 -----
set /p gh_user="请输入GitHub用户名: "
set /p gh_email="请输入邮箱: "
git config user.name "%gh_user%"
git config user.email "%gh_email%"
echo.

REM 初始化仓库
echo [2/6] 初始化仓库...
git init
echo.

REM 添加文件
echo [3/6] 添加文件...
git add .
echo.

REM 提交代码
echo [4/6] 提交代码...
git commit -m "任务管理系统 - Vue3"
echo.

REM 配置远程仓库
echo [5/6] 配置远程仓库...
echo.
echo 请输入您的GitHub仓库地址
echo 格式: https://github.com/用户名/仓库名.git
echo 例如: https://github.com/ouyangming/task-management-system.git
echo.
set /p gh_repo="仓库地址: "
echo.
git remote add origin "%gh_repo%"
git branch -M main
echo.

REM 推送到GitHub
echo [6/6] 推送到GitHub...
echo.
echo 需要输入GitHub信息:
echo 用户名: %gh_user%
echo 密码: 请输入 Personal Access Token (不是密码！)
echo.
git push -u origin main

echo.
echo ============================================
echo      上传完成！
echo ============================================
echo.
echo 下一步：部署到Vercel
echo 1. 访问 https://vercel.com
echo 2. 用GitHub登录
echo 3. 点击 "Add New Project"
echo 4. 选择您的仓库
echo 5. 点击 "Deploy"
echo ============================================

pause
