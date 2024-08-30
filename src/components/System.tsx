import { useCallback, useEffect, useReducer, useState } from 'react';
import Header from './Header';
import MemoryChart from './MemoryChart';
import FilterBar from './FilterBar';
import { useWebSocket } from '../context/WebSocketContext';
import { ProcessesEvent, SortByEnum, SortOrderEnum } from '../interfaces/types';
import sortLogo from '../assets/sort-down-svgrepo-com.svg';
import './System.css';

const System = () => {
    const [processes, setProcesses] = useState<{ name: string, mem: number, pid: number}[]>([]);
    const [query, setQueryProcesses] = useState<string>('');
    // @ts-ignore
    const { addEventListener } = useWebSocket();

    const [memory, dispatch] = useReducer((state: { sortBy: SortByEnum, sortOrder: SortOrderEnum }, action: { type: string, payload: SortByEnum }) => {
        switch (action.type) {
            case 'SORT_BY':
                return {
                    ...state, sortBy: action.payload, sortOrder: action.payload === state.sortBy
                    && state.sortOrder === SortOrderEnum.ASC ? SortOrderEnum.DESC : SortOrderEnum.ASC
                };
            default:
                return state;
        }
    }, { sortBy: SortByEnum.MEMORY, sortOrder: SortOrderEnum.DESC });

    useEffect(() => {
        addEventListener('processes', (message: ProcessesEvent) => {
            setProcesses(message.data);
        });
    }, []);

    const sorting = useCallback((processes: { name: string, mem: number, pid: number}[]) => {
        if(memory.sortBy === SortByEnum.MEMORY) {
            if (memory.sortOrder === SortOrderEnum.ASC) {
                return [...processes.sort((a, b) => a.mem - b.mem)];
            } else {
                return [...processes.sort((a, b) => b.mem - a.mem)];
            }
        } else {
            if (memory.sortOrder === SortOrderEnum.ASC) {
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
        <>
            <Header />
            <MemoryChart />
            {processes.length > 0 && (
                <div>
                    <h3>Running Processes top50</h3>
                    <FilterBar query={query} setQuery={setQueryProcesses}/>
                    <div className="table">
                        <div className="row heading">
                            <div className="cell" onClick={() => dispatch({ type: 'SORT_BY', payload: SortByEnum.NAME })}>
                                Process Name
                                {memory.sortBy === SortByEnum.NAME
                                 && <img src={sortLogo} alt='looking-glass' height={20} width={20} style={{transform: memory.sortOrder === SortOrderEnum.ASC ? 'rotate(180deg)' : ''}} />
                                }
                                </div>
                            <div className="cell" onClick={() => dispatch({ type: 'SORT_BY', payload: SortByEnum.MEMORY })}>
                                Memory Usage (MB)
                                {memory.sortBy === SortByEnum.MEMORY
                                 && <img src={sortLogo} alt='looking-glass' height={20} width={20} style={{transform: memory.sortOrder === SortOrderEnum.ASC ? 'rotate(180deg)' : ''}} />
                                }
                            </div>
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

        </>
    );
};

export default System;
