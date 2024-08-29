import { useEffect, useState } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import { RamUsageEvent } from '../interfaces/types';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import moment from 'moment';

const MemoryChart = () => {
    const [ramData, setRamData] = useState<{used: number, free: number, time: string}[]>([]);
    const [chartData, setChartData] = useState<{used: number, free: number, time: string}[]>([]);
    const [timeRange, setTimeRange] = useState(60); // default to last 60 seconds
    const { addEventListener } = useWebSocket();

    useEffect(() => {
        addEventListener('ram-usage', (message: RamUsageEvent) => {
            setRamData((prevState) => {
                const { used, free } = message.data;
                return [ ...prevState, { used, free, time: new Date().toISOString() }];
            });
        });
    }, []);

    useEffect(() => {
        setChartData(ramData.slice(timeRange * -1));
    }, [ramData, timeRange]);

    const option = {
        color: ['#00DDFF', '#80FFA5'],
        title: {
            text: 'RAM Usage',
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
            data: ['In use', 'Available'],
        },
        xAxis: {
            type: 'time',
            boundaryGap: false,
            axisLabel: {
                formatter: (function(value: number){ //timestamp
                    return moment(value).format('HH:mm:ss');
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
                name: 'In use',
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
                name: 'Available',
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
        <>
            <div>
                <button onClick={() => setTimeRange(60)}>Last 60 seconds</button>
                <button onClick={() => setTimeRange(300)}>Last 300 seconds</button>
                <button onClick={() => setTimeRange(Infinity)}>Total</button>
            </div>
            <ReactECharts option={option} />
        </>
    )
}
export default MemoryChart;
