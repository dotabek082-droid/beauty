import http from 'http';

http.get('http://localhost:8081/trust-history?page=1&limit=5', (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log(data);
    });
}).on('error', (err) => {
    console.error("Error: " + err.message);
});
