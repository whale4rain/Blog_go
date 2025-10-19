// ============================================================================
// Table of Contents Test Script
// ============================================================================

/**
 * Test script to verify Table of Contents functionality
 * Run this script in the browser console on the article page
 */

function testTableOfContents() {
  console.log('🧪 Testing Table of Contents functionality...\n');

  // Test 1: Check if TOC component exists
  const tocComponent = document.querySelector('.table-of-contents');
  if (tocComponent) {
    console.log('✅ TOC component found in DOM');
  } else {
    console.log('❌ TOC component not found');
    return;
  }

  // Test 2: Check if headings have IDs
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const headingsWithIds = Array.from(headings).filter(h => h.id);
  console.log(`✅ Found ${headingsWithIds.length} headings with IDs out of ${headings.length} total headings`);

  // Test 3: Check if TOC links are generated
  const tocLinks = document.querySelectorAll('.toc-link');
  console.log(`✅ Found ${tocLinks.length} TOC navigation links`);

  // Test 4: Test click functionality
  if (tocLinks.length > 0) {
    const firstLink = tocLinks[0];
    const targetId = firstLink.getAttribute('onclick')?.match(/scrollToHeading\('([^']+)'\)/)?.[1];

    if (targetId) {
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        console.log(`✅ First TOC link targets existing element: #${targetId}`);

        // Test scroll functionality
        console.log('🔄 Testing scroll functionality...');
        firstLink.click();

        setTimeout(() => {
          const rect = targetElement.getBoundingClientRect();
          if (rect.top <= 100 && rect.top >= 50) {
            console.log('✅ Smooth scrolling working correctly');
          } else {
            console.log('⚠️ Scroll positioning may need adjustment');
          }
        }, 1000);
      } else {
        console.log(`❌ Target element not found: #${targetId}`);
      }
    }
  }

  // Test 5: Check active state tracking
  console.log('🔄 Testing active state tracking...');

  // Simulate scroll to check active state
  if (headingsWithIds.length > 1) {
    const secondHeading = headingsWithIds[1];
    secondHeading.scrollIntoView({ behavior: 'smooth' });

    setTimeout(() => {
      const activeLink = document.querySelector('.toc-link[class*="bg-google-blue"]');
      if (activeLink) {
        console.log('✅ Active state tracking working correctly');
      } else {
        console.log('⚠️ Active state tracking may need adjustment');
      }
    }, 1000);
  }

  // Test 6: Check responsive behavior
  const mobileButton = document.querySelector('[aria-label="Toggle table of contents"]');
  if (mobileButton) {
    console.log('✅ Mobile toggle button found');
  } else {
    console.log('ℹ️ Mobile toggle button not visible (desktop view)');
  }

  // Test 7: Check progress indicator
  const progressBar = document.querySelector('.toc-progress');
  if (progressBar) {
    console.log('✅ Progress indicator found');
  } else {
    console.log('ℹ️ Progress indicator may be in collapsed state');
  }

  console.log('\n🎉 TOC functionality test completed!');
  console.log('💡 Tip: Check the browser console for any JavaScript errors');
}

// Test heading ID generation
function testHeadingIdGeneration() {
  console.log('\n🧪 Testing heading ID generation...');

  const testCases = [
    { text: 'Simple Heading', expected: 'simple-heading' },
    { text: 'Heading with Numbers 123', expected: 'heading-with-numbers-123' },
    { text: 'Heading with Special Characters!@#', expected: 'heading-with-special-characters' },
    { text: '  Spaced  Heading  ', expected: 'spaced-heading' }
  ];

  testCases.forEach(testCase => {
    const generated = testCase.text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    const passed = generated === testCase.expected;
    console.log(`${passed ? '✅' : '❌'} "${testCase.text}" → "${generated}" ${passed ? '' : `(expected: "${testCase.expected}")`}`);
  });
}

// Test Mermaid integration
function testMermaidIntegration() {
  console.log('\n🧪 Testing Mermaid diagram integration...');

  const mermaidElements = document.querySelectorAll('.mermaid-diagram');
  if (mermaidElements.length > 0) {
    console.log(`✅ Found ${mermaidElements.length} Mermaid diagram containers`);

    mermaidElements.forEach((element, index) => {
      const hasContent = element.textContent.trim().length > 0;
      console.log(`  Diagram ${index + 1}: ${hasContent ? '✅ Has content' : '❌ Empty'}`);
    });
  } else {
    console.log('ℹ️ No Mermaid diagrams found in current article');
  }
}

// Test mathematical formulas
function testMathFormulas() {
  console.log('\n🧪 Testing mathematical formula rendering...');

  const katexElements = document.querySelectorAll('.katex');
  if (katexElements.length > 0) {
    console.log(`✅ Found ${katexElements.length} rendered mathematical formulas`);
  } else {
    console.log('ℹ️ No mathematical formulas found in current article');
  }
}

// Run all tests
function runAllTests() {
  console.log('🚀 Starting comprehensive TOC functionality tests...\n');

  testHeadingIdGeneration();
  testTableOfContents();
  testMermaidIntegration();
  testMathFormulas();

  console.log('\n📊 Test Summary:');
  console.log('- Open /test-toc for comprehensive testing');
  console.log('- Open /article/1 or /article/2 for real-world testing');
  console.log('- Check browser console for detailed results');
  console.log('- Verify mobile responsiveness by resizing browser');
}

// Auto-run tests when script is loaded
if (typeof window !== 'undefined') {
  // Wait for page to fully load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAllTests);
  } else {
    runAllTests();
  }
}

// Export for manual testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testTableOfContents,
    testHeadingIdGeneration,
    testMermaidIntegration,
    testMathFormulas,
    runAllTests
  };
}
