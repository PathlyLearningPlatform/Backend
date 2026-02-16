REM filepath: /home/kamil/dev/projects/pathly/backend/scripts/win/setup-env.bat
@echo off

set "microservices=infra\auth infra\auth\db infra\reverse-proxy services\api-gateway services\learning-paths services\learning-paths\db"

for %%i in (%microservices%) do (
    echo Setting up env for %%i...
    copy /Y "..\..\%%i\.env.example" "..\..\%%i\.env" >nul
)