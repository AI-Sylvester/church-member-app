import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
const FamilyDetails = () => {
  const [families, setFamilies] = useState([]);           // array of family IDs (strings)
  const [selectedFamilyId, setSelectedFamilyId] = useState('');
  const [familyDetails, setFamilyDetails] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);

  // Get auth token from localStorage (adjust if stored elsewhere)
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Fetch only family IDs for dropdown with auth header
    axios.get(`${API_BASE_URL}/family/ids`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setFamilies(res.data))
      .catch(err => console.error('Error loading family IDs:', err));
  }, [token]);

  useEffect(() => {
    if (!selectedFamilyId) {
      setFamilyDetails(null);
      setFamilyMembers([]);
      return;
    }

    // Fetch family details by ID with auth header
    axios.get(`http://localhost:5000/api/family/${selectedFamilyId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setFamilyDetails(res.data))
      .catch(err => console.error('Error loading family details:', err));

    // Fetch all members and filter by selected familyId prefix with auth header
    axios.get('http://localhost:5000/api/members/all', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const members = res.data.filter(m => m.member_id.startsWith(selectedFamilyId));
        setFamilyMembers(members);
      })
      .catch(err => console.error('Error loading family members:', err));
  }, [selectedFamilyId, token]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Family Dashboard</h2>
        <select
          className="form-select w-auto"
          value={selectedFamilyId}
          onChange={(e) => setSelectedFamilyId(e.target.value)}
        >
          <option value="">Select Family ID</option>
          {families.map(famId => (
            <option key={famId} value={famId}>
              {famId}
            </option>
          ))}
        </select>
      </div>

      {familyDetails && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">{familyDetails.head_name} ({selectedFamilyId})</h5>
            <p className="card-text">
              <strong>Address:</strong> {familyDetails.address_line1 || ''}, {familyDetails.address_line2 || ''}, {familyDetails.city || ''}, {familyDetails.pincode || ''} <br />
              <strong>Mobile:</strong> {familyDetails.mobile_number || ''} / {familyDetails.mobile_number2 || ''} <br />
              <strong>Cemetery:</strong> {familyDetails.cemetery || ''} | <strong>Native:</strong> {familyDetails.native || ''}
            </p>
          </div>
        </div>
      )}

      {familyMembers.length > 0 && (
        <div>
          <h4>Family Members</h4>
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Member ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>DOB</th>
                <th>Relationship</th>
                <th>Profession</th>
                <th>Residing</th>
              </tr>
            </thead>
            <tbody>
              {familyMembers.map(mem => (
                <tr key={mem.member_id}>
                  <td>{mem.member_id}</td>
                  <td>{mem.name}</td>
                  <td>{mem.age}</td>
                  <td>{mem.dob}</td>
                  <td>{mem.relationship}</td>
                  <td>{mem.profession}</td>
                  <td>{mem.residing_here ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedFamilyId && familyMembers.length === 0 && (
        <p>No family members found for this family.</p>
      )}
    </div>
  );
};

export default FamilyDetails;
