import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import ReactECharts from 'echarts-for-react';

const socket = io('http://localhost:3000');

const RamUsageChart = () => {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [ramData, setRamData] = useState({ used: 0, free: 0 });
    const [chartData, setChartData] = useState<{used: number, free: number}[]>([]);
    const [totalMemory, setTotalMemory] = useState(null);

    useEffect(() => {
        // Fetch total memory once on component mount
        fetch('http://localhost:3000/total',)
            .then(response => response.json())
            .then(data => setTotalMemory(data.total))
            .catch(error => console.error('Error fetching total memory:', error));
    }, []);

    useEffect(() => {
      socket.on('connect', () => {
        console.log('Socket connection established');
        setIsConnected(true);

        const interval = setInterval(() => {
            socket.emit('get-ram-usage');
        }, 1000);

        socket.on('disconnect', () => {
            clearInterval(interval);
            console.log('Socket connection closed');
        });
    });

    socket.on('ram-usage', (data) => {
        setRamData(data);
    });

    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });

    // return () => {
    //     socket.close();
    // };
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
