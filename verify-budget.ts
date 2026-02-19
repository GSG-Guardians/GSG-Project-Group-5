// Verification script using raw fetch
const API_URL = 'http://localhost:3000/api/v1';

async function verify() {
  try {
    // 1. Login
    console.log('Logging in...');
    const loginRes = await fetch(`${API_URL}/auth/email/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'moaamenalyazouri@gmail.com',
        password: '123456',
      }),
    });

    if (!loginRes.ok) {
      throw new Error(
        `Login failed: ${loginRes.status} ${await loginRes.text()}`,
      );
    }

    const loginData = await loginRes.json();
    const token = loginData.token; // Inspect login response structure if needed, usually token or accessToken
    console.log('Login successful.');

    // 2. Call Suggest Budget
    console.log('Requesting budget suggestion...');
    const suggestRes = await fetch(`${API_URL}/ai/suggest-budget`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token.accessToken || token}`, // Adjust based on actual response
        'Content-Type': 'application/json',
      },
    });

    if (!suggestRes.ok) {
      throw new Error(
        `Suggest budget failed: ${suggestRes.status} ${await suggestRes.text()}`,
      );
    }

    const suggestion = await suggestRes.json();
    console.log('Budget Suggestion Received:');
    console.log(JSON.stringify(suggestion, null, 2));

    // Validation
    if (!suggestion.data || !Array.isArray(suggestion.data)) {
      throw new Error('Response format invalid: missing "data" array');
    }

    if (suggestion.data.length > 0) {
      const first = suggestion.data[0];
      if (
        typeof first.amount !== 'number' ||
        typeof first.percentage !== 'number'
      ) {
        throw new Error('Response item format invalid');
      }
    }

    console.log('Verification PASSED!');
  } catch (e) {
    console.error('Verification FAILED:', e);
    process.exit(1);
  }
}

verify();
