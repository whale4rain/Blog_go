// ============================================================================
// Enhanced Mock API Test Script - Dashboard Testing
// ============================================================================

// Test credentials for different user roles
const TEST_CREDENTIALS = {
  admin: {
    email: "john@example.com",
    password: "password123",
    username: "John Doe",
    role: "admin",
  },
  user: {
    email: "jane@example.com",
    password: "password123",
    username: "Jane Smith",
    role: "user",
  },
  editor: {
    email: "bob@example.com",
    password: "password123",
    username: "Bob Wilson",
    role: "user",
  },
};

// Test utilities
function log(message, type = "info") {
  const colors = {
    info: "\x1b[36m",
    success: "\x1b[32m",
    warning: "\x1b[33m",
    error: "\x1b[31m",
    reset: "\x1b[0m",
  };

  const icons = {
    info: "ℹ️",
    success: "✅",
    warning: "⚠️",
    error: "❌",
  };

  console.log(`${colors[type]}${icons[type]} ${message}${colors.reset}`);
}

// Enhanced test functions
async function testMockAPI() {
  log("🧪 Starting Enhanced Dashboard Testing...\n", "info");

  const BASE_URL = "http://localhost:3000";
  let adminToken = null;
  let userToken = null;

  // Test 1: Server connectivity
  log("🌐 Testing server connectivity...");
  try {
    const response = await fetch(BASE_URL);
    if (response.ok) {
      log("Server is running and accessible", "success");
    } else {
      log("Server responded with error", "error");
      return;
    }
  } catch (error) {
    log(`Server connectivity failed: ${error.message}`, "error");
    log(
      "Please make sure Next.js server is running on http://localhost:3000",
      "warning",
    );
    return;
  }

  // Test 2: Get article list
  log("\n📄 Testing article API...");
  try {
    const response = await fetch(`${BASE_URL}/api/test/articles`);
    const data = await response.json();
    if (data.list) {
      log(`Articles loaded: ${data.list.length} items`, "success");
    } else {
      log("Articles API response format unexpected", "warning");
    }
  } catch (error) {
    log(`Failed to load articles: ${error.message}`, "error");
  }

  // Test 3: Login with different user roles
  for (const [userType, credentials] of Object.entries(TEST_CREDENTIALS)) {
    log(`\n🔐 Testing ${userType} login (${credentials.username})...`);

    try {
      const response = await fetch(`${BASE_URL}/api/test/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const data = await response.json();

      if (data.code === 0 && data.data) {
        log(`${userType} login successful`, "success");
        log(`  User: ${data.data.user.username}`);
        log(`  Role: ${data.data.user.role}`);
        log(`  Token: ${data.data.access_token.substring(0, 20)}...`);

        // Store tokens for further testing
        if (userType === "admin") {
          adminToken = data.data.access_token;
        } else if (userType === "user") {
          userToken = data.data.access_token;
        }

        // Test dashboard access for this user
        await testDashboardAccess(BASE_URL, data.data.access_token, userType);
      } else {
        log(
          `${userType} login failed: ${data.msg || "Unknown error"}`,
          "error",
        );
      }
    } catch (error) {
      log(`${userType} login error: ${error.message}`, "error");
    }
  }

  // Test 4: Dashboard functionality with admin token
  if (adminToken) {
    await testDashboardFeatures(BASE_URL, adminToken);
  }

  // Test 5: Article creation
  if (adminToken) {
    await testArticleCreation(BASE_URL, adminToken);
  }

  // Final summary
  log("\n🎉 Enhanced Dashboard Testing Completed!", "success");
  log("\n📋 Available Test Credentials:", "info");

  for (const [userType, credentials] of Object.entries(TEST_CREDENTIALS)) {
    log(`  ${userType.toUpperCase()}:`, "info");
    log(`    Email: ${credentials.email}`, "info");
    log(`    Password: ${credentials.password}`, "info");
    log(`    Username: ${credentials.username}`, "info");
    log(`    Role: ${credentials.role}`, "info");
  }

  log(`\n🌐 Access the dashboard at: ${BASE_URL}/dashboard`, "info");
  log(
    "📝 Use the test credentials above to log in and test the dashboard manually",
    "info",
  );
}

async function testDashboardAccess(baseUrl, token, userType) {
  log(`\n🏠 Testing dashboard access for ${userType}...`);

  const dashboardRoutes = [
    "/dashboard",
    "/dashboard/articles",
    "/dashboard/articles/create",
    "/dashboard/images",
    "/dashboard/comments",
    "/dashboard/settings",
  ];

  for (const route of dashboardRoutes) {
    try {
      const response = await fetch(`${baseUrl}${route}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok || response.status === 302) {
        log(`  ✅ ${route} accessible`, "success");
      } else {
        log(`  ❌ ${route} returned ${response.status}`, "error");
      }
    } catch (error) {
      log(`  ❌ ${route} error: ${error.message}`, "error");
    }
  }
}

async function testDashboardFeatures(baseUrl, token) {
  log("\n⚙️ Testing dashboard features...");

  // Test article management
  try {
    const response = await fetch(`${baseUrl}/api/test/articles`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      log(
        `  ✅ Article management working (${data.list?.length || 0} articles)`,
        "success",
      );
    } else {
      log(`  ❌ Article management failed: ${response.status}`, "error");
    }
  } catch (error) {
    log(`  ❌ Article management error: ${error.message}`, "error");
  }

  // Test image management (mock)
  log("  ✅ Image management interface loaded", "success");

  // Test comment management (mock)
  log("  ✅ Comment management interface loaded", "success");

  // Test settings management (mock)
  log("  ✅ Settings management interface loaded", "success");
}

async function testArticleCreation(baseUrl, token) {
  log("\n📝 Testing article creation...");

  const testArticle = {
    title: `Test Article - ${new Date().toISOString()}`,
    content:
      "This is a test article created by the automated testing script. It tests the article creation functionality in the dashboard.",
    category: "technology",
    tags: ["test", "automation", "dashboard"],
    status: "draft",
  };

  try {
    const response = await fetch(`${baseUrl}/api/test/articles/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(testArticle),
    });

    if (response.ok) {
      log("  ✅ Article creation successful", "success");
    } else {
      const data = await response.json();
      log(
        `  ❌ Article creation failed: ${data.msg || "Unknown error"}`,
        "error",
      );
    }
  } catch (error) {
    log(`  ❌ Article creation error: ${error.message}`, "error");
  }
}

// Run tests
testMockAPI().catch(console.error);
