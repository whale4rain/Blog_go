// ============================================================================
// Mock API Test Script
// ============================================================================

// Test credentials
const TEST_CREDENTIALS = {
  admin: {
    email: 'admin@blog.com',
    password: 'admin123',
  },
  user: {
    email: 'john@example.com',
    password: 'password123',
  },
};

// Test functions
async function testMockAPI() {
  console.log('🧪 Testing Mock API...\n');

  // Test 1: Get article list
  console.log('📄 Testing getArticleList...');
  try {
    const response = await fetch('http://localhost:3000/api/test/articles');
    const data = await response.json();
    console.log('✅ Articles loaded:', data.list?.length || 0);
  } catch (error) {
    console.log('❌ Failed to load articles:', error.message);
  }

  // Test 2: Login with admin credentials
  console.log('\n🔐 Testing admin login...');
  try {
    const response = await fetch('http://localhost:3000/api/test/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(TEST_CREDENTIALS.admin),
    });
    const data = await response.json();
    if (data.code === 0) {
      console.log('✅ Admin login successful');
      console.log('👤 User:', data.data.user.username);
    } else {
      console.log('❌ Admin login failed:', data.msg);
    }
  } catch (error) {
    console.log('❌ Login error:', error.message);
  }

  // Test 3: Login with user credentials
  console.log('\n🔐 Testing user login...');
  try {
    const response = await fetch('http://localhost:3000/api/test/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(TEST_CREDENTIALS.user),
    });
    const data = await response.json();
    if (data.code === 0) {
      console.log('✅ User login successful');
      console.log('👤 User:', data.data.user.username);
    } else {
      console.log('❌ User login failed:', data.msg);
    }
  } catch (error) {
    console.log('❌ Login error:', error.message);
  }

  console.log('\n🎉 Mock API test completed!');
  console.log('\n📋 Test Credentials:');
  console.log('Admin:', TEST_CREDENTIALS.admin);
  console.log('User:', TEST_CREDENTIALS.user);
  console.log('\n🌐 Access the application at: http://localhost:3000');
}

// Run tests
testMockAPI().catch(console.error);
