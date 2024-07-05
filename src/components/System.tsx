import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import ReactECharts from 'echarts-for-react';

const socket = io('http://localhost:3000');

const RamUsageChart = () => {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [ramData, setRamData] = useState({ used: 0, total: 1 });
    const [chartData, setChartData] = useState<{value: number, name: string}[]>([]);

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
            { value: ramData.used / (1024 ** 3), name: 'Used RAM (GB)' },
        ]);
    }, [ramData]);

    const option = {
        title: {
            text: 'Live RAM Usage',
        },
        tooltip: {
            trigger: 'axis',
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
                data: chartData.map((data) => data.value),
                smooth: true,
            },
        ],
    };

    return <ReactECharts option={option} />;
};

export default RamUsageChart;
