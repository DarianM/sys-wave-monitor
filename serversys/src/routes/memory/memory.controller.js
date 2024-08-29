const si = require('systeminformation');

async function httpGetTotalMemory(req, res) {
    try {
        const { total } = await si.mem();
        const totalMem = (total / (1024 ** 3)).toFixed(2);
        req.app.locals.totalMem = totalMem;

        return  res.status(200).json({ totalMem });
      } catch (error) {
        console.error('Error fetching total RAM data:', error);
        res.status(500).send('Internal Server Error');
      }
}

module.exports = {
  httpGetTotalMemory,
};
