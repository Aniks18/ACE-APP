import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const IndiaDiseaseMap = ({ diseaseData, selectedDisease }) => {
  const [indiaStates, setIndiaStates] = useState(null);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson')
      .then(response => response.json())
      .then(data => {
        const processedData = {
          ...data,
          features: data.features.map(feature => ({
            ...feature,
            properties: {
              ...feature.properties,
              state: feature.properties.NAME_1
            }
          }))
        };
        setIndiaStates(processedData);
      });
  }, []);

  const getColor = (severity) => {
    return severity === 'very high' ? '#800026' :
           severity === 'high' ? '#BD0026' :
           severity === 'medium' ? '#FC4E2A' :
           severity === 'low' ? '#FED976' :
                      '#FFEDA0';
  };

  const style = (feature) => {
    const stateName = feature.properties.state;
    const stateData = diseaseData[selectedDisease][stateName];
    return {
      fillColor: stateData ? getColor(stateData.severity) : '#FFEDA0',
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  };

  const onEachFeature = (feature, layer) => {
    const stateName = feature.properties.state;
    const stateData = diseaseData[selectedDisease][stateName];
    
    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 5,
          color: '#666',
          dashArray: '',
          fillOpacity: 0.7
        });
        layer.bringToFront();
      },
      mouseout: (e) => {
        const layer = e.target;
        layer.setStyle(style(feature));
      },
      click: () => {
        if (stateData) {
          alert(`${stateName}\nCases: ${stateData.cases}\nSeverity: ${stateData.severity}`);
        } else {
          alert(`${stateName}\nNo data available`);
        }
      }
    });
  };

  const MapControl = () => {
    const map = useMap();
    
    useEffect(() => {
      if (!map) return;

      const info = L.control();
      info.onAdd = () => {
        const div = L.DomUtil.create('div', 'info');
        div.innerHTML = '<h4>' + selectedDisease + ' Cases in India</h4><div>Hover over a state</div>';
        return div;
      };
      info.addTo(map);

      const legend = L.control({ position: 'bottomright' });
      legend.onAdd = () => {
        const div = L.DomUtil.create('div', 'info legend');
        const grades = ['low', 'medium', 'high', 'very high'];
        let labels = [];
        for (let i = 0; i < grades.length; i++) {
          labels.push(
            '<i style="background:' + getColor(grades[i]) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '<br>' : '')
          );
        }
        div.innerHTML = labels.join('');
        return div;
      };
      legend.addTo(map);

      return () => {
        info.remove();
        legend.remove();
      };
    }, [map]);

    return null;
  };

  if (!indiaStates) return <div>Loading map data...</div>;

  return (
    <>
      <style jsx>{`
        .info {
          padding: 6px 8px;
          font: 14px/16px Arial, Helvetica, sans-serif;
          background: white;
          background: rgba(255,255,255,0.8);
          box-shadow: 0 0 15px rgba(0,0,0,0.2);
          border-radius: 5px;
        }
        .info h4 {
          margin: 0 0 5px;
          color: #777;
        }
        .legend {
          text-align: left;
          line-height: 18px;
          color: #555;
        }
        .legend i {
          width: 18px;
          height: 18px;
          float: left;
          margin-right: 8px;
          opacity: 0.7;
        }
      `}</style>
      <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON
          data={indiaStates}
          style={style}
          onEachFeature={onEachFeature}
        />
        <MapControl />
      </MapContainer>
    </>
  );
};

export default IndiaDiseaseMap;