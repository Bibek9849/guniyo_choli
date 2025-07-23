import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../CSS/Map.css';
import Footer from './Footer';

// Sample data for trekking routes
const trekkingRoutes = [
  {
    name: 'Everest Base Camp',
    start: [27.9881, 86.9250], // Everest Base Camp
    end: [27.9172, 86.8257],   // Near Kala Patthar
    route: [
      [27.9636, 86.8010], // Near Namche Bazaar
      [27.9172, 86.8257]  // Near Kala Patthar
    ]
  },
  {
    name: 'Annapurna Circuit',
    start: [28.5844, 84.1472], // Annapurna Circuit Start
    end: [28.6383, 83.9895],  // Thorong La Pass
    route: [
      [28.6550, 84.1160], // Manang
      [28.6383, 83.9895]  // Thorong La Pass
    ]
  },
  {
    name: 'Langtang Valley',
    start: [28.2836, 85.5053], // Syabrubesi
    end: [28.3436, 85.5330],   // Kyanjin Gompa
    route: [
      [28.3073, 85.5738], // Lama Hotel
      [28.3436, 85.5330]  // Kyanjin Gompa
    ]
  },
  {
    name: 'Manaslu Circuit',
    start: [28.5480, 84.5731], // Arughat
    end: [28.5472, 84.6867],   // Samagaon
    route: [
      [28.5594, 84.6686], // Soti Khola
      [28.5472, 84.6867]  // Samagaon
    ]
  },
  {
    name: 'Makalu Base Camp',
    start: [27.9240, 87.0990], // Tumlingtar
    end: [27.8675, 87.2335],   // Makalu Base Camp
    route: [
      [27.8855, 87.2155], // Num
      [27.8675, 87.2335]  // Makalu Base Camp
    ]
  },
  {
    name: 'Kanchenjunga Base Camp',
    start: [27.6995, 88.1461], // Taplejung
    end: [27.6900, 88.1555],   // Kanchenjunga Base Camp
    route: [
      [27.6901, 88.1212], // Mitlung
      [27.6900, 88.1555]  // Kanchenjunga Base Camp
    ]
  },
  {
    name: 'Dolpo Trek',
    start: [29.0362, 82.9130], // Juphal
    end: [29.0186, 82.8376],   // Phoksundo Lake
    route: [
      [29.0167, 82.9130], // Dunai
      [29.0186, 82.8376]  // Phoksundo Lake
    ]
  }
];

const Map = () => {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Get the user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  return (
    <>
    <div className="map-container">
      <MapContainer center={[28.3949, 84.1240]} zoom={7} className="map">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {userLocation && trekkingRoutes.map((route, index) => (
          <React.Fragment key={index}>
            {/* Route from user's location to start of trek (yellow) */}
            <Polyline
              positions={[userLocation, route.start]}
              color="yellow"
              weight={4}
            >
              <Popup>{`From your location to ${route.name} start`}</Popup>
            </Polyline>

            {/* Trekking route (red) */}
            <Polyline
              positions={[route.start, ...route.route, route.end]}
              color="red"
              weight={4}
            >
              <Popup>{route.name}</Popup>
            </Polyline>

            {/* Markers for start and end points */}
            <Marker position={route.start}>
              <Popup>{`${route.name} Start`}</Popup>
            </Marker>
            <Marker position={route.end}>
              <Popup>{`${route.name} End`}</Popup>
            </Marker>
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
    <div>
        <Footer/>
    </div>
    </>
  );
};

export default Map;
