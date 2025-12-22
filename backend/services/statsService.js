const dataService = require('./dataService');


const calculateFrequencies = (draws) => {
    const mainFreq = {};
    const thunderballFreq = {};

    // Initialize frequencies
    for (let i = 1; i <= 39; i++) mainFreq[i] = 0;
    for (let i = 1; i <= 14; i++) thunderballFreq[i] = 0;

    draws.forEach(draw => {
        draw.numbers.forEach(num => {
            if (mainFreq[num] !== undefined) mainFreq[num]++;
        });
        if (thunderballFreq[draw.thunderball] !== undefined) {
            thunderballFreq[draw.thunderball]++;
        }
    });

    return { mainFreq, thunderballFreq };
};

const getHotCold = (freq, count, type = 'main') => {
    const sorted = Object.entries(freq)
        .sort((a, b) => b[1] - a[1]); // Descending frequency

    const hot = sorted.slice(0, count).map(([num, count]) => ({ number: parseInt(num), count }));
    const cold = sorted.slice(-count).map(([num, count]) => ({ number: parseInt(num), count }));

    return { hot, cold };
};

exports.calculateStats = async () => {
    try {
        const draws = await dataService.getData();

        const { mainFreq, thunderballFreq } = calculateFrequencies(draws);

        const mainStats = getHotCold(mainFreq, 5, 'main');
        const thunderballStats = getHotCold(thunderballFreq, 3, 'thunderball');

        return {
            totalDraws: draws.length,
            lastDraw: draws[0],
            recentDraws: draws.slice(0, 5),
            mainstats: {
                frequency: mainFreq,
                hot: mainStats.hot,
                cold: mainStats.cold
            },
            thunderballStats: {
                frequency: thunderballFreq,
                hot: thunderballStats.hot,
                cold: thunderballStats.cold
            }
        };
    } catch (error) {
        if (error.code === 'ENOENT') {
            return { error: 'No data available. Please refresh data.' };
        }
        throw error;
    }
};
