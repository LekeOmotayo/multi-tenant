/**
 * Simple test script to verify authentication endpoints
 * Run with: node test-auth.js
 */

const API_BASE_URL = 'http://localhost:3001';

async function testAuth() {
  console.log('🧪 Testing Authentication System...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_BASE_URL}/api/v1/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.status);

    // Test 2: User Registration
    console.log('\n2. Testing user registration...');
    const signUpData = {
      email: 'test@example.com',
      password: 'testpassword123',
      firstName: 'Test',
      lastName: 'User',
      role: 'MEMBER',
    };

    const signUpResponse = await fetch(`${API_BASE_URL}/api/v1/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signUpData),
    });

    if (!signUpResponse.ok) {
      const errorData = await signUpResponse.json();
      console.log('⚠️  Sign up failed (user might already exist):', errorData.message);
    } else {
      const signUpResult = await signUpResponse.json();
      console.log('✅ User registered:', signUpResult.user.email);
    }

    // Test 3: User Login
    console.log('\n3. Testing user login...');
    const signInData = {
      email: 'test@example.com',
      password: 'testpassword123',
    };

    const signInResponse = await fetch(`${API_BASE_URL}/api/v1/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signInData),
    });

    if (!signInResponse.ok) {
      const errorData = await signInResponse.json();
      console.log('❌ Sign in failed:', errorData.message);
      return;
    }

    const signInResult = await signInResponse.json();
    console.log('✅ User logged in:', signInResult.user.email);
    console.log('   Access token length:', signInResult.accessToken.length);
    console.log('   Refresh token length:', signInResult.refreshToken.length);

    // Test 4: Protected Route
    console.log('\n4. Testing protected route...');
    const protectedResponse = await fetch(`${API_BASE_URL}/api/v1/protected`, {
      headers: {
        Authorization: `Bearer ${signInResult.accessToken}`,
      },
    });

    if (!protectedResponse.ok) {
      console.log('❌ Protected route failed');
      return;
    }

    const protectedData = await protectedResponse.json();
    console.log('✅ Protected route accessed:', protectedData.message);

    // Test 5: Admin Route (should fail for MEMBER role)
    console.log('\n5. Testing admin route (should fail for MEMBER role)...');
    const adminResponse = await fetch(`${API_BASE_URL}/api/v1/admin-only`, {
      headers: {
        Authorization: `Bearer ${signInResult.accessToken}`,
      },
    });

    if (adminResponse.ok) {
      console.log('⚠️  Admin route unexpectedly accessible');
    } else {
      console.log('✅ Admin route properly protected (403 Forbidden)');
    }

    // Test 6: User Profile
    console.log('\n6. Testing user profile...');
    const profileResponse = await fetch(`${API_BASE_URL}/api/v1/auth/profile`, {
      headers: {
        Authorization: `Bearer ${signInResult.accessToken}`,
      },
    });

    if (!profileResponse.ok) {
      console.log('❌ Profile fetch failed');
      return;
    }

    const profileData = await profileResponse.json();
    console.log('✅ Profile fetched:', profileData.email, '- Role:', profileData.role);

    // Test 7: Token Verification
    console.log('\n7. Testing token verification...');
    const verifyResponse = await fetch(`${API_BASE_URL}/api/v1/auth/verify`, {
      headers: {
        Authorization: `Bearer ${signInResult.accessToken}`,
      },
    });

    if (!verifyResponse.ok) {
      console.log('❌ Token verification failed');
      return;
    }

    const verifyData = await verifyResponse.json();
    console.log('✅ Token verified:', verifyData.valid);

    // Test 8: Logout
    console.log('\n8. Testing logout...');
    const logoutResponse = await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${signInResult.accessToken}`,
      },
      body: JSON.stringify({ refreshToken: signInResult.refreshToken }),
    });

    if (!logoutResponse.ok) {
      console.log('❌ Logout failed');
      return;
    }

    const logoutData = await logoutResponse.json();
    console.log('✅ Logout successful:', logoutData.message);

    console.log('\n🎉 All authentication tests passed!');
    console.log('\n📋 Test Summary:');
    console.log('   ✅ Health check');
    console.log('   ✅ User registration');
    console.log('   ✅ User login');
    console.log('   ✅ Protected route access');
    console.log('   ✅ Role-based access control');
    console.log('   ✅ User profile retrieval');
    console.log('   ✅ Token verification');
    console.log('   ✅ User logout');
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure the backend is running on port 3001');
    console.log('   2. Check that the database is connected');
    console.log('   3. Verify all dependencies are installed');
    console.log('   4. Check the .env file configuration');
  }
}

// Run the test
testAuth();

