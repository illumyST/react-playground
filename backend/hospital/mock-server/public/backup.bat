
@echo off
setlocal enabledelayedexpansion

REM === 路徑設定（建議使用反斜線 \）===
set "source=..\apis"
set "sourceScenarios=..\scenarios"
set "backupDir=."

REM === 日期時間字串（處理時間前導空白）===
REM 將 TIME 的前導空白轉為 0，避免資料夾名出現前導空格
set "timeSanitized=%TIME: =0%"
set "dateStr=%DATE:~0,4%%DATE:~5,2%%DATE:~8,2%_%timeSanitized:~0,2%%timeSanitized:~3,2%%timeSanitized:~6,2%"

REM === 目的備份資料夾（變數本身不帶引號）===
set "backupFolder=%backupDir%\backup_%dateStr%"

REM 確保備份根目錄存在
if not exist "%backupDir%" mkdir "%backupDir%"

REM 執行備份（/MIR：鏡像；/Z：斷點續傳；/R:1 /W:1：失敗時重試 1 次，等待 1 秒）
robocopy "%source%" "%backupFolder%" /MIR /Z /R:1 /W:1
robocopy "%sourceScenarios%" "%backupFolder%\scenarios" /MIR /Z /R:1 /W:1

echo Backup completed: "%backupFolder%"

REM === 保留最近 10 筆備份，其餘刪除 ===
set "retainCount=10"

REM 僅列出目錄（/ad），名稱簡潔（/b），依日期倒序（/o-d）
for /f "skip=%retainCount% delims=" %%A in ('dir /b /ad /o-d "%backupDir%\backup_*"') do (
    echo Deleting old backup: "%%A"
    rmdir /s /q "%backupDir%\%%A"
)

echo Cleanup completed. Only the latest %retainCount% backups are kept.

endlocal
