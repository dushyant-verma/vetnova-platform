const axios = require('axios');

async function test() {
  try {
    const res = await axios.get('http://localhost:5001/api/settings/footer');
    console.log("SUCCESS:", res.data);
  } catch (err) {
    console.error("ERROR:", err.response ? err.response.data : err.message);
  }
}
test();
