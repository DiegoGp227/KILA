/**
 * Utility to test and debug localStorage
 * Open browser console and run: testLocalStorage()
 */

export function testLocalStorage() {
  if (typeof window === 'undefined') {
    console.log('❌ Not in browser environment');
    return;
  }

  console.log('🔍 Testing localStorage...');

  // Check if localStorage is available
  try {
    const testKey = 'test_storage';
    localStorage.setItem(testKey, 'test_value');
    const value = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);

    if (value === 'test_value') {
      console.log('✅ localStorage is working');
    } else {
      console.log('❌ localStorage read/write failed');
      return;
    }
  } catch (error) {
    console.log('❌ localStorage not available:', error);
    return;
  }

  // Check for validations
  const STORAGE_KEY = 'kila_validations';
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    console.log('⚠️  No validations found in localStorage');
    console.log('📝 Upload a JSON file to create your first validation');
    return;
  }

  try {
    const validations = JSON.parse(data);
    console.log(`✅ Found ${validations.length} validation(s) in localStorage`);
    console.log('📊 Validations:', validations);

    // Show stats
    const approved = validations.filter((v: any) => v.status === 'approved').length;
    const rejected = validations.filter((v: any) => v.status === 'rejected').length;
    const warning = validations.filter((v: any) => v.status === 'warning').length;

    console.log('📈 Stats:', {
      total: validations.length,
      approved,
      rejected,
      warning,
    });

  } catch (error) {
    console.log('❌ Error parsing validations:', error);
  }
}

// Make it available globally for testing in console
if (typeof window !== 'undefined') {
  (window as any).testLocalStorage = testLocalStorage;
}
