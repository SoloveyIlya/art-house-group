@echo off
echo 🚀 Art House WordPress Setup
echo ==============================

echo 📋 Checking MAMP status...
curl -s http://localhost:8888 > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ MAMP is not running. Please start MAMP first.
    echo    Open MAMP and click 'Start Servers'
    pause
    exit /b 1
)

echo ✅ MAMP is running

echo 📋 Checking database...
mysql -u root -proot -h localhost -P 8888 -e "SHOW DATABASES LIKE 'arthouse_wp';" | findstr arthouse_wp > nul
if %errorlevel% neq 0 (
    echo 📋 Creating database...
    mysql -u root -proot -h localhost -P 8888 -e "CREATE DATABASE arthouse_wp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    echo ✅ Database created
) else (
    echo ✅ Database already exists
)

echo 📋 Checking WordPress installation...
if not exist "wordpress\wp-config.php" (
    echo ❌ WordPress not configured. Please run WordPress installation first.
    echo    Go to: http://localhost:8888/art-house-group/wordpress-admin/wordpress/
    pause
    exit /b 1
)

echo ✅ WordPress is configured

echo 📋 Checking Art House Products plugin...
if not exist "wordpress\wp-content\plugins\arthouse-products\arthouse-products.php" (
    echo ❌ Plugin not found. Please check installation.
    pause
    exit /b 1
)

echo ✅ Plugin is installed

echo 📋 Testing API...
curl -s "http://localhost:8888/art-house-group/wordpress-admin/wordpress/wp-json/arthouse/v1/products" > temp_response.txt
findstr /C:"products" temp_response.txt > nul
if %errorlevel% equ 0 (
    echo ✅ API is working
) else (
    echo ⚠️  API might not be working properly
)
del temp_response.txt

echo.
echo 🎉 Setup complete!
echo.
echo 📝 Next steps:
echo 1. Go to WordPress admin: http://localhost:8888/art-house-group/wordpress-admin/wordpress/wp-admin/
echo 2. Activate 'Art House Products' plugin
echo 3. Add products in 'Продукты' menu
echo 4. Check your main site: http://localhost:8888/art-house-group/
echo.
echo 📚 For detailed instructions, see SETUP_INSTRUCTIONS.md
pause
