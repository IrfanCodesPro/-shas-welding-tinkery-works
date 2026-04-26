@echo off
echo ============================================
echo  SHA'S WELDING - GitHub Push Script
echo ============================================
echo.

cd /d "c:\Users\91934\Downloads\sha's welding and tinkery works"

echo [1/5] Initializing git...
git init

echo [2/5] Setting remote origin...
git remote remove origin 2>nul
git remote add origin https://github.com/IrfanCodesPro/-shas-welding-tinkery-works.git

echo [3/5] Staging all files...
git add .

echo [4/5] Creating commit...
git commit -m "Initial commit - SHA's Welding and Tinkery Works"

echo [5/5] Pushing to GitHub...
git branch -M main
git push -u origin main

echo.
echo ============================================
echo  SUCCESS! Now opening Render to deploy...
echo ============================================
start https://dashboard.render.com/select-repo?type=static

pause
