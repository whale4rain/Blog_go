#!/usr/bin/env node

/**
 * API Connection Test Script
 *
 * This script tests the connection to the backend API and verifies
 * that the endpoints are accessible.
 */

const axios = require('axios');

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

console.log('\n🚀 Starting API Connection Test...\n');
console.log(`📍 Base URL: ${API_BASE_URL}\n`);

const tests = [
  {
    name: 'Health Check',
    method: 'GET',
    url: '/website/info',
    description: 'Check if backend is running',
  },
  {
    name: 'Get Article Categories',
    method: 'GET',
    url: '/article/category',
    description: 'Fetch article categories',
  },
  {
    name: 'Get Article Tags',
    method: 'GET',
    url: '/article/tags',
    description: 'Fetch article tags',
  },
  {
    name: 'Get Website Logo',
    method: 'GET',
    url: '/website/logo',
    description: 'Fetch website logo',
  },
  {
    name: 'Get Website Title',
    method: 'GET',
    url: '/website/title',
    description: 'Fetch website title',
  },
];

async function runTest(test) {
  try {
    const startTime = Date.now();
    const response = await axios({
      method: test.method,
      url: `${API_BASE_URL}${test.url}`,
      timeout: 5000,
    });
    const duration = Date.now() - startTime;

    if (response.data.code === 0) {
      console.log(`✅ ${test.name}`);
      console.log(`   ${test.description}`);
      console.log(`   Response time: ${duration}ms`);
      console.log(`   Status: Success (code: ${response.data.code})`);
      if (response.data.msg) {
        console.log(`   Message: ${response.data.msg}`);
      }
      return true;
    } else {
      console.log(`⚠️  ${test.name}`);
      console.log(`   ${test.description}`);
      console.log(`   Response time: ${duration}ms`);
      console.log(`   Status: API Error (code: ${response.data.code})`);
      console.log(`   Message: ${response.data.msg || 'No message'}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${test.name}`);
    console.log(`   ${test.description}`);

    if (error.response) {
      console.log(`   HTTP Status: ${error.response.status}`);
      console.log(`   Error: ${error.response.data?.msg || error.message}`);
    } else if (error.request) {
      console.log(`   Error: No response from server`);
      console.log(`   Make sure the backend is running on ${API_BASE_URL}`);
    } else {
      console.log(`   Error: ${error.message}`);
    }
    return false;
  } finally {
    console.log('');
  }
}

async function runAllTests() {
  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const result = await runTest(test);
    if (result) {
      passed++;
    } else {
      failed++;
    }
    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('━'.repeat(60));
  console.log('\n📊 Test Results:\n');
  console.log(`   Total Tests: ${tests.length}`);
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log('');

  if (failed === 0) {
    console.log('🎉 All tests passed! API is ready.\n');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed. Please check the backend.\n');
    console.log('💡 Tips:');
    console.log('   1. Make sure the backend server is running:');
    console.log('      cd server && go run main.go');
    console.log('   2. Check if the port 8080 is accessible');
    console.log('   3. Verify the database connection');
    console.log('   4. Check server logs: server/log/go_blog.log\n');
    process.exit(1);
  }
}

// Run tests
runAllTests().catch(error => {
  console.error('\n❌ Fatal error:', error.message);
  process.exit(1);
});
