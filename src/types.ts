export interface User {
  name: string;
  code: string;
}

export type Availability = 'O' | 'V' | 'X';

export interface DateEntry {
  date: string; // ISO date string YYYY-MM-DD
  availabilities: {
    [userName: string]: Availability;
  };
}
