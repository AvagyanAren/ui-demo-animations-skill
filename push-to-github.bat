@echo off
cd /d "%~dp0"

where git >nul 2>nul
if errorlevel 1 goto nogit

if not exist .git git init
git checkout -B main
git config user.email "vitaliy@tamchysfit.com"
git config user.name "Aren"
git add -A
git commit -m "UI Demo Animations skill"
git remote remove origin
git remote add origin https://github.com/AvagyanAren/ui-demo-animations-skill.git

echo.
echo Pushing to GitHub. If a sign-in window opens, sign in.
echo.
git push -u origin main
if errorlevel 1 goto failed
echo.
echo DONE: pushed to https://github.com/AvagyanAren/ui-demo-animations-skill
pause
exit /b 0

:failed
echo.
echo Normal push failed. The repository probably already has files (for example a README created on GitHub).
set /p FORCE=Type y and Enter to REPLACE repository contents, or just Enter to cancel: 
if /i "%FORCE%"=="y" git push -u origin main --force
echo.
pause
exit /b 1

:nogit
echo Git is not installed. Install it from https://git-scm.com and run this file again.
pause
exit /b 1
