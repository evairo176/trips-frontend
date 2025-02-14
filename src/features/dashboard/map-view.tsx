'use client';
import React from 'react';

import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';

const TripMap = dynamic(() => import('./map'), { ssr: false });
type Props = {};

const MapView = (props: Props) => {
  return (
    <div>
      <div>Map View</div>
      <TripMap />
    </div>
  );
};

export default MapView;
