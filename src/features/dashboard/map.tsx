'use client';
import { useGetTrips, useGetTripsNoFilter } from '@/api/trips';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMapEvents
} from 'react-leaflet';
import L from 'leaflet'; // Import Leaflet for custom icons
import customMarkerIcon from '@/assets/marker.png';
import customDestinationMarkerIcon from '@/assets/destination-marker.png';
import { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import TripsVisualization from './trips-visualization';
import { toast } from 'sonner';

export interface Trip {
  pickup_latitude: number;
  pickup_longitude: number;
  dropoff_latitude: number;
  dropoff_longitude: number;
  payment_type: string;
  fare_amount: string;
  mta_tax: string;
  tip_amount: string;
  tolls_amount: string;
  total_amount: string;
  imp_surcharge: string;
  rate_code: string;
  vendor_id: string;
  pickup_datetime: string;
  dropoff_datetime: string;
  passenger_count: string;
}

// Define custom marker icon
const taxiIcon = L.icon({
  iconUrl: customMarkerIcon.src, // Use src for Next.js imports
  iconSize: [30, 30], // Width & height of the icon
  iconAnchor: [15, 30], // Anchor point
  popupAnchor: [0, -30] // Popup position
});

// Tambahkan marker tujuan baru dengan custom icon
const destinationIcon = L.icon({
  iconUrl: customDestinationMarkerIcon.src, // Ganti dengan path gambar yang valid
  iconSize: [40, 40], // Sesuaikan ukuran ikon
  iconAnchor: [20, 40], // Titik anchor (bagian bawah ikon menyentuh lokasi)
  popupAnchor: [0, -40] // Popup muncul di atas ikon
});

const Map = () => {
  const [selectedRoute, setSelectedRoute] = useState<[number, number][]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Ambil parameter dari URL
  const minTimeParam = searchParams.get('min_time');
  const maxTimeParam = searchParams.get('max_time');
  const minFareParam = searchParams.get('min_fare');
  const maxFareParam = searchParams.get('max_fare');
  const paymentTypeParam = searchParams.get('payment_type');

  // State untuk form input
  const [minTime, setMinTime] = useState(minTimeParam || '');
  const [maxTime, setMaxTime] = useState(maxTimeParam || '');
  const [minFare, setMinFare] = useState(minFareParam || '');
  const [maxFare, setMaxFare] = useState(maxFareParam || '');
  const [paymentType, setPaymentType] = useState(paymentTypeParam || '');

  // Membuat filter berdasarkan parameter yang ada
  const filters = useMemo(
    () => ({
      ...(minTime && { min_time: minTime }),
      ...(maxTime && { max_time: maxTime }),
      ...(minFare && { min_fare: minFare }),
      ...(maxFare && { max_fare: maxFare }),
      ...(paymentType && { payment_type: paymentType })
    }),
    [minTime, maxTime, minFare, maxFare, paymentType]
  );

  const { trips, tripsLoading } = useGetTrips(filters);
  const [visibleMarkerIndex, setVisibleMarkerIndex] = useState<number | null>(
    null
  );
  const [tripInfo, setTripInfo] = useState<{
    distance: number;
    duration: number;
  } | null>(null);

  const tripsData: Trip[] = trips || [];
  const mapRef = useRef<L.Map | null>(null); // Simpan referensi peta

  useEffect(() => {
    applyFilter();
  }, [minTime, maxTime, minFare, maxFare, paymentType]);

  // Fungsi untuk menerapkan filter ke URL
  const applyFilter = () => {
    const params = new URLSearchParams();
    if (minTime) params.set('min_time', minTime);
    if (maxTime) params.set('max_time', maxTime);
    if (minFare) params.set('min_fare', minFare);
    if (maxFare) params.set('max_fare', maxFare);
    if (paymentType) params.set('payment_type', paymentType);

    router.push(`?${params.toString()}`);
  };

  // Fungsi untuk reset filter
  const resetFilter = () => {
    setMinTime('');
    setMaxTime('');
    setMinFare('');
    setMaxFare('');
    setPaymentType('');

    router.push(`?`); // Reset URL ke tanpa parameter
  };

  const fetchRoute = async (trip: Trip, index: number) => {
    setSelectedRoute([]);
    setVisibleMarkerIndex(index);
    setTripInfo(null);

    if (
      trip.pickup_latitude === trip.dropoff_latitude &&
      trip.pickup_longitude === trip.dropoff_longitude
    ) {
      toast.error('Error: Pickup and dropoff locations are the same.');
      return;
    }
    // redeploy
    const API_KEY = process.env.NEXT_PUBLIC_TOKEN_API_ROUTE;
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${API_KEY}&start=${trip.pickup_longitude},${trip.pickup_latitude}&end=${trip.dropoff_longitude},${trip.dropoff_latitude}`;

    try {
      const res = await axios.get(url);
      console.log('API Response:', res.data);

      const feature = res.data.features?.[0];
      if (!feature) {
        console.error('No feature data found:', res.data);
        return;
      }

      const coordinates = feature.geometry?.coordinates?.map(
        ([lon, lat]: [number, number]) => [lat, lon]
      );

      if (!coordinates || coordinates.length === 0) {
        console.error('No coordinates found:', feature);
        return;
      }

      // Ambil jarak & durasi jika tersedia
      const distanceInKm = (
        feature.properties?.summary?.distance / 1000
      )?.toFixed(2);
      const durationInMinutes = Math.ceil(
        feature.properties?.summary?.duration / 60
      );

      setTripInfo({
        distance: distanceInKm ? Number(distanceInKm) : 0,
        duration: durationInMinutes || 0
      });

      setSelectedRoute(coordinates);

      if (mapRef.current) {
        const bounds = L.latLngBounds(coordinates);
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });

        // Pastikan `mapRef.current` memiliki tipe yang bisa menyimpan `_destinationMarker`
        const mapInstance = mapRef.current as L.Map & {
          _destinationMarker?: L.Marker;
        };

        // Hapus marker tujuan sebelumnya jika ada
        if (mapInstance._destinationMarker) {
          mapInstance.removeLayer(mapInstance._destinationMarker);
        }

        // Tambahkan marker tujuan baru
        const destinationMarker = L.marker(
          [trip.dropoff_latitude, trip.dropoff_longitude],
          { icon: destinationIcon }
        ).addTo(mapInstance);

        // Simpan marker tujuan ke dalam `mapInstance`
        mapInstance._destinationMarker = destinationMarker;
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  // Custom component to handle map click event
  const MapClickHandler = () => {
    useMapEvents({
      click: () => {
        setVisibleMarkerIndex(null); // Sembunyikan semua marker
        setSelectedRoute([]); // Hapus jalur yang sudah ada
      }
    });
    return null;
  };

  return (
    <div className='w-full'>
      <div className='mb-4'>
        <h2 className='mb-4 text-2xl font-bold'>
          Filter Data Perjalanan Taksi
        </h2>

        {/* Form Filter */}
        <div className='grid grid-cols-1 gap-4 rounded-lg bg-gray-100 p-4 md:grid-cols-3'>
          <div>
            <label className='mb-1 block text-sm font-semibold text-gray-700'>
              Waktu Mulai (Min Time)
            </label>
            <input
              type='datetime-local'
              value={minTime}
              onChange={(e) => setMinTime(e.target.value)}
              className='w-full rounded border p-2'
            />
          </div>

          <div>
            <label className='mb-1 block text-sm font-semibold text-gray-700'>
              Waktu Selesai (Max Time)
            </label>
            <input
              type='datetime-local'
              value={maxTime}
              onChange={(e) => setMaxTime(e.target.value)}
              className='w-full rounded border p-2'
            />
          </div>

          <div>
            <label className='mb-1 block text-sm font-semibold text-gray-700'>
              Tarif Min (Min Fare)
            </label>
            <input
              type='number'
              value={minFare}
              onChange={(e) => setMinFare(e.target.value)}
              className='w-full rounded border p-2'
            />
          </div>

          <div>
            <label className='mb-1 block text-sm font-semibold text-gray-700'>
              Tarif Max (Max Fare)
            </label>
            <input
              type='number'
              value={maxFare}
              onChange={(e) => setMaxFare(e.target.value)}
              className='w-full rounded border p-2'
            />
          </div>

          <div>
            <label className='mb-1 block text-sm font-semibold text-gray-700'>
              Metode Pembayaran
            </label>
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              className='w-full rounded border p-2'
            >
              <option value=''>Semua</option>
              <option value='CSH'>Cash</option>
              <option value='CRD'>Credit Card</option>
              <option value='NOC'>No Charge</option>
            </select>
          </div>
        </div>

        {/* Tombol Filter */}
        <button
          onClick={resetFilter}
          className='mt-2 rounded bg-gray-500 px-4 py-2 text-white'
        >
          Reset Filter
        </button>
      </div>
      <TripsVisualization trips={tripsData} tripsLoading={tripsLoading} />
      <div className='relative h-[60vh] w-full'>
        {tripsLoading && <div>Loading Map...</div>}
        {!tripsLoading && (
          <>
            <MapContainer
              style={{ height: '100%', minHeight: '100%' }}
              center={[40.7128, -74.006]}
              zoom={13}
              ref={mapRef}
            >
              <MapClickHandler />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              />

              {/* Show only the clicked marker */}
              {tripsData.map(
                (trip, index) =>
                  (visibleMarkerIndex === null ||
                    visibleMarkerIndex === index) && (
                    <Marker
                      key={`marker-${index}`}
                      position={[trip.pickup_latitude, trip.pickup_longitude]}
                      icon={taxiIcon}
                      eventHandlers={{
                        click: () => fetchRoute(trip, index)
                      }}
                    >
                      <Popup>
                        <b>Fare:</b> ${trip.fare_amount}
                        <br />
                        <b>Payment:</b> {trip.payment_type}
                        <br />
                        {tripInfo && visibleMarkerIndex === index && (
                          <>
                            <b>Distance:</b> {tripInfo.distance} km
                            <br />
                            <b>Duration:</b> {tripInfo.duration} minutes
                          </>
                        )}
                      </Popup>
                    </Marker>
                  )
              )}

              {/* Show shortest trip route only when a marker is clicked */}
              {selectedRoute.length > 0 && (
                <Polyline
                  positions={selectedRoute}
                  color='blue'
                  weight={5}
                  opacity={0.8}
                />
              )}
            </MapContainer>
            {/* Show All Markers Button */}
            {visibleMarkerIndex !== null && (
              <button
                className='absolute right-4 top-4 z-[1000] rounded-md bg-blue-500 px-4 py-2 text-white shadow-md'
                onClick={() => setVisibleMarkerIndex(null)}
              >
                Show All Markers
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Map;
