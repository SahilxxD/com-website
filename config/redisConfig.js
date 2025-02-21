const { createClient } = require('redis');

const redisClient = createClient();

redisClient.on('error', (err) => {
    console.error('❌ Redis connection error:', err);
});

redisClient.on('connect', () => {
    console.log('✅ Redis connected successfully!');
});

(async () => {
    await redisClient.connect();
})();

module.exports = redisClient;
