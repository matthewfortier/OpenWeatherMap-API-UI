import React from 'react'
import { Map as LeafletMap, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';

class Map extends React.Component {
  render() {
    let icon = new L.Icon({
      iconUrl: `./assets/icons/animated/${this.props.icon}`,
      iconSize: [75, 75],
      iconAnchor: [0, 0]
    });

    return (
      <LeafletMap
        center={this.props.coords}
        zoom={13}
        animate={true}
      >
        <TileLayer
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
        />
        <Marker position={this.props.coords} icon={icon} />
      </LeafletMap>
    );
  }
}

export default Map