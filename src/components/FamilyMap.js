import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import API_BASE_URL from '../config';
import { Icon } from 'leaflet';

// Custom icon for map markers
const customIcon = new Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/484/484167.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const defaultCenter = [10.7905, 78.7047]; // fallback if geolocation fails

const FamilyMap = () => {
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [anbiyamList, setAnbiyamList] = useState([]);
  const [selectedAnbiyam, setSelectedAnbiyam] = useState('');
  const [selectedFamilyId, setSelectedFamilyId] = useState('');
  const [searchText, setSearchText] = useState('');
  const [mapCenter, setMapCenter] = useState(defaultCenter);

  const token = localStorage.getItem('token');

  // Get user location once on mount
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setMapCenter([latitude, longitude]);
      },
      (error) => {
        console.warn('Geolocation not available or denied, using default.', error);
      }
    );
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/family/list`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFamilies(res.data || []);
        const uniqueAnbiyams = [...new Set(res.data.map(f => f.anbiyam).filter(Boolean))];
        setAnbiyamList(uniqueAnbiyams);
      } catch (err) {
        console.error('Failed to fetch family data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const filteredFamilies = useMemo(() => {
    return families.filter(f =>
      f.location &&
      (!selectedAnbiyam || f.anbiyam === selectedAnbiyam) &&
      (!selectedFamilyId || f.family_id === selectedFamilyId) &&
      (!searchText ||
        [f.head_name, f.address_line1, f.address_line2, f.mobile_number]
          .some(val =>
            val?.toString().toLowerCase().includes(searchText.toLowerCase())
          ))
    );
  }, [families, selectedAnbiyam, selectedFamilyId, searchText]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" fontWeight={700} mb={2} color="#0B3D91">
        Family Locations Map
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Filter by Anbiyam"
          select
          value={selectedAnbiyam}
          onChange={(e) => {
            setSelectedAnbiyam(e.target.value);
            setSelectedFamilyId('');
          }}
          size="small"
          sx={{ flex: 1, minWidth: 250 }}
        >
          <MenuItem value="">All</MenuItem>
          {anbiyamList.map(anbiyam => (
            <MenuItem key={anbiyam} value={anbiyam}>{anbiyam}</MenuItem>
          ))}
        </TextField>

        <TextField
          label="Filter by Family ID"
          select
          value={selectedFamilyId}
          onChange={(e) => setSelectedFamilyId(e.target.value)}
          size="small"
          sx={{ flex: 1, minWidth: 250 }}
        >
          <MenuItem value="">All</MenuItem>
          {families
            .filter(f => !selectedAnbiyam || f.anbiyam === selectedAnbiyam)
            .map(fam => (
              <MenuItem key={fam.family_id} value={fam.family_id}>
                {fam.family_id}
              </MenuItem>
            ))}
        </TextField>

        <TextField
          label="Search (Name, Address, Mobile)"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          size="small"
          sx={{ flex: 1, minWidth: 250 }}
        />
      </Box>

      {loading ? (
        <Box textAlign="center" py={5}>
          <CircularProgress />
        </Box>
      ) : (
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: '70vh', width: '100%', borderRadius: 10 }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />

          {filteredFamilies.map(f => {
            const [lat, lng] = f.location.split(',').map(Number);
            return (
              <Marker key={f.family_id} position={[lat, lng]} icon={customIcon}>
                <Popup>
                  <strong>{f.head_name}</strong><br />
                  ID: {f.family_id}<br />
                  {f.anbiyam && <>Anbiyam: {f.anbiyam}<br /></>}
                  {f.address_line1 && <>{f.address_line1}<br /></>}
                  {f.address_line2 && <>{f.address_line2}<br /></>}
                  {f.mobile_number && <>📞 {f.mobile_number}<br /></>}
                  <br />
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#0B3D91', fontWeight: 'bold' }}
                  >
                    🚗 Navigate
                  </a>
                  <br />
                  <button
                    onClick={() => {
                      const shareLink = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
                      navigator.clipboard.writeText(shareLink);
                      alert('📍 Location link copied to clipboard!');
                    }}
                    style={{
                      marginTop: 8,
                      padding: '4px 8px',
                      fontSize: '0.8rem',
                      backgroundColor: '#0B3D91',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                    }}
                  >
                    🔗 Copy Share Link
                  </button>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      )}
    </Box>
  );
};

export default FamilyMap;
