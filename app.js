const express = require('express');
const redis = require('redis');

// Create a Redis client and connect it to the Redis service in Kubernetes
const client = redis.createClient({
    host: 'cache-deployment',  // The service name of Redis as defined in cache-deployment.yaml
    port: 6379                 // Redis default port
});

client.on('error', (err) => {
    console.log('Error connecting to Redis', err);
});

const app = express();

// Route to store data in Redis
app.get('/set/:key/:value', (req, res) => {
    const { key, value } = req.params;

    client.set(key, value, (err, reply) => {
        if (err) {
            res.status(500).send('Error setting key in Redis');
        } else {
            res.send(`Key ${key} set with value ${value}`);
        }
    });
});

// Route to get data from Redis
app.get('/get/:key', (req, res) => {
    const { key } = req.params;

    client.get(key, (err, value) => {
        if (err) {
            res.status(500).send('Error getting key from Redis');
        } else if (value === null) {
            res.send(`Key ${key} does not exist`);
        } else {
            res.send(`Key ${key} has value ${value}`);
        }
    });
});

// Route for the homepage
app.get('/', (req, res) => {
    res.send('Hello World from Node.js app with Redis!');
});

app.listen(3000, () => {
    console.log('App running on port 3000');
});
