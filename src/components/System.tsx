import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';

const socket = new WebSocket('ws://localhost:8080');

const RamUsageChart = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [ramData, setRamData] = useState({ used: 0, free: 0 });
    const [chartData, setChartData] = useState<{used: number, free: number}[]>([]);
    const [totalMemory, setTotalMemory] = useState(null);

    useEffect(() => {
        // Fetch total memory once on component mount
        fetch('http://localhost:8080/total',)
            .then(response => response.json())
            .then(data => setTotalMemory(data.total))
            .catch(error => console.error('Error fetching total memory:', error));
    }, []);

    useEffect(() => {
      socket.onopen = () => {
        console.log('Socket connection established');
        setIsConnected(true);

        setInterval(() => { 
            socket.send(JSON.stringify({ event: 'get-ram-usage' }));
        }, 1000);
    };

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.event === 'ram-usage') {
            setRamData(message.data);
        }
    };

    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
    }, []);

    useEffect(() => {
        setChartData((prevData) => [
            ...prevData,
            {
                used: ramData.used / (1024 ** 3),  // 'Used RAM (GB)'
                free: ramData.free / (1024 ** 3),
            },
        ]);
    }, [ramData]);

    const option = {
        title: {
            text: 'Live RAM Usage',
        },
        tooltip: {
            trigger: 'axis',
        },
        legend: {
            data: ['Used RAM', 'Free RAM'],
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: Array.from({ length: chartData.length }, (_, i) => i + 1),
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} GB',
            },
        },
        series: [
            {
                name: 'Used RAM',
                type: 'line',
                data: chartData.map((data) => data.used),
                smooth: true,
            },
            {
                name: 'Free RAM',
                type: 'line',
                data: chartData.map((data) => data.free),
                smooth: true,
            },
        ],
    };

    return (
        <div>
            {totalMemory !== null && (
                <div>
                    <h3>Total Memory: {(totalMemory / (1024 ** 3)).toFixed(2)} GB</h3>
                </div>
            )}
            <ReactECharts option={option} />
        </div>
    );
};

export default RamUsageChart;
