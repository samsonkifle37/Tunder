const axios = require('axios');
const { parse } = require('csv-parse/sync');
const Draw = require('../models/Draw');

// URL provided by user
const CSV_URL = 'https://lottery.merseyworld.com/cgi-bin/lottery?days=10&Machine=Z&Ballset=0&order=1&show=1&year=0&display=CSV';

const SEED_DATA = [
    { drawId: 3813, date: "2025-12-06", numbers: [11, 30, 31, 36, 39], thunderball: 1 },
    { drawId: 3812, date: "2025-12-05", numbers: [3, 10, 17, 21, 27], thunderball: 11 },
    { drawId: 3811, date: "2025-12-03", numbers: [4, 6, 9, 21, 32], thunderball: 7 },
    { drawId: 3810, date: "2025-12-02", numbers: [11, 13, 32, 33, 36], thunderball: 8 },
    { drawId: 3809, date: "2025-11-29", numbers: [4, 5, 6, 13, 32], thunderball: 3 }
];

exports.fetchAndParseData = async () => {
    try {
        console.log('Fetching data from:', CSV_URL);
        const response = await axios.get(CSV_URL, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
            timeout: 10000
        });

        let csvData = response.data;
        if (typeof csvData === 'string') {
            csvData = csvData.replace(/<[^>]*>/g, '').trim();
            const lines = csvData.split('\n');
            const cleanLines = lines.filter(l => l.trim().length > 0 && (l.includes('No.') || /^\d/.test(l.trim())));
            csvData = cleanLines.join('\n');
        }

        const records = parse(csvData, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
            relax_column_count: true,
            relax_quotes: true
        });

        const validDraws = records.map(record => {
            const getKey = (key) => Object.keys(record).find(k => k.trim() === key) || key;
            const drawId = parseInt(record[getKey('No.')]);
            if (isNaN(drawId)) return null;

            const day = record[getKey('DD')];
            const month = record[getKey('MMM')];
            const year = record[getKey('YYYY')];
            const date = `${year}-${month}-${day}`;

            const numbers = [
                parseInt(record[getKey('N1')]),
                parseInt(record[getKey('N2')]),
                parseInt(record[getKey('N3')]),
                parseInt(record[getKey('N4')]),
                parseInt(record[getKey('N5')])
            ].filter(n => !isNaN(n));

            let thunderball = parseInt(record[getKey('TN')]);
            if (isNaN(thunderball)) thunderball = 0;

            return {
                drawId,
                date,
                numbers,
                thunderball
            };
        }).filter(d => d && d.numbers.length === 5 && d.drawId >= 965);

        if (validDraws.length === 0) throw new Error("No valid draws found");

        console.log(`Parsed ${validDraws.length} draws. Syncing to DB...`);

        // Bulk Upsert
        const operations = validDraws.map(draw => ({
            updateOne: {
                filter: { drawId: draw.drawId },
                update: { $set: draw },
                upsert: true
            }
        }));

        if (operations.length > 0) {
            await Draw.bulkWrite(operations);
        }

        return validDraws;

    } catch (error) {
        console.error('Data Fetch/Parse Error:', error.message);
        console.warn('Using Seed Data due to error.');
        // Upsert seed data if DB is empty? Or just return it. 
        // For safety, let's try to upsert seeds too.
        const seedOps = SEED_DATA.map(draw => ({
            updateOne: {
                filter: { drawId: draw.drawId },
                update: { $set: draw },
                upsert: true
            }
        }));
        await Draw.bulkWrite(seedOps);
        return SEED_DATA;
    }
};

exports.getData = async () => {
    try {
        const draws = await Draw.find({}).sort({ drawId: -1 }).lean();
        if (draws.length === 0) {
            return await exports.fetchAndParseData(); // Fetch if empty
        }
        return draws;
    } catch (error) {
        console.error('DB Fetch Error:', error);
        throw error;
    }
};
