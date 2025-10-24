#!/bin/bash

echo "🚀 Art House WordPress Setup"
echo "=============================="

# Check if MAMP is running
echo "📋 Checking MAMP status..."
if ! curl -s http://localhost:8888 > /dev/null; then
    echo "❌ MAMP is not running. Please start MAMP first."
    echo "   Open MAMP and click 'Start Servers'"
    exit 1
fi

echo "✅ MAMP is running"

# Check if database exists
echo "📋 Checking database..."
DB_EXISTS=$(mysql -u root -proot -h localhost -P 8888 -e "SHOW DATABASES LIKE 'arthouse_wp';" | grep arthouse_wp)

if [ -z "$DB_EXISTS" ]; then
    echo "📋 Creating database..."
    mysql -u root -proot -h localhost -P 8888 -e "CREATE DATABASE arthouse_wp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    echo "✅ Database created"
else
    echo "✅ Database already exists"
fi

# Check WordPress installation
echo "📋 Checking WordPress installation..."
if [ ! -f "wordpress/wp-config.php" ]; then
    echo "❌ WordPress not configured. Please run WordPress installation first."
    echo "   Go to: http://localhost:8888/art-house-group/wordpress-admin/wordpress/"
    exit 1
fi

echo "✅ WordPress is configured"

# Check plugin
echo "📋 Checking Art House Products plugin..."
if [ ! -f "wordpress/wp-content/plugins/arthouse-products/arthouse-products.php" ]; then
    echo "❌ Plugin not found. Please check installation."
    exit 1
fi

echo "✅ Plugin is installed"

# Test API
echo "📋 Testing API..."
API_RESPONSE=$(curl -s "http://localhost:8888/art-house-group/wordpress-admin/wordpress/wp-json/arthouse/v1/products")

if [[ $API_RESPONSE == *"products"* ]] || [[ $API_RESPONSE == *"[]"* ]]; then
    echo "✅ API is working"
else
    echo "⚠️  API might not be working properly"
    echo "   Response: $API_RESPONSE"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Go to WordPress admin: http://localhost:8888/art-house-group/wordpress-admin/wordpress/wp-admin/"
echo "2. Activate 'Art House Products' plugin"
echo "3. Add products in 'Продукты' menu"
echo "4. Check your main site: http://localhost:8888/art-house-group/"
echo ""
echo "📚 For detailed instructions, see SETUP_INSTRUCTIONS.md"
