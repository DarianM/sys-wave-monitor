interface RamUsageEvent {
    event: 'ram-usage';
    data: {
      used: number;
      free: number;
    };
  }
  
export interface ProcessesEvent {
  event: 'processes';
  data: {
      name: string;
      mem: number;
      pid: number;
  }[]
}

export enum SortByEnum {
  NAME,
  MEMORY,
}

export enum SortOrderEnum {
  ASC,
  DESC,
}

export type MessageData = RamUsageEvent | ProcessesEvent;