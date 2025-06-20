import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

const FamilyList = () => {
  const [families, setFamilies] = useState([]);
  const [error, setError] = useState('');
  const [visibleImageSrc, setVisibleImageSrc] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchFamilies = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/family/list`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFamilies(res.data);
        setError('');
      } catch (err) {
        console.error(err);
        setError('Failed to load family records');
      }
    };

    fetchFamilies();
  }, [token]);

  const openModal = (imageSrc) => setVisibleImageSrc(imageSrc);
  const closeModal = () => setVisibleImageSrc(null);

  return (
    <div>
      <h2>Family Records</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {families.length === 0 ? (
        <p>No family records found.</p>
      ) : (
        <>
          <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th>Family ID</th>
                <th>Head Name</th>
                <th>City</th>
                <th>Mobile</th>
                <th>Active</th>
                <th>Picture</th>
              </tr>
            </thead>
            <tbody>
              {families.map(fam => (
                <tr key={fam.family_id}>
                  <td>{fam.family_id}</td>
                  <td>{fam.head_name}</td>
                  <td>{fam.city}</td>
                  <td>{fam.mobile_number}</td>
                  <td>{fam.active ? 'Yes' : 'No'}</td>
                  <td>
                    {fam.family_pic ? (
                      <button onClick={() => openModal(`${API_BASE_URL}/uploads/${fam.family_pic}`)}>
                        See Image
                      </button>
                    ) : (
                      'No Image'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Modal */}
          {visibleImageSrc && (
            <div
              onClick={closeModal}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0,0,0,0.6)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
                cursor: 'pointer',
              }}
            >
              <div
                onClick={e => e.stopPropagation()}
                style={{
                  position: 'relative',
                  backgroundColor: '#222',
                  padding: '15px',
                  borderRadius: '8px',
                  boxShadow: '0 0 15px rgba(255,255,255,0.3)',
                  maxWidth: '500px',
                  width: '90%',
                  maxHeight: '70vh',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'auto',
                  flexDirection: 'column',
                }}
              >
                <img
                  src={visibleImageSrc}
                  alt="Family"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '60vh',
                    borderRadius: '4px',
                    objectFit: 'contain',
                  }}
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300?text=No+Image';
                  }}
                />
                {/* Close button inside modal, top-right */}
                <button
                  onClick={closeModal}
                  aria-label="Close"
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'transparent',
                    border: 'none',
                    color: 'white',
                    fontSize: '24px',
                    cursor: 'pointer',
                    padding: 0,
                    lineHeight: 1,
                  }}
                >
                  &times;
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FamilyList;
