import { 
  collection, 
  doc, 
  setDoc, 
  query, 
  where, 
  onSnapshot,
  Timestamp,
  getDocs
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Availability, DateEntry } from '../types';

const COLLECTION_NAME = 'availability';

export const saveAvailability = async (
  date: string, 
  userName: string, 
  availability: Availability
) => {
  const docRef = doc(db, COLLECTION_NAME, date);
  
  // We use setDoc with merge: true to create the document if it doesn't exist
  // or update it if it does.
  // We use dot notation for the nested field update.
  await setDoc(docRef, {
    date: date, // Ensure the date field exists for querying
    availabilities: {
      [userName]: availability
    },
    updatedAt: Timestamp.now()
  }, { merge: true });
};

export const subscribeToMonth = (
  year: number, 
  month: number, 
  onUpdate: (data: DateEntry[]) => void
) => {
  // Construct start and end dates for the query
  // Format: YYYY-MM-DD
  // Note: month is 0-indexed in JS Date, but let's assume 1-indexed input or handle it.
  // Let's assume the input `month` is 1-12.
  
  const startMonthStr = month.toString().padStart(2, '0');
  const startDate = `${year}-${startMonthStr}-01`;
  
  // Calculate next month for the end date
  let nextMonth = month + 1;
  let nextMonthYear = year;
  if (nextMonth > 12) {
    nextMonth = 1;
    nextMonthYear = year + 1;
  }
  const nextMonthStr = nextMonth.toString().padStart(2, '0');
  const endDate = `${nextMonthYear}-${nextMonthStr}-01`;

  const q = query(
    collection(db, COLLECTION_NAME),
    where('date', '>=', startDate),
    where('date', '<', endDate)
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const entries: DateEntry[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Validate data structure roughly
      if (data.date && data.availabilities) {
        entries.push({
          date: data.date,
          availabilities: data.availabilities
        } as DateEntry);
      }
    });
    onUpdate(entries);
  });

  return unsubscribe;
};

// Helper to get all data (if needed for initial load or other views)
export const getAllAvailability = async (): Promise<DateEntry[]> => {
  const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
  const entries: DateEntry[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.date && data.availabilities) {
      entries.push({
        date: data.date,
        availabilities: data.availabilities
      } as DateEntry);
    }
  });
  return entries;
};
