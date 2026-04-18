import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "../components/Navbar.jsx";

const makeIcon = (color) =>
    L.divIcon({
        className: "",
        html: `<div style="
      background:${color};
      width:12px;height:12px;border-radius:50%;
      border:2px solid #fff;
      box-shadow:0 0 0 3px ${color}40, 0 2px 8px rgba(0,0,0,0.2);
    "></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
        popupAnchor: [0, -10],
    });

const CATEGORY_ICON = {
    park: makeIcon("#16a34a"),
    cafe: makeIcon("#d97706"),
    restorant: makeIcon("#dc2626"),
    museum: makeIcon("#7c3aed"),
    default: makeIcon("#2563eb"),
};

const CATEGORY_META = {
    park: { label: "Park / Nature", dot: "#16a34a" },
    cafe: { label: "Cafe", dot: "#d97706" },
    restorant: { label: "Restaurant", dot: "#dc2626" },
    museum: { label: "Museum", dot: "#7c3aed" },
};

const DUMMY_TRIPS = [
    {
        _id: "t1",
        title: "Indore Food Trail",
        description: "A half-day crawl through Indore's legendary street food scene — from Sarafa Bazaar to Chappan Dukan's iconic snacks.",
        tags: ["local", "food"],
        duration: "Half Day",
        estimatedCost: 800,
        totalDistance: 12,
        totalTime: 4,
        difficulty: "Easy",
        rating: 4.8,
        stops: [
            {
                order: 1,
                place: {
                    _id: "p1", name: "Sarafa Bazaar", category: "restorant",
                    location: { coordinates: [75.8577, 22.7196] },
                    rating: 4.9, openingHours: "8 PM – 2 AM",
                    estimatedPerPersonCost: 300, avgVisitDuration: 90,
                    tags: ["street food", "night market"],
                },
                plannedArrivalTime: "8:00 PM", plannedDuration: 90,
            },
            {
                order: 2,
                place: {
                    _id: "p2", name: "Chappan Dukan", category: "restorant",
                    location: { coordinates: [75.8681, 22.7267] },
                    rating: 4.7, openingHours: "10 AM – 11 PM",
                    estimatedPerPersonCost: 250, avgVisitDuration: 60,
                    tags: ["snacks", "local"],
                },
                plannedArrivalTime: "10:00 PM", plannedDuration: 60,
            },
            {
                order: 3,
                place: {
                    _id: "p3", name: "Johny Hot Dog", category: "cafe",
                    location: { coordinates: [75.871, 22.7285] },
                    rating: 4.5, openingHours: "11 AM – 11 PM",
                    estimatedPerPersonCost: 150, avgVisitDuration: 30,
                    tags: ["casual"],
                },
                plannedArrivalTime: "11:00 PM", plannedDuration: 30,
            },
        ],
    },
    {
        _id: "t2",
        title: "Shimla Heritage Walk",
        description: "Explore the colonial charm of Shimla — from Mall Road to the tranquil Jakhu Temple amid pine forests.",
        tags: ["mountains", "heritage"],
        duration: "3 Days",
        estimatedCost: 8500,
        totalDistance: 45,
        totalTime: 72,
        difficulty: "Moderate",
        rating: 4.6,
        stops: [
            {
                order: 1,
                place: {
                    _id: "p4", name: "Mall Road", category: "park",
                    location: { coordinates: [77.1734, 31.1048] },
                    rating: 4.7, openingHours: "All Day",
                    estimatedPerPersonCost: 0, avgVisitDuration: 120,
                    tags: ["shopping", "colonial"],
                },
                plannedArrivalTime: "10:00 AM", plannedDuration: 120,
            },
            {
                order: 2,
                place: {
                    _id: "p5", name: "Jakhu Temple", category: "museum",
                    location: { coordinates: [77.1862, 31.1017] },
                    rating: 4.5, openingHours: "6 AM – 8 PM",
                    estimatedPerPersonCost: 0, avgVisitDuration: 90,
                    tags: ["temple", "viewpoint"],
                },
                plannedArrivalTime: "1:00 PM", plannedDuration: 90,
            },
            {
                order: 3,
                place: {
                    _id: "p6", name: "Christ Church", category: "museum",
                    location: { coordinates: [77.1709, 31.1041] },
                    rating: 4.6, openingHours: "8 AM – 6 PM",
                    estimatedPerPersonCost: 0, avgVisitDuration: 60,
                    tags: ["heritage", "colonial"],
                },
                plannedArrivalTime: "3:30 PM", plannedDuration: 60,
            },
        ],
    },
    {
        _id: "t3",
        title: "Indore Green Escape",
        description: "A peaceful Sunday through Indore's parks and the magnificent Rajwada — breathe easy and soak in the city's green soul.",
        tags: ["local", "nature"],
        duration: "1 Day",
        estimatedCost: 400,
        totalDistance: 18,
        totalTime: 8,
        difficulty: "Easy",
        rating: 4.4,
        stops: [
            {
                order: 1,
                place: {
                    _id: "p7", name: "Rajwada Palace", category: "museum",
                    location: { coordinates: [75.8577, 22.7183] },
                    rating: 4.6, openingHours: "10 AM – 5 PM",
                    estimatedPerPersonCost: 50, avgVisitDuration: 60,
                    tags: ["heritage", "architecture"],
                },
                plannedArrivalTime: "10:00 AM", plannedDuration: 60,
            },
            {
                order: 2,
                place: {
                    _id: "p8", name: "Kamla Nehru Park", category: "park",
                    location: { coordinates: [75.8831, 22.7275] },
                    rating: 4.3, openingHours: "6 AM – 8 PM",
                    estimatedPerPersonCost: 20, avgVisitDuration: 90,
                    tags: ["park", "family"],
                },
                plannedArrivalTime: "12:00 PM", plannedDuration: 90,
            },
            {
                order: 3,
                place: {
                    _id: "p9", name: "Pipliyahana Lake", category: "park",
                    location: { coordinates: [75.8446, 22.6988] },
                    rating: 4.5, openingHours: "6 AM – 9 PM",
                    estimatedPerPersonCost: 0, avgVisitDuration: 60,
                    tags: ["lake", "sunset"],
                },
                plannedArrivalTime: "2:30 PM", plannedDuration: 60,
            },
        ],
    },
    {
        _id: "t4",
        title: "Ladakh Wilderness",
        description: "An epic week-long journey through the world's highest motorable roads, ancient monasteries and electric blue lakes.",
        tags: ["adventure", "mountains"],
        duration: "7 Days",
        estimatedCost: 28000,
        totalDistance: 380,
        totalTime: 168,
        difficulty: "Hard",
        rating: 4.9,
        stops: [
            {
                order: 1,
                place: {
                    _id: "p10", name: "Pangong Lake", category: "park",
                    location: { coordinates: [78.9478, 33.7683] },
                    rating: 4.9, openingHours: "All Day",
                    estimatedPerPersonCost: 100, avgVisitDuration: 240,
                    tags: ["lake", "scenic"],
                },
                plannedArrivalTime: "11:00 AM", plannedDuration: 240,
            },
            {
                order: 2,
                place: {
                    _id: "p11", name: "Thiksey Monastery", category: "museum",
                    location: { coordinates: [77.667, 34.0619] },
                    rating: 4.8, openingHours: "6 AM – 7 PM",
                    estimatedPerPersonCost: 50, avgVisitDuration: 120,
                    tags: ["monastery", "buddhist"],
                },
                plannedArrivalTime: "9:00 AM", plannedDuration: 120,
            },
            {
                order: 3,
                place: {
                    _id: "p12", name: "Nubra Valley", category: "park",
                    location: { coordinates: [77.5619, 34.5907] },
                    rating: 4.7, openingHours: "All Day",
                    estimatedPerPersonCost: 200, avgVisitDuration: 360,
                    tags: ["valley", "desert"],
                },
                plannedArrivalTime: "10:00 AM", plannedDuration: 360,
            },
        ],
    },
    {
        _id: "t5",
        title: "Morning Cafe Hop",
        description: "Start your weekend right with a gentle tour of Indore's best coffee spots — quiet corners, good brews, no rush.",
        tags: ["local", "food"],
        duration: "3 Hours",
        estimatedCost: 600,
        totalDistance: 8,
        totalTime: 3,
        difficulty: "Easy",
        rating: 4.3,
        stops: [
            {
                order: 1,
                place: {
                    _id: "p13", name: "Cafe Turaco", category: "cafe",
                    location: { coordinates: [75.8765, 22.7214] },
                    rating: 4.4, openingHours: "8 AM – 10 PM",
                    estimatedPerPersonCost: 250, avgVisitDuration: 60,
                    tags: ["coffee", "quiet"],
                },
                plannedArrivalTime: "9:00 AM", plannedDuration: 60,
            },
            {
                order: 2,
                place: {
                    _id: "p14", name: "The Brew House", category: "cafe",
                    location: { coordinates: [75.881, 22.724] },
                    rating: 4.2, openingHours: "9 AM – 11 PM",
                    estimatedPerPersonCost: 200, avgVisitDuration: 45,
                    tags: ["artisan", "cozy"],
                },
                plannedArrivalTime: "10:30 AM", plannedDuration: 45,
            },
        ],
    },
    {
        _id: "t6",
        title: "Goa Coastal Drive",
        description: "Wind down the Konkan coast — from the buzzing beaches of North Goa to the quiet coves of the south.",
        tags: ["adventure", "nature"],
        duration: "5 Days",
        estimatedCost: 15000,
        totalDistance: 120,
        totalTime: 120,
        difficulty: "Moderate",
        rating: 4.7,
        stops: [
            {
                order: 1,
                place: {
                    _id: "p15", name: "Baga Beach", category: "park",
                    location: { coordinates: [73.7522, 15.5537] },
                    rating: 4.5, openingHours: "All Day",
                    estimatedPerPersonCost: 500, avgVisitDuration: 180,
                    tags: ["beach", "lively"],
                },
                plannedArrivalTime: "10:00 AM", plannedDuration: 180,
            },
            {
                order: 2,
                place: {
                    _id: "p16", name: "Basilica of Bom Jesus", category: "museum",
                    location: { coordinates: [73.9116, 15.5009] },
                    rating: 4.8, openingHours: "9 AM – 6:30 PM",
                    estimatedPerPersonCost: 0, avgVisitDuration: 90,
                    tags: ["heritage", "UNESCO"],
                },
                plannedArrivalTime: "3:00 PM", plannedDuration: 90,
            },
        ],
    },
];

const DIFFICULTY_STYLE = {
    Easy: { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
    Moderate: { bg: "#fffbeb", text: "#b45309", border: "#fde68a" },
    Hard: { bg: "#fef2f2", text: "#b91c1c", border: "#fecaca" },
};

const FILTERS = ["All", "Local", "Food", "Mountains", "Adventure", "Nature"];

function FlyToTrip({ trip }) {
    const map = useMap();
    useEffect(() => {
        if (!trip) return;
        const coords = trip.stops.map((s) => [
            s.place.location.coordinates[1],
            s.place.location.coordinates[0],
        ]);
        if (coords.length === 1) {
            map.flyTo(coords[0], 14, { duration: 1 });
        } else {
            map.flyToBounds(L.latLngBounds(coords), { padding: [48, 48], duration: 1 });
        }
    }, [trip, map]);
    return null;
}

function StopLine({ stops }) {
    const coords = stops.map((s) => [
        s.place.location.coordinates[1],
        s.place.location.coordinates[0],
    ]);
    return (
        <Polyline
            positions={coords}
            pathOptions={{ color: "#374151", weight: 2, dashArray: "5 5", opacity: 0.45 }}
        />
    );
}

export default function ExploreMap() {
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [view, setView] = useState("list");
    const [savedTrips, setSavedTrips] = useState(new Set());
    const [filter, setFilter] = useState("All");
    const detailRef = useRef(null);

    const filteredTrips =
        filter === "All"
            ? DUMMY_TRIPS
            : DUMMY_TRIPS.filter((t) =>
                t.tags.some((tag) => tag.toLowerCase() === filter.toLowerCase())
            );

    const openDetail = (trip) => {
        setSelectedTrip(trip);
        setView("detail");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const toggleSave = (e, id) => {
        e.stopPropagation();
        setSavedTrips((prev) => {
            const n = new Set(prev);
            n.has(id) ? n.delete(id) : n.add(id);
            return n;
        });
    };

    const mapCenter = selectedTrip
        ? [
            selectedTrip.stops[0].place.location.coordinates[1],
            selectedTrip.stops[0].place.location.coordinates[0],
        ]
        : [22.7196, 75.8577];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

                .em-root { font-family: 'DM Sans', sans-serif; background: #f9f9f7; min-height: 100vh; color: #1a1a1a; }
                .em-card { background: #fff; border: 1px solid #ebebе8; border-radius: 10px; cursor: pointer; transition: box-shadow 0.18s ease, transform 0.18s ease; overflow: hidden; }
                .em-card:hover { box-shadow: 0 6px 28px rgba(0,0,0,0.07); transform: translateY(-2px); }
                .em-pill { display: inline-block; border-radius: 99px; font-size: 11px; padding: 2px 9px; font-weight: 500; letter-spacing: 0.02em; line-height: 1.6; }
                .em-filter-btn { border-radius: 99px; border: 1px solid #e2e2de; background: #fff; color: #666; font-size: 12.5px; font-weight: 500; padding: 5px 15px; cursor: pointer; transition: all 0.14s; font-family: 'DM Sans', sans-serif; }
                .em-filter-btn:hover { border-color: #1a1a1a; color: #1a1a1a; }
                .em-filter-btn.active { background: #1a1a1a; border-color: #1a1a1a; color: #fff; }
                .em-back-btn { background: none; border: none; color: #999; font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 6px; padding: 0; transition: color 0.14s; font-family: 'DM Sans', sans-serif; letter-spacing: 0.01em; }
                .em-back-btn:hover { color: #1a1a1a; }
                .em-cta-btn { background: #1a1a1a; color: #fff; border: none; border-radius: 7px; padding: 11px 0; font-size: 13.5px; font-weight: 500; width: 100%; cursor: pointer; letter-spacing: 0.02em; transition: opacity 0.14s; font-family: 'DM Sans', sans-serif; }
                .em-cta-btn:hover { opacity: 0.82; }
                .em-save-icon { background: none; border: none; cursor: pointer; font-size: 17px; line-height: 1; transition: color 0.14s, transform 0.14s; padding: 2px; }
                .em-save-icon:hover { transform: scale(1.15); }
                .em-stop-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }
                .em-stop-line { width: 1px; background: #e8e8e4; flex: 1; min-height: 14px; margin: 3px 0 3px 3.5px; }
                .em-section-label { font-size: 10.5px; color: #bbb; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600; }
                .leaflet-popup-content-wrapper { border-radius: 8px !important; box-shadow: 0 4px 20px rgba(0,0,0,0.1) !important; border: 1px solid #e8e8e4 !important; padding: 0 !important; }
                .leaflet-popup-content { margin: 0 !important; }
                .leaflet-popup-tip-container { display: none !important; }
                .fade-up { animation: fadeUp 0.28s ease both; }
                @keyframes fadeUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>

            <div className="em-root">
                {view === "list" && <Navbar />}

                {view === "list" && (
                    <div className="fade-up" style={{ maxWidth: 1160, margin: "0 auto", padding: "44px 24px 96px" }}>
                        <div style={{ marginBottom: 36 }}>
                            <p className="em-section-label" style={{ marginBottom: 10 }}>Explore Map</p>
                            <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 40, fontWeight: 400, lineHeight: 1.15, color: "#1a1a1a", marginBottom: 10 }}>
                                Where to next?
                            </h1>
                            <p style={{ fontSize: 14, color: "#999", maxWidth: 400, lineHeight: 1.65 }}>
                                Trips curated for your taste — from a quick afternoon out to a week-long escape.
                            </p>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 10 }}>
                            <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                                {FILTERS.map((f) => (
                                    <button key={f} onClick={() => setFilter(f)} className={`em-filter-btn ${filter === f ? "active" : ""}`}>
                                        {f}
                                    </button>
                                ))}
                            </div>
                            {savedTrips.size > 0 && (
                                <span style={{ fontSize: 12, color: "#aaa" }}>{savedTrips.size} saved</span>
                            )}
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(272px, 1fr))", gap: 14 }}>
                            {filteredTrips.map((trip, i) => (
                                <TripCard
                                    key={trip._id}
                                    trip={trip}
                                    saved={savedTrips.has(trip._id)}
                                    onSave={toggleSave}
                                    onClick={() => openDetail(trip)}
                                    index={i}
                                />
                            ))}
                        </div>

                        {filteredTrips.length === 0 && (
                            <div style={{ textAlign: "center", padding: "80px 0", color: "#ccc" }}>
                                <p style={{ fontSize: 14 }}>No trips match this filter.</p>
                            </div>
                        )}
                    </div>
                )}

                {view === "detail" && selectedTrip && (
                    <div ref={detailRef} className="fade-up" style={{ maxWidth: 1160, margin: "0 auto", padding: "32px 24px 80px" }}>
                        <button className="em-back-btn" onClick={() => { setView("list"); setSelectedTrip(null); }} style={{ marginBottom: 28 }}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Back to trips
                        </button>

                        <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 20, alignItems: "start" }}>
                            {/* ── Left Panel ── */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

                                <div style={{ background: "#fff", border: "1px solid #ebebe8", borderRadius: 10, padding: "24px 22px" }}>
                                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 14 }}>
                                        {selectedTrip.tags.map((tag) => (
                                            <span key={tag} className="em-pill" style={{ background: "#f2f2ef", color: "#666" }}>{tag}</span>
                                        ))}
                                        <span className="em-pill" style={{
                                            background: DIFFICULTY_STYLE[selectedTrip.difficulty]?.bg,
                                            color: DIFFICULTY_STYLE[selectedTrip.difficulty]?.text,
                                            border: `1px solid ${DIFFICULTY_STYLE[selectedTrip.difficulty]?.border}`,
                                        }}>
                                            {selectedTrip.difficulty}
                                        </span>
                                    </div>

                                    <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, fontWeight: 400, lineHeight: 1.2, marginBottom: 10, color: "#1a1a1a" }}>
                                        {selectedTrip.title}
                                    </h2>
                                    <p style={{ fontSize: 13, color: "#888", lineHeight: 1.65, marginBottom: 18 }}>
                                        {selectedTrip.description}
                                    </p>

                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 0", borderTop: "1px solid #f2f2ef", paddingTop: 18 }}>
                                        <StatItem label="Rating" value={`${selectedTrip.rating} / 5`} />
                                        <StatItem label="Duration" value={selectedTrip.duration} />
                                        <StatItem label="Distance" value={`${selectedTrip.totalDistance} km`} />
                                        <StatItem label="Est. Cost" value={`Rs. ${selectedTrip.estimatedCost?.toLocaleString()}`} />
                                    </div>
                                </div>

                                <div style={{ display: "flex", gap: 9 }}>
                                    <button
                                        onClick={(e) => toggleSave(e, selectedTrip._id)}
                                        className="em-save-icon"
                                        style={{
                                            color: savedTrips.has(selectedTrip._id) ? "#1a1a1a" : "#ccc",
                                            background: "#fff",
                                            border: "1px solid #e2e2de",
                                            borderRadius: 7,
                                            width: 44,
                                            flexShrink: 0,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                        title={savedTrips.has(selectedTrip._id) ? "Unsave" : "Save"}
                                    >
                                        {savedTrips.has(selectedTrip._id) ? "★" : "☆"}
                                    </button>
                                    <button className="em-cta-btn">Start This Trip</button>
                                </div>

                                <div style={{ background: "#fff", border: "1px solid #ebebе8", borderRadius: 10, padding: "20px 22px" }}>
                                    <p className="em-section-label" style={{ marginBottom: 18 }}>
                                        Itinerary — {selectedTrip.stops.length} stops
                                    </p>

                                    {selectedTrip.stops.map((stop, idx) => {
                                        const meta = CATEGORY_META[stop.place.category] || { label: "Place", dot: "#2563eb" };
                                        const isLast = idx === selectedTrip.stops.length - 1;
                                        return (
                                            <div key={stop.place._id} style={{ display: "flex", gap: 13 }}>
                                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                    <div className="em-stop-dot" style={{ background: meta.dot }} />
                                                    {!isLast && <div className="em-stop-line" />}
                                                </div>
                                                <div style={{ paddingBottom: isLast ? 0 : 16, flex: 1 }}>
                                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 3 }}>
                                                        <div>
                                                            <p style={{ fontSize: 13.5, fontWeight: 500, color: "#1a1a1a", marginBottom: 1 }}>{stop.place.name}</p>
                                                            <p style={{ fontSize: 11, color: "#bbb" }}>{meta.label}</p>
                                                        </div>
                                                        {stop.place.rating && (
                                                            <span style={{ fontSize: 11, color: "#888", background: "#f9f9f7", border: "1px solid #e8e8e4", borderRadius: 4, padding: "2px 6px", whiteSpace: "nowrap" }}>
                                                                {stop.place.rating}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                                                        {stop.plannedArrivalTime && (
                                                            <span style={{ fontSize: 12, color: "#bbb" }}>{stop.plannedArrivalTime}</span>
                                                        )}
                                                        {stop.plannedDuration && (
                                                            <span style={{ fontSize: 12, color: "#bbb" }}>{stop.plannedDuration} min</span>
                                                        )}
                                                        {stop.place.estimatedPerPersonCost > 0 && (
                                                            <span style={{ fontSize: 12, color: "#bbb" }}>Rs. {stop.place.estimatedPerPersonCost}/person</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div style={{ background: "#fff", border: "1px solid #ebebе8", borderRadius: 10, padding: "16px 22px" }}>
                                    <p className="em-section-label" style={{ marginBottom: 12 }}>Map Legend</p>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                        {Object.entries(CATEGORY_META).map(([k, v]) => (
                                            <div key={k} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 12.5, color: "#666" }}>
                                                <div style={{ width: 8, height: 8, borderRadius: "50%", background: v.dot, flexShrink: 0 }} />
                                                {v.label}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div style={{ position: "sticky", top: 20 }}>
                                <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid #e2e2de", height: "calc(100vh - 110px)", minHeight: 520 }}>
                                    <MapContainer
                                        center={mapCenter}
                                        zoom={12}
                                        style={{ width: "100%", height: "100%" }}
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution="&copy; OpenStreetMap contributors"
                                        />
                                        <FlyToTrip trip={selectedTrip} />
                                        <StopLine stops={selectedTrip.stops} />
                                        {selectedTrip.stops.map((stop) => {
                                            const [lng, lat] = stop.place.location.coordinates;
                                            const icon = CATEGORY_ICON[stop.place.category] || CATEGORY_ICON.default;
                                            return (
                                                <Marker key={stop.place._id} position={[lat, lng]} icon={icon}>
                                                    <Popup closeButton={false}>
                                                        <div style={{ fontFamily: "'DM Sans', sans-serif", padding: "12px 14px", minWidth: 160 }}>
                                                            <p style={{ fontWeight: 600, fontSize: 13, color: "#1a1a1a", marginBottom: 2 }}>{stop.place.name}</p>
                                                            <p style={{ fontSize: 11, color: "#bbb", marginBottom: 6 }}>Stop {stop.order}</p>
                                                            <div style={{ display: "flex", gap: 12 }}>
                                                                {stop.place.rating && <span style={{ fontSize: 11.5, color: "#666" }}>{stop.place.rating} rated</span>}
                                                                {stop.plannedArrivalTime && <span style={{ fontSize: 11.5, color: "#666" }}>{stop.plannedArrivalTime}</span>}
                                                            </div>
                                                        </div>
                                                    </Popup>
                                                </Marker>
                                            );
                                        })}
                                    </MapContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

function TripCard({ trip, saved, onSave, onClick, index }) {
    const diff = DIFFICULTY_STYLE[trip.difficulty] || DIFFICULTY_STYLE.Easy;
    const barColor = trip.difficulty === "Hard" ? "#dc2626" : trip.difficulty === "Moderate" ? "#d97706" : "#16a34a";

    return (
        <div className="em-card" onClick={onClick} style={{ animationDelay: `${index * 35}ms` }}>
            <div style={{ height: 3, background: barColor }} />

            <div style={{ padding: "18px 18px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 11 }}>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap", flex: 1, marginRight: 6 }}>
                        {trip.tags.map((tag) => (
                            <span key={tag} className="em-pill" style={{ background: "#f2f2ef", color: "#777" }}>{tag}</span>
                        ))}
                    </div>
                    <button
                        onClick={(e) => onSave(e, trip._id)}
                        className="em-save-icon"
                        style={{ color: saved ? "#1a1a1a" : "#d4d4d0", flexShrink: 0 }}
                    >
                        {saved ? "★" : "☆"}
                    </button>
                </div>

                <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 21, fontWeight: 400, marginBottom: 7, lineHeight: 1.25, color: "#1a1a1a" }}>
                    {trip.title}
                </h3>
                <p style={{ fontSize: 12.5, color: "#aaa", lineHeight: 1.6, marginBottom: 16, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {trip.description}
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 0", borderTop: "1px solid #f2f2ef", paddingTop: 14 }}>
                    <MiniStat label="Duration" value={trip.duration} />
                    <MiniStat label="Distance" value={`${trip.totalDistance} km`} />
                    <MiniStat label="Stops" value={trip.stops.length} />
                    <MiniStat label="Cost" value={`Rs. ${trip.estimatedCost?.toLocaleString()}`} />
                </div>

                {/* Footer */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
                    <span style={{ fontSize: 12, color: "#bbb" }}>{trip.rating} / 5</span>
                    <span style={{ fontSize: 12, color: "#555", fontWeight: 500, letterSpacing: "0.01em" }}>
                        View on map &rarr;
                    </span>
                </div>
            </div>
        </div>
    );
}

function StatItem({ label, value }) {
    return (
        <div>
            <p style={{ fontSize: 10.5, color: "#c4c4c0", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>{label}</p>
            <p style={{ fontSize: 13.5, color: "#1a1a1a", fontWeight: 500 }}>{value}</p>
        </div>
    );
}

function MiniStat({ label, value }) {
    return (
        <div>
            <p style={{ fontSize: 10.5, color: "#c4c4c0", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>{label}</p>
            <p style={{ fontSize: 13, color: "#555" }}>{value}</p>
        </div>
    );
}