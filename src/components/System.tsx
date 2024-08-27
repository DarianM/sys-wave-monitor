import { useCallback, useEffect, useReducer, useState } from 'react';
import Header from './Header';
import FilterBar from './FilterBar';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import moment from 'moment';
import { MessageData } from '../interfaces/types';
import './System.css';

const socket = new WebSocket('ws://localhost:8080');

const RamUsageChart = () => {
    const [processes, setProcesses] = useState<{ name: string, mem: number, pid: number}[]>([]);
    const [ramData, setRamData] = useState<{used: number, free: number, time: string}[]>([]);
    const [chartData, setChartData] = useState<{used: number, free: number, time: string}[]>([]);
    const [timeRange, setTimeRange] = useState(60); // default to last 60 seconds
    const [query, setQueryProcesses] = useState('');

    const [memory, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case 'SORT_BY':
                return { ...state, sortBy: action.payload, sortOrder: action.payload === state.sortBy && state.sortOrder === 'asc' ? 'desc' : 'asc' };
            default:
                return state;
        }
    }, { sortBy: 'mem', sortOrder: 'desc' });

    useEffect(() => {
      socket.onopen = () => {
        console.log('Socket connection established');

        setInterval(() => { 
            socket.send(JSON.stringify({ event: 'get-ram-usage' }));
            socket.send(JSON.stringify({ event: 'get-processes' }));
        }, 1000);
    };

    socket.onmessage = (event) => {
        const message: MessageData = JSON.parse(event.data);
        if (message.event === 'ram-usage') {
            setRamData((prevData) => {
                const { used, free } = message.data;
                return [ ...prevData, { used, free, time: new Date().toISOString() }];
            });
        }
        if (message.event === 'processes') {
            // responsable only with setting processes
            setProcesses(message.data);
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

    const sorting = useCallback((processes: { name: string, mem: number, pid: number}[]) => {
        if(memory.sortBy === 'mem') {
            if (memory.sortOrder === 'asc') {
                return [...processes.sort((a, b) => a.mem - b.mem)];
            } else {
                return [...processes.sort((a, b) => b.mem - a.mem)];
            }
        } else {
            if (memory.sortOrder === 'asc') {
               return [...processes.sort((a, b) => a.name.localeCompare(b.name))];
            } else {
               return [...processes.sort((a, b) => b.name.localeCompare(a.name))];
            }
        }
    }, [memory.sortBy, memory.sortOrder]);

    const filter = useCallback((processes: { name: string, mem: number, pid: number}[]) => {
        return processes.filter(process => process.name.toLowerCase().includes(query.toLowerCase()));
    }, [query]);

    return (
        <div>
            <Header />
            <div>
                <button onClick={() => setTimeRange(60)}>Last 60 seconds</button>
                <button onClick={() => setTimeRange(300)}>Last 300 seconds</button>
                <button onClick={() => setTimeRange(Infinity)}>Total</button>
            </div>
            <ReactECharts option={option} />


            {/* Add a table to display processes */}
            {processes.length > 0 && (
                <div>
                    <h3>Running Processes top50</h3>
                    <FilterBar query={query} setQuery={setQueryProcesses}/>
                    <div className="table">
                        <div className="row heading">
                            <div className="cell" onClick={() => dispatch({ type: 'SORT_BY', payload: 'name' })}>Process Name</div>
                            <div className="cell" onClick={() => dispatch({ type: 'SORT_BY', payload: 'mem' })}>Memory Usage (MB)</div>
                        </div>
                        {filter(sorting(processes)).map(process => (
                            <>
                                <div key = {process.pid} className="row">
                                    <div className="cell">{process.name}</div>
                                    <div className="cell">{process.mem}</div>
                                </div>
                            </>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default RamUsageChart;
