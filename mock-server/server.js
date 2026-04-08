
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 8081;
const DB_FILE = path.join(__dirname, 'db.json');

const server = http.createServer((req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.url.startsWith('/bookings') && req.method === 'GET') {
        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
        const page = parseInt(parsedUrl.searchParams.get('page')) || 1;
        const limit = parseInt(parsedUrl.searchParams.get('limit')) || 10;

        fs.readFile(DB_FILE, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
                return;
            }

            try {
                const jsonData = JSON.parse(data);
                const allBookings = jsonData.bookings;

                // Pagination logic
                const startIndex = (page - 1) * limit;
                const endIndex = page * limit;
                const paginatedBookings = allBookings.slice(startIndex, endIndex);

                // Calculate stats
                const stats = {
                    total: allBookings.length,
                    pending: allBookings.filter(b => b.status === "pending").length,
                    confirmed: allBookings.filter(b => b.status === "confirmed").length,
                    scheduled: allBookings.filter(b => b.status === "scheduled").length,
                    completed: allBookings.filter(b => b.status === "completed").length,
                    cancelled: allBookings.filter(b => b.status === "cancelled" || b.status === "no_show").length,
                };

                const response = {
                    data: paginatedBookings,
                    total: allBookings.length,
                    page,
                    limit,
                    totalPages: Math.ceil(allBookings.length / limit),
                    stats
                };

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(response));
            } catch (parseErr) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error parsing data' }));
            }
        });
    } else if (req.url.startsWith('/trust-history') && req.method === 'GET') {
        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
        const page = parseInt(parsedUrl.searchParams.get('page')) || 1;
        const limit = parseInt(parsedUrl.searchParams.get('limit')) || 10;

        fs.readFile(DB_FILE, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
                return;
            }

            try {
                const jsonData = JSON.parse(data);
                const allHistory = jsonData.trust_history || [];

                // Pagination logic
                const startIndex = (page - 1) * limit;
                const endIndex = page * limit;
                const paginatedHistory = allHistory.slice(startIndex, endIndex);

                const response = {
                    data: paginatedHistory,
                    total: allHistory.length,
                    page,
                    limit,
                    totalPages: Math.ceil(allHistory.length / limit)
                };

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(response));
            } catch (parseErr) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error parsing data' }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

server.listen(PORT, () => {
    console.log(`Mock server running at http://localhost:${PORT}/bookings`);
});
