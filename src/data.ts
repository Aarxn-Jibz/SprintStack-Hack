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

export type DelhiPlace = {
  name: string;
  zone: string;
  lat: number;
  lng: number;
};

export const DELHI_LOCATIONS: DelhiPlace[] = [
  { name: "Connaught Place Hub", zone: "Central Delhi", lat: 28.6315, lng: 77.2167 },
  { name: "Karol Bagh Market", zone: "Central Delhi", lat: 28.6519, lng: 77.1907 },
  { name: "Chandni Chowk Lane", zone: "North Delhi", lat: 28.6506, lng: 77.2303 },
  { name: "Lajpat Nagar Central", zone: "South Delhi", lat: 28.5708, lng: 77.243 },
  { name: "Greater Kailash M-Block", zone: "South Delhi", lat: 28.5483, lng: 77.2386 },
  { name: "Saket Select City", zone: "South Delhi", lat: 28.5245, lng: 77.2066 },
  { name: "Hauz Khas Village", zone: "South Delhi", lat: 28.5494, lng: 77.2001 },
  { name: "Dwarka Sector 21", zone: "South-West Delhi", lat: 28.5523, lng: 77.0585 },
  { name: "Dwarka Sector 10", zone: "South-West Delhi", lat: 28.5815, lng: 77.0622 },
  { name: "Janakpuri District Centre", zone: "West Delhi", lat: 28.621, lng: 77.0877 },
  { name: "Rajouri Garden Ring", zone: "West Delhi", lat: 28.649, lng: 77.1227 },
  { name: "Pitampura TV Tower", zone: "North-West Delhi", lat: 28.7032, lng: 77.1318 },
  { name: "Rohini Sector 9", zone: "North-West Delhi", lat: 28.7196, lng: 77.117 },
  { name: "Rohini Sector 15", zone: "North-West Delhi", lat: 28.725, lng: 77.132 },
  { name: "Civil Lines Club", zone: "North Delhi", lat: 28.681, lng: 77.222 },
  { name: "Patel Nagar West", zone: "West Delhi", lat: 28.6514, lng: 77.1636 },
  { name: "Defence Colony Block", zone: "South Delhi", lat: 28.5729, lng: 77.2324 },
  { name: "INA Market Stalls", zone: "South Delhi", lat: 28.5744, lng: 77.21 },
  { name: "Nehru Place Towers", zone: "South Delhi", lat: 28.5494, lng: 77.254 },
  { name: "Mayur Vihar Phase 1", zone: "East Delhi", lat: 28.6074, lng: 77.2933 },
  { name: "Mayur Vihar Phase 2", zone: "East Delhi", lat: 28.6215, lng: 77.305 },
  { name: "Vasant Kunj Promenade", zone: "South Delhi", lat: 28.5244, lng: 77.1573 },
  { name: "Kalkaji Mandir Road", zone: "South Delhi", lat: 28.5352, lng: 77.259 },
  { name: "Lodi Road Complex", zone: "South Delhi", lat: 28.591, lng: 77.227 },
  { name: "ITO Crossing", zone: "Central Delhi", lat: 28.63, lng: 77.241 },
  { name: "Kashmere Gate ISBT", zone: "North Delhi", lat: 28.6675, lng: 77.23 },
  { name: "Sarojini Nagar Market", zone: "South Delhi", lat: 28.577, lng: 77.198 },
  { name: "Green Park Extension", zone: "South Delhi", lat: 28.558, lng: 77.206 },
  { name: "Malviya Nagar Corner", zone: "South Delhi", lat: 28.532, lng: 77.21 },
  { name: "Munirka DDA Flats", zone: "South Delhi", lat: 28.555, lng: 77.172 },
  { name: "Kirti Nagar Industrial", zone: "West Delhi", lat: 28.655, lng: 77.142 },
  { name: "Shalimar Bagh Club", zone: "North-West Delhi", lat: 28.715, lng: 77.16 },
  { name: "Model Town Metro", zone: "North Delhi", lat: 28.702, lng: 77.193 },
  { name: "Shahdara Freight Terminal", zone: "East Delhi", lat: 28.673, lng: 77.288 },
  { name: "Laxmi Nagar Vikas Marg", zone: "East Delhi", lat: 28.631, lng: 77.277 },
  { name: "Preet Vihar Commercial", zone: "East Delhi", lat: 28.639, lng: 77.295 },
  { name: "Govindpuri Extension", zone: "South Delhi", lat: 28.528, lng: 77.262 },
  { name: "Jasola Apollo Corridor", zone: "South-East Delhi", lat: 28.538, lng: 77.291 },
  { name: "Mehrauli Archeological", zone: "South Delhi", lat: 28.518, lng: 77.185 },
  { name: "Chhattarpur Temple", zone: "South Delhi", lat: 28.502, lng: 77.175 },
  { name: "Punjabi Bagh Club Road", zone: "West Delhi", lat: 28.668, lng: 77.129 },
  { name: "Ashok Vihar Deep Market", zone: "North-West Delhi", lat: 28.692, lng: 77.175 },
  { name: "Azadpur Mandi Logistics", zone: "North Delhi", lat: 28.711, lng: 77.18 },
  { name: "Nizamuddin Railway Hub", zone: "South Delhi", lat: 28.588, lng: 77.253 },
  { name: "Jangpura Bhogal", zone: "South Delhi", lat: 28.58, lng: 77.246 },
  { name: "Kailash Colony Market", zone: "South Delhi", lat: 28.553, lng: 77.244 },
  { name: "CR Park Market 1", zone: "South Delhi", lat: 28.537, lng: 77.249 },
  { name: "Paschim Vihar Jawalaheri", zone: "West Delhi", lat: 28.67, lng: 77.1 },
  { name: "Tilak Nagar Metro", zone: "West Delhi", lat: 28.636, lng: 77.098 },
  { name: "Uttam Nagar East", zone: "West Delhi", lat: 28.623, lng: 77.065 },
  { name: "Noida Sector 18 Atta", zone: "Noida NCR", lat: 28.57, lng: 77.323 },
  { name: "Noida Sector 62 Tech", zone: "Noida NCR", lat: 28.625, lng: 77.368 },
  { name: "Indirapuram Habitat", zone: "Ghaziabad NCR", lat: 28.643, lng: 77.371 },
  { name: "Cyber City Rapid Metro", zone: "Gurgaon NCR", lat: 28.495, lng: 77.089 },
  { name: "Udyog Vihar Phase 4", zone: "Gurgaon NCR", lat: 28.505, lng: 77.081 },
  { name: "DLF Phase 2 Cyber Hub", zone: "Gurgaon NCR", lat: 28.489, lng: 77.091 },
  { name: "Golf Course Road One", zone: "Gurgaon NCR", lat: 28.462, lng: 77.1 },
];

export const LOCALES = DELHI_LOCATIONS.map((l) => l.name);

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function generateRandomStops(count = Math.floor(rand(15, 31))): Stop[] {
  const targetCount = Math.min(30, Math.max(15, Math.round(count)));
  // Deterministic shuffle without any unbounded while loops
  const pool = [...DELHI_LOCATIONS].sort(() => 0.5 - Math.random());
  const stops: Stop[] = [];

  for (let i = 0; i < targetCount; i++) {
    const loc = pool[i % pool.length];
    // Slightly jitter coordinates so duplicate locales if any don't stack exactly
    const jitterLat = (Math.random() - 0.5) * 0.006;
    const jitterLng = (Math.random() - 0.5) * 0.006;
    const name = i >= pool.length ? `${loc.name} Drop #${Math.floor(i / pool.length) + 1}` : `${loc.name} drop`;

    stops.push({
      id: `r${String(i + 1).padStart(2, "0")}`,
      lat: Number((loc.lat + jitterLat).toFixed(5)),
      lng: Number((loc.lng + jitterLng).toFixed(5)),
      name,
      timeWindow: WINDOWS[i % WINDOWS.length],
      weightKg: Math.round(rand(6, 25)),
    });
  }

  return stops;
}
