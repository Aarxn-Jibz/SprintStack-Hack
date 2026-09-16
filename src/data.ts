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
  // ─── Delhi NCR ───────────────────────────────────────────────────────────
  { name: "Connaught Place Hub", zone: "Delhi", lat: 28.6315, lng: 77.2167 },
  { name: "Karol Bagh Market", zone: "Delhi", lat: 28.6519, lng: 77.1907 },
  { name: "Chandni Chowk Lane", zone: "Delhi", lat: 28.6506, lng: 77.2303 },
  { name: "Lajpat Nagar Central", zone: "Delhi", lat: 28.5708, lng: 77.243 },
  { name: "Greater Kailash M-Block", zone: "Delhi", lat: 28.5483, lng: 77.2386 },
  { name: "Saket Select City", zone: "Delhi", lat: 28.5245, lng: 77.2066 },
  { name: "Hauz Khas Village", zone: "Delhi", lat: 28.5494, lng: 77.2001 },
  { name: "Dwarka Sector 21", zone: "Delhi", lat: 28.5523, lng: 77.0585 },
  { name: "Dwarka Sector 10", zone: "Delhi", lat: 28.5815, lng: 77.0622 },
  { name: "Janakpuri District Centre", zone: "Delhi", lat: 28.621, lng: 77.0877 },
  { name: "Rajouri Garden Ring", zone: "Delhi", lat: 28.649, lng: 77.1227 },
  { name: "Pitampura TV Tower", zone: "Delhi", lat: 28.7032, lng: 77.1318 },
  { name: "Rohini Sector 9", zone: "Delhi", lat: 28.7196, lng: 77.117 },
  { name: "Civil Lines Club", zone: "Delhi", lat: 28.681, lng: 77.222 },
  { name: "Patel Nagar West", zone: "Delhi", lat: 28.6514, lng: 77.1636 },
  { name: "Defence Colony Block", zone: "Delhi", lat: 28.5729, lng: 77.2324 },
  { name: "INA Market Stalls", zone: "Delhi", lat: 28.5744, lng: 77.21 },
  { name: "Nehru Place Towers", zone: "Delhi", lat: 28.5494, lng: 77.254 },
  { name: "Mayur Vihar Phase 1", zone: "Delhi", lat: 28.6074, lng: 77.2933 },
  { name: "Vasant Kunj Promenade", zone: "Delhi", lat: 28.5244, lng: 77.1573 },
  { name: "Kalkaji Mandir Road", zone: "Delhi", lat: 28.5352, lng: 77.259 },
  { name: "ITO Crossing", zone: "Delhi", lat: 28.63, lng: 77.241 },
  { name: "Kashmere Gate ISBT", zone: "Delhi", lat: 28.6675, lng: 77.23 },
  { name: "Sarojini Nagar Market", zone: "Delhi", lat: 28.577, lng: 77.198 },
  { name: "Shahdara Freight Terminal", zone: "Delhi", lat: 28.673, lng: 77.288 },
  { name: "Laxmi Nagar Vikas Marg", zone: "Delhi", lat: 28.631, lng: 77.277 },
  { name: "Shalimar Bagh Club", zone: "Delhi", lat: 28.715, lng: 77.16 },
  { name: "Azadpur Mandi Logistics", zone: "Delhi", lat: 28.711, lng: 77.18 },
  { name: "Nizamuddin Railway Hub", zone: "Delhi", lat: 28.588, lng: 77.253 },
  // NCR
  { name: "Noida Sector 18 Atta", zone: "Uttar Pradesh", lat: 28.57, lng: 77.323 },
  { name: "Noida Sector 62 Tech Park", zone: "Uttar Pradesh", lat: 28.625, lng: 77.368 },
  { name: "Indirapuram Habitat Centre", zone: "Uttar Pradesh", lat: 28.643, lng: 77.371 },
  { name: "Cyber City Rapid Metro", zone: "Haryana", lat: 28.495, lng: 77.089 },
  { name: "DLF Phase 2 Cyber Hub", zone: "Haryana", lat: 28.489, lng: 77.091 },
  { name: "Golf Course Road One", zone: "Haryana", lat: 28.462, lng: 77.1 },
  { name: "Faridabad Industrial Area", zone: "Haryana", lat: 28.408, lng: 77.317 },
  { name: "Ballabhgarh Sector 3", zone: "Haryana", lat: 28.346, lng: 77.321 },

  // ─── Uttar Pradesh ───────────────────────────────────────────────────────
  { name: "Lucknow Hazratganj", zone: "Uttar Pradesh", lat: 26.8517, lng: 80.9407 },
  { name: "Lucknow Alambagh Hub", zone: "Uttar Pradesh", lat: 26.7928, lng: 80.8876 },
  { name: "Kanpur Kidwai Nagar", zone: "Uttar Pradesh", lat: 26.4641, lng: 80.3503 },
  { name: "Agra Taj Ganj", zone: "Uttar Pradesh", lat: 27.177, lng: 78.008 },
  { name: "Agra Bodla Logistics", zone: "Uttar Pradesh", lat: 27.214, lng: 77.972 },
  { name: "Varanasi Sigra", zone: "Uttar Pradesh", lat: 25.317, lng: 82.974 },
  { name: "Prayagraj Civil Lines", zone: "Uttar Pradesh", lat: 25.435, lng: 81.846 },
  { name: "Ghaziabad Kaushambi", zone: "Uttar Pradesh", lat: 28.645, lng: 77.344 },
  { name: "Meerut Cantonment Road", zone: "Uttar Pradesh", lat: 28.984, lng: 77.706 },
  { name: "Mathura Vrindavan Hub", zone: "Uttar Pradesh", lat: 27.497, lng: 77.673 },
  { name: "Aligarh Civil Lines", zone: "Uttar Pradesh", lat: 27.881, lng: 78.071 },
  { name: "Gorakhpur Medical College Road", zone: "Uttar Pradesh", lat: 26.756, lng: 83.374 },
  { name: "Bareilly Pilibhit Bypass", zone: "Uttar Pradesh", lat: 28.347, lng: 79.415 },
  { name: "Moradabad Industrial Cluster", zone: "Uttar Pradesh", lat: 28.839, lng: 78.776 },

  // ─── Rajasthan ───────────────────────────────────────────────────────────
  { name: "Jaipur Malviya Nagar", zone: "Rajasthan", lat: 26.8453, lng: 75.7875 },
  { name: "Jaipur Sitapura Industrial", zone: "Rajasthan", lat: 26.757, lng: 75.872 },
  { name: "Jodhpur Clock Tower", zone: "Rajasthan", lat: 26.295, lng: 73.027 },
  { name: "Udaipur City Palace Road", zone: "Rajasthan", lat: 24.579, lng: 73.683 },
  { name: "Kota Industrial Area", zone: "Rajasthan", lat: 25.182, lng: 75.866 },
  { name: "Bikaner Rani Bazar", zone: "Rajasthan", lat: 28.015, lng: 73.313 },
  { name: "Ajmer Pushkar Road", zone: "Rajasthan", lat: 26.45, lng: 74.634 },
  { name: "Alwar RIICO Industrial", zone: "Rajasthan", lat: 27.553, lng: 76.621 },
  { name: "Bhilwara Textiles Cluster", zone: "Rajasthan", lat: 25.346, lng: 74.636 },

  // ─── Haryana ─────────────────────────────────────────────────────────────
  { name: "Chandigarh Sector 17", zone: "Chandigarh", lat: 30.7333, lng: 76.7794 },
  { name: "Chandigarh Industrial Area Phase 1", zone: "Chandigarh", lat: 30.699, lng: 76.793 },
  { name: "Ambala Cantonment", zone: "Haryana", lat: 30.378, lng: 76.776 },
  { name: "Hisar Industrial Estate", zone: "Haryana", lat: 29.15, lng: 75.72 },
  { name: "Rohtak Asthal Bohar", zone: "Haryana", lat: 28.895, lng: 76.577 },
  { name: "Panipat Refinery Gate", zone: "Haryana", lat: 29.39, lng: 76.97 },
  { name: "Sonipat Kundli Industrial", zone: "Haryana", lat: 28.997, lng: 77.02 },

  // ─── Punjab ──────────────────────────────────────────────────────────────
  { name: "Ludhiana Focal Point", zone: "Punjab", lat: 30.901, lng: 75.857 },
  { name: "Amritsar Golden Temple Road", zone: "Punjab", lat: 31.634, lng: 74.872 },
  { name: "Jalandhar Nakodar Road", zone: "Punjab", lat: 31.326, lng: 75.576 },
  { name: "Patiala Leela Bhawan Chowk", zone: "Punjab", lat: 30.34, lng: 76.387 },
  { name: "Mohali Phase 7", zone: "Punjab", lat: 30.704, lng: 76.717 },
  { name: "Bathinda Thermal Plant Road", zone: "Punjab", lat: 30.21, lng: 74.945 },

  // ─── Himachal Pradesh ────────────────────────────────────────────────────
  { name: "Shimla The Mall Road", zone: "Himachal Pradesh", lat: 31.104, lng: 77.167 },
  { name: "Manali Old Manali", zone: "Himachal Pradesh", lat: 32.269, lng: 77.178 },
  { name: "Dharamsala McLeod Ganj", zone: "Himachal Pradesh", lat: 32.219, lng: 76.324 },
  { name: "Baddi Pharma Cluster", zone: "Himachal Pradesh", lat: 30.947, lng: 76.792 },

  // ─── Uttarakhand ─────────────────────────────────────────────────────────
  { name: "Dehradun Rajpur Road", zone: "Uttarakhand", lat: 30.317, lng: 78.032 },
  { name: "Haridwar SIDCUL Industrial", zone: "Uttarakhand", lat: 29.945, lng: 78.165 },
  { name: "Roorkee IIT Gate", zone: "Uttarakhand", lat: 29.867, lng: 77.889 },
  { name: "Rishikesh Tapovan", zone: "Uttarakhand", lat: 30.103, lng: 78.319 },

  // ─── Jammu & Kashmir ─────────────────────────────────────────────────────
  { name: "Srinagar Lal Chowk", zone: "Jammu & Kashmir", lat: 34.083, lng: 74.797 },
  { name: "Jammu Narwal Industrial", zone: "Jammu & Kashmir", lat: 32.735, lng: 74.865 },

  // ─── Maharashtra ─────────────────────────────────────────────────────────
  { name: "Mumbai Dharavi Logistics", zone: "Maharashtra", lat: 19.042, lng: 72.854 },
  { name: "Mumbai Andheri MIDC", zone: "Maharashtra", lat: 19.116, lng: 72.868 },
  { name: "Mumbai Kurla LBS Marg", zone: "Maharashtra", lat: 19.071, lng: 72.883 },
  { name: "Mumbai Navi Mumbai Vashi", zone: "Maharashtra", lat: 19.075, lng: 73.001 },
  { name: "Mumbai Thane Wagle Estate", zone: "Maharashtra", lat: 19.219, lng: 72.973 },
  { name: "Pune Hadapsar Industrial", zone: "Maharashtra", lat: 18.499, lng: 73.929 },
  { name: "Pune Hinjewadi IT Park", zone: "Maharashtra", lat: 18.591, lng: 73.738 },
  { name: "Pune Kothrud Market", zone: "Maharashtra", lat: 18.506, lng: 73.807 },
  { name: "Nagpur Butibori MIDC", zone: "Maharashtra", lat: 21.09, lng: 79.023 },
  { name: "Nagpur Sitabuldi Centre", zone: "Maharashtra", lat: 21.146, lng: 79.089 },
  { name: "Nashik MIDC Satpur", zone: "Maharashtra", lat: 19.998, lng: 73.79 },
  { name: "Aurangabad Waluj MIDC", zone: "Maharashtra", lat: 19.842, lng: 75.248 },
  { name: "Solapur Kagal Road", zone: "Maharashtra", lat: 17.686, lng: 75.907 },
  { name: "Kolhapur Shiroli MIDC", zone: "Maharashtra", lat: 16.705, lng: 74.244 },
  { name: "Amravati Badnera Road", zone: "Maharashtra", lat: 20.934, lng: 77.756 },

  // ─── Gujarat ─────────────────────────────────────────────────────────────
  { name: "Ahmedabad GIDC Naroda", zone: "Gujarat", lat: 23.075, lng: 72.638 },
  { name: "Ahmedabad SG Highway", zone: "Gujarat", lat: 23.023, lng: 72.505 },
  { name: "Surat Diamond Bourse", zone: "Gujarat", lat: 21.195, lng: 72.819 },
  { name: "Surat Sachin GIDC", zone: "Gujarat", lat: 21.088, lng: 72.884 },
  { name: "Vadodara Makarpura GIDC", zone: "Gujarat", lat: 22.267, lng: 73.175 },
  { name: "Rajkot Gondal Road", zone: "Gujarat", lat: 22.303, lng: 70.802 },
  { name: "Gandhinagar Gift City", zone: "Gujarat", lat: 23.217, lng: 72.683 },
  { name: "Bharuch Dahej Port Road", zone: "Gujarat", lat: 21.706, lng: 72.998 },
  { name: "Anand Amul Dairy Road", zone: "Gujarat", lat: 22.555, lng: 72.951 },
  { name: "Bhavnagar Port Trust", zone: "Gujarat", lat: 21.765, lng: 72.152 },

  // ─── Madhya Pradesh ──────────────────────────────────────────────────────
  { name: "Bhopal Govindpura Industrial", zone: "Madhya Pradesh", lat: 23.259, lng: 77.413 },
  { name: "Indore Pithampur SEZ", zone: "Madhya Pradesh", lat: 22.617, lng: 75.685 },
  { name: "Indore Rajwada Market", zone: "Madhya Pradesh", lat: 22.717, lng: 75.857 },
  { name: "Jabalpur Adhartal Industrial", zone: "Madhya Pradesh", lat: 23.166, lng: 79.934 },
  { name: "Gwalior Morar Cantonment", zone: "Madhya Pradesh", lat: 26.22, lng: 78.183 },
  { name: "Ujjain Dewas Road", zone: "Madhya Pradesh", lat: 23.182, lng: 75.784 },
  { name: "Rewa Banmore Road", zone: "Madhya Pradesh", lat: 24.532, lng: 81.297 },

  // ─── Chhattisgarh ────────────────────────────────────────────────────────
  { name: "Raipur Urla Industrial", zone: "Chhattisgarh", lat: 21.25, lng: 81.63 },
  { name: "Bhilai Steel Plant Gate", zone: "Chhattisgarh", lat: 21.211, lng: 81.429 },
  { name: "Bilaspur Silphari Road", zone: "Chhattisgarh", lat: 22.08, lng: 82.149 },

  // ─── Karnataka ───────────────────────────────────────────────────────────
  { name: "Bengaluru Whitefield Tech", zone: "Karnataka", lat: 12.969, lng: 77.75 },
  { name: "Bengaluru Electronic City", zone: "Karnataka", lat: 12.839, lng: 77.677 },
  { name: "Bengaluru Yeshwanthpur APMC", zone: "Karnataka", lat: 13.018, lng: 77.548 },
  { name: "Bengaluru HSR Layout", zone: "Karnataka", lat: 12.912, lng: 77.638 },
  { name: "Mysuru Industrial Suburb", zone: "Karnataka", lat: 12.296, lng: 76.64 },
  { name: "Hubli Dharwad Industrial", zone: "Karnataka", lat: 15.35, lng: 75.136 },
  { name: "Mangaluru Bunder Port", zone: "Karnataka", lat: 12.866, lng: 74.843 },
  { name: "Belagavi Udyambag", zone: "Karnataka", lat: 15.849, lng: 74.497 },
  { name: "Davangere PB Road", zone: "Karnataka", lat: 14.465, lng: 75.921 },
  { name: "Tumkur Siddaganga Road", zone: "Karnataka", lat: 13.341, lng: 77.101 },

  // ─── Tamil Nadu ──────────────────────────────────────────────────────────
  { name: "Chennai Guindy Industrial", zone: "Tamil Nadu", lat: 13.007, lng: 80.219 },
  { name: "Chennai Ambattur SIDCO", zone: "Tamil Nadu", lat: 13.098, lng: 80.162 },
  { name: "Chennai Anna Nagar", zone: "Tamil Nadu", lat: 13.086, lng: 80.212 },
  { name: "Coimbatore Peelamedu", zone: "Tamil Nadu", lat: 11.017, lng: 76.956 },
  { name: "Madurai Mattuthavani", zone: "Tamil Nadu", lat: 9.939, lng: 78.121 },
  { name: "Tiruchirappalli Ariyamangalam", zone: "Tamil Nadu", lat: 10.79, lng: 78.703 },
  { name: "Salem Fairlands", zone: "Tamil Nadu", lat: 11.664, lng: 78.146 },
  { name: "Tirunelveli Palayamkottai", zone: "Tamil Nadu", lat: 8.729, lng: 77.738 },
  { name: "Erode Veerappanchatram", zone: "Tamil Nadu", lat: 11.339, lng: 77.717 },
  { name: "Vellore Katpadi Junction", zone: "Tamil Nadu", lat: 12.967, lng: 79.148 },

  // ─── Andhra Pradesh & Telangana ──────────────────────────────────────────
  { name: "Hyderabad Hitech City", zone: "Telangana", lat: 17.445, lng: 78.38 },
  { name: "Hyderabad Uppal Ring Road", zone: "Telangana", lat: 17.405, lng: 78.559 },
  { name: "Hyderabad Kompally", zone: "Telangana", lat: 17.545, lng: 78.484 },
  { name: "Warangal Kazipet Junction", zone: "Telangana", lat: 17.977, lng: 79.599 },
  { name: "Visakhapatnam Steel Plant", zone: "Andhra Pradesh", lat: 17.623, lng: 83.196 },
  { name: "Visakhapatnam MVP Colony", zone: "Andhra Pradesh", lat: 17.748, lng: 83.338 },
  { name: "Vijayawada Benz Circle", zone: "Andhra Pradesh", lat: 16.505, lng: 80.648 },
  { name: "Tirupati Renigunta Road", zone: "Andhra Pradesh", lat: 13.629, lng: 79.419 },
  { name: "Guntur Narasaraopet Road", zone: "Andhra Pradesh", lat: 16.307, lng: 80.436 },
  { name: "Nellore Pogathota", zone: "Andhra Pradesh", lat: 14.443, lng: 79.987 },

  // ─── Kerala ──────────────────────────────────────────────────────────────
  { name: "Kochi Kakkanad Infopark", zone: "Kerala", lat: 10.013, lng: 76.34 },
  { name: "Kochi Willingdon Island Port", zone: "Kerala", lat: 9.966, lng: 76.284 },
  { name: "Thiruvananthapuram Technopark", zone: "Kerala", lat: 8.557, lng: 76.882 },
  { name: "Kozhikode Mavoor Road", zone: "Kerala", lat: 11.259, lng: 75.78 },
  { name: "Thrissur Round South", zone: "Kerala", lat: 10.527, lng: 76.214 },
  { name: "Kollam KSRTC Junction", zone: "Kerala", lat: 8.887, lng: 76.601 },
  { name: "Kannur Thavakkara", zone: "Kerala", lat: 11.868, lng: 75.371 },

  // ─── West Bengal ─────────────────────────────────────────────────────────
  { name: "Kolkata Park Street", zone: "West Bengal", lat: 22.549, lng: 88.352 },
  { name: "Kolkata Howrah Industrial", zone: "West Bengal", lat: 22.585, lng: 88.311 },
  { name: "Kolkata Salt Lake Sector V", zone: "West Bengal", lat: 22.582, lng: 88.421 },
  { name: "Kolkata Dankuni Logistics Hub", zone: "West Bengal", lat: 22.672, lng: 88.274 },
  { name: "Siliguri NH-10 Junction", zone: "West Bengal", lat: 26.718, lng: 88.435 },
  { name: "Asansol Burnpur Road", zone: "West Bengal", lat: 23.683, lng: 86.982 },
  { name: "Durgapur Industrial Township", zone: "West Bengal", lat: 23.483, lng: 87.283 },
  { name: "Haldia Petrochemical Hub", zone: "West Bengal", lat: 22.026, lng: 88.068 },

  // ─── Bihar ───────────────────────────────────────────────────────────────
  { name: "Patna Exhibition Road", zone: "Bihar", lat: 25.595, lng: 85.138 },
  { name: "Patna Beur Industrial", zone: "Bihar", lat: 25.573, lng: 85.189 },
  { name: "Gaya Bodh Gaya Road", zone: "Bihar", lat: 24.747, lng: 85.007 },
  { name: "Muzaffarpur Mithanpura", zone: "Bihar", lat: 26.119, lng: 85.391 },
  { name: "Bhagalpur Barari Ghat", zone: "Bihar", lat: 25.248, lng: 86.987 },

  // ─── Jharkhand ───────────────────────────────────────────────────────────
  { name: "Ranchi Hinoo Chowk", zone: "Jharkhand", lat: 23.346, lng: 85.309 },
  { name: "Jamshedpur Gamharia Industrial", zone: "Jharkhand", lat: 22.813, lng: 86.185 },
  { name: "Dhanbad Koyla Nagar", zone: "Jharkhand", lat: 23.795, lng: 86.433 },

  // ─── Odisha ──────────────────────────────────────────────────────────────
  { name: "Bhubaneswar Mancheswar IDCO", zone: "Odisha", lat: 20.296, lng: 85.825 },
  { name: "Cuttack Chaudhury Bazar", zone: "Odisha", lat: 20.462, lng: 85.88 },
  { name: "Rourkela Steel Township", zone: "Odisha", lat: 22.2, lng: 84.867 },
  { name: "Berhampur Gopalpur Road", zone: "Odisha", lat: 19.316, lng: 84.793 },

  // ─── Assam & North-East ──────────────────────────────────────────────────
  { name: "Guwahati Paltan Bazar", zone: "Assam", lat: 26.182, lng: 91.743 },
  { name: "Guwahati Amingaon Industrial", zone: "Assam", lat: 26.195, lng: 91.671 },
  { name: "Dibrugarh AT Road", zone: "Assam", lat: 27.48, lng: 94.909 },
  { name: "Silchar Meherpur", zone: "Assam", lat: 24.827, lng: 92.793 },
  { name: "Imphal Khwairamband Bazar", zone: "Manipur", lat: 24.817, lng: 93.944 },
  { name: "Agartala Industrial Growth Centre", zone: "Tripura", lat: 23.831, lng: 91.286 },
  { name: "Shillong Police Bazar", zone: "Meghalaya", lat: 25.574, lng: 91.882 },

  // ─── Goa ─────────────────────────────────────────────────────────────────
  { name: "Panaji Patto Plaza", zone: "Goa", lat: 15.499, lng: 73.824 },
  { name: "Margao New Market", zone: "Goa", lat: 15.274, lng: 73.958 },
  { name: "Vasco da Gama Port Area", zone: "Goa", lat: 15.394, lng: 73.813 },

  // ─── Other Major Logistics Hubs ──────────────────────────────────────────
  { name: "Vizag Port Container Terminal", zone: "Andhra Pradesh", lat: 17.687, lng: 83.274 },
  { name: "Chennai Port Trust", zone: "Tamil Nadu", lat: 13.086, lng: 80.297 },
  { name: "JNPT Nhava Sheva Port", zone: "Maharashtra", lat: 18.949, lng: 72.943 },
  { name: "Mundra Port Logistics Zone", zone: "Gujarat", lat: 22.839, lng: 69.706 },
  { name: "Kandla Gandhidham", zone: "Gujarat", lat: 23.07, lng: 70.131 },
  { name: "Ludhiana Rail Freight Terminal", zone: "Punjab", lat: 30.888, lng: 75.836 },
  { name: "Nagpur Zero Mile Centre", zone: "Maharashtra", lat: 21.146, lng: 79.088 },
  { name: "Agra Runakta Industrial", zone: "Uttar Pradesh", lat: 27.187, lng: 77.944 },
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
