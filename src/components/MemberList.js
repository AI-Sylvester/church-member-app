import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

// Format date to dd-MMM-yyyy
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).replace(/ /g, '-'); // Example: 20-Jun-2025
};

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${API_BASE_URL}/member/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMembers(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load members');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [token]);

  return (
    <div style={{ maxWidth: 900, margin: 'auto' }}>
      <h2>All Members</h2>

      {loading && <p>Loading members...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && members.length === 0 && <p>No members found.</p>}

      {members.length > 0 && (
        <table
          border="1"
          cellPadding="5"
          style={{ borderCollapse: 'collapse', width: '100%' }}
        >
          <thead>
            <tr>
              <th>Member ID</th>
              <th>Name</th>
              <th>Sex</th>
              <th>Date of Birth</th>
              <th>Age</th>
              <th>Relationship</th>
              <th>Marital Status</th>
              <th>Qualification</th>
              <th>Profession</th>
              <th>Residing Here</th>
              <th>Church Group</th>
              <th>Active</th>
              <th>Baptism Date</th>
              <th>Baptism Place</th>
              <th>Holy Communion Date</th>
              <th>Holy Communion Place</th>
              <th>Confirmation Date</th>
              <th>Confirmation Place</th>
              <th>Marriage Date</th>
              <th>Marriage Place</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.member_id}>
                <td>{member.member_id}</td>
                <td>{member.name}</td>
                <td>{member.sex || '-'}</td>
                <td>{formatDate(member.dob)}</td>
                <td>{member.age !== null ? member.age : '-'}</td>
                <td>{member.relationship || '-'}</td>
                <td>{member.marital_status || '-'}</td>
                <td>{member.qualification || '-'}</td>
                <td>{member.profession || '-'}</td>
                <td>{member.residing_here ? 'Yes' : 'No'}</td>
                <td>{member.church_group || '-'}</td>
                <td>{member.active ? 'Yes' : 'No'}</td>
                <td>{formatDate(member.baptism_date)}</td>
                <td>{member.baptism_place || '-'}</td>
                <td>{formatDate(member.holy_communion_date)}</td>
                <td>{member.holy_communion_place || '-'}</td>
                <td>{formatDate(member.confirmation_date)}</td>
                <td>{member.confirmation_place || '-'}</td>
                <td>{formatDate(member.marriage_date)}</td>
                <td>{member.marriage_place || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MemberList;
