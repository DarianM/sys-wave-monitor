interface RamUsageEvent {
    event: 'ram-usage';
    data: {
      used: number;
      free: number;
    };
  }
  
  interface ProcessesEvent {
    event: 'processes';
    data: {
        name: string;
        mem: number;
        pid: number;
    }[]
  }
  
  export type MessageData = RamUsageEvent | ProcessesEvent;