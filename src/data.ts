export type Stop = {
  id: string;
  lat: number;
  lng: number;
  name: string;
  timeWindow: string;
  weightKg: number;
};

export type Depot = {
  id: "depot";
  lat: number;
  lng: number;
  name: string;
};

export const DELHI_DEPOT: Depot = {
  id: "depot",
  lat: 28.5355,
  lng: 77.273,
  name: "Okhla ICD staging yard",
};

export const SAMPLE_STOPS: Stop[] = [
  { id: "s01", lat: 28.6315, lng: 77.2167, name: "Connaught Place hub", timeWindow: "09:00-11:00", weightKg: 18 },
  { id: "s02", lat: 28.6519, lng: 77.1907, name: "Karol Bagh market", timeWindow: "09:30-12:00", weightKg: 12 },
  { id: "s03", lat: 28.6506, lng: 77.2303, name: "Chandni Chowk lane", timeWindow: "08:30-10:30", weightKg: 9 },
  { id: "s04", lat: 28.5708, lng: 77.243, name: "Lajpat Nagar central", timeWindow: "10:00-13:00", weightKg: 22 },
  { id: "s05", lat: 28.5483, lng: 77.2386, name: "Greater Kailash M-Block", timeWindow: "11:00-14:00", weightKg: 14 },
  { id: "s06", lat: 28.5245, lng: 77.2066, name: "Saket select city", timeWindow: "12:00-15:00", weightKg: 16 },
  { id: "s07", lat: 28.5494, lng: 77.2001, name: "Hauz Khas village", timeWindow: "11:30-14:30", weightKg: 8 },
  { id: "s08", lat: 28.5523, lng: 77.0585, name: "Dwarka Sector 21", timeWindow: "13:00-16:00", weightKg: 21 },
  { id: "s09", lat: 28.621, lng: 77.0877, name: "Janakpuri district", timeWindow: "13:30-16:30", weightKg: 11 },
  { id: "s10", lat: 28.649, lng: 77.1227, name: "Rajouri Garden ring", timeWindow: "10:30-13:30", weightKg: 13 },
  { id: "s11", lat: 28.7032, lng: 77.1318, name: "Pitampura TV tower", timeWindow: "09:00-12:30", weightKg: 17 },
  { id: "s12", lat: 28.7196, lng: 77.117, name: "Rohini Sector 9", timeWindow: "09:15-12:15", weightKg: 15 },
  { id: "s13", lat: 28.681, lng: 77.222, name: "Civil Lines club", timeWindow: "10:00-12:00", weightKg: 10 },
  { id: "s14", lat: 28.6514, lng: 77.1636, name: "Patel Nagar west", timeWindow: "11:00-13:00", weightKg: 7 },
  { id: "s15", lat: 28.5729, lng: 77.2324, name: "Defence Colony block", timeWindow: "12:30-15:30", weightKg: 19 },
  { id: "s16", lat: 28.5744, lng: 77.21, name: "INA market stalls", timeWindow: "08:45-11:45", weightKg: 6 },
  { id: "s17", lat: 28.5494, lng: 77.254, name: "Nehru Place towers", timeWindow: "14:00-17:00", weightKg: 24 },
  { id: "s18", lat: 28.6074, lng: 77.2933, name: "Mayur Vihar Phase 1", timeWindow: "14:30-17:30", weightKg: 12 },
  { id: "s19", lat: 28.5244, lng: 77.1573, name: "Vasant Kunj mall", timeWindow: "15:00-18:00", weightKg: 20 },
  { id: "s20", lat: 28.5352, lng: 77.259, name: "Kalkaji mandir road", timeWindow: "16:00-18:30", weightKg: 9 },
];

const WINDOWS = [
  "08:30-11:00",
  "09:00-12:00",
  "10:00-13:00",
  "11:00-14:00",
  "12:00-15:00",
  "13:00-16:00",
  "14:00-17:00",
  "15:00-18:00",
];

export const LOCALES = [
  "Lodi Road",
  "ITO crossing",
  "Kashmere Gate",
  "Sarojini Nagar",
  "Green Park",
  "Malviya Nagar",
  "Munirka",
  "Kirti Nagar",
  "Shalimar Bagh",
  "Model Town",
  "Shahdara",
  "Laxmi Nagar",
  "Preet Vihar",
  "Govindpuri",
  "Jasola",
  "Mehrauli",
  "Chhattarpur",
  "Punjabi Bagh",
  "Ashok Vihar",
  "Azadpur",
  "Nizamuddin",
  "Jangpura",
  "Kailash Colony",
  "CR Park",
];

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function generateRandomStops(count = Math.floor(rand(15, 31))): Stop[] {
  const n = Math.min(30, Math.max(15, Math.round(count)));
  const used = new Set<string>();
  const stops: Stop[] = [];
  while (stops.length < n) {
    const name = LOCALES[Math.floor(Math.random() * LOCALES.length)];
    if (used.has(name)) continue;
    used.add(name);
    stops.push({
      id: `r${String(stops.length + 1).padStart(2, "0")}`,
      lat: rand(28.51, 28.73),
      lng: rand(77.06, 77.31),
      name: `${name} drop`,
      timeWindow: WINDOWS[Math.floor(Math.random() * WINDOWS.length)],
      weightKg: Math.round(rand(5, 26)),
    });
  }
  return stops;
}
