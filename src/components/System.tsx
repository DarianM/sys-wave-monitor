import { useEffect, useState } from 'react';
import moment from 'moment';
import ReactECharts from 'echarts-for-react';
import * as echarts from "echarts";

const socket = new WebSocket('ws://localhost:8080');

const RamUsageChart = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [ramData, setRamData] = useState<{used: number, free: number, time: string}[]>([]);
    const [chartData, setChartData] = useState<{used: number, free: number, time: string}[]>([]);
    const [totalMemory, setTotalMemory] = useState(null);
    const [timeRange, setTimeRange] = useState(60); // Default to last 60 seconds

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
            setRamData((prevData) => {
                const { used, free } = message.data;
                return [ ...prevData, { used, free, time: new Date().toISOString() }];
         });
        }
    };

    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
    }, []);

    useEffect(() => {
        setChartData(ramData.slice(timeRange * -1));
    }, [ramData, timeRange]);

    const option = {
        color: ['#00DDFF', '#80FFA5'],
        title: {
            text: 'Live RAM Usage',
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                  backgroundColor: '#6a7985'
                }
              }
        },
        legend: {
            data: ['Used RAM', 'Free RAM'],
        },
        xAxis: {
            type: 'time',
            boundaryGap: false,
            axisLabel: {
                formatter: (function(value: number){ //timestamp
                    return moment(value).format('mm\`ss\`\`');
                })
            }
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
                smooth: true,
                lineStyle: {
                    width: 2
                },
                showSymbol: false,
                areaStyle: {
                opacity: 0.8,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                        offset: 0,
                        color: 'rgb(0, 221, 255)'
                    },
                    {
                        offset: 1,
                        color: 'rgb(77, 119, 255)'
                    }])
                },
                emphasis: {
                    disabled: true
                },
                data: chartData.map((data) => [data.time, data.used]),
            },
            {
                name: 'Free RAM',
                type: 'line',
                smooth: true,
                lineStyle: {
                    width: 2
                },
                showSymbol: false,
                areaStyle: {
                opacity: 0.8,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                        offset: 0,
                        color: 'rgb(128, 255, 165)'
                    },
                    {
                        offset: 1,
                        color: 'rgb(1, 191, 236)'
                    }])
                },
                emphasis: {
                    disabled: true
                },
                data: chartData.map((data) => [data.time, data.free]),
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
            <div>
                <button onClick={() => setTimeRange(60)}>Last 60 seconds</button>
                <button onClick={() => setTimeRange(300)}>Last 300 seconds</button>
                <button onClick={() => setTimeRange(Infinity)}>Total</button>
            </div>
            <ReactECharts option={option} />
        </div>
    );
};

export default RamUsageChart;
