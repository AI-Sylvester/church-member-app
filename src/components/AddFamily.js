import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config'; // <-- Import API base
const AddFamily = () => {
  const navigate = useNavigate();

  const initialForm = {
    head_name: '',
    address_line1: '',
    address_line2: '',
    city: '',
    pincode: '',
    mobile_number: '',
    mobile_number2: '',
    cemetery: 'no',
    native: '',
    resident_from: '',
    house_type: 'Own',
    subscription: '',
    anbiyam: '',
    family_pic: '',
    cemetery_number: '',
    old_card_number: '',
    active: true,
    location: ''
  };

  const [form, setForm] = useState(initialForm);
  const [family, setFamily] = useState(null);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
const [file, setFile] = useState(null);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

const createFamily = async () => {
  const formData = new FormData();
  Object.entries(form).forEach(([key, value]) => {
    formData.append(key, value);
  });
  if (file) {
    formData.append('family_pic', file);
  }

  try {
    const res = await axios.post(`${API_BASE_URL}/family/create`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    setFamily(res.data);
    setError('');
  } catch (err) {
    console.error(err);
    setError('Failed to create family');
  }
};

  const resetForm = () => {
    setForm(initialForm);
    setFamily(null);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <h2>Create Family</h2>

      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
      <input name="head_name" placeholder="Head Name" value={form.head_name} onChange={handleChange} />
      <input name="address_line1" placeholder="Address Line 1" value={form.address_line1} onChange={handleChange} />
      <input name="address_line2" placeholder="Address Line 2" value={form.address_line2} onChange={handleChange} />
      <input name="city" placeholder="City" value={form.city} onChange={handleChange} />
      <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} />
      <input name="mobile_number" placeholder="Mobile Number" value={form.mobile_number} onChange={handleChange} />
      <input name="mobile_number2" placeholder="Alternate Mobile" value={form.mobile_number2} onChange={handleChange} />

      <select name="cemetery" value={form.cemetery} onChange={handleChange}>
        <option value="no">No</option>
        <option value="yes">Yes</option>
      </select>

      <input name="anbiyam" placeholder="Anbiyam" value={form.anbiyam} onChange={handleChange} />
      <input name="cemetery_number" placeholder="Cemetery Number" value={form.cemetery_number} onChange={handleChange} />
      <input name="native" placeholder="Native" value={form.native} onChange={handleChange} />
      <input name="resident_from" placeholder="Resident From" value={form.resident_from} onChange={handleChange} />

      <select name="house_type" value={form.house_type} onChange={handleChange}>
        <option value="Own">Own</option>
        <option value="Rental">Rental</option>
        <option value="Lease">Lease</option>
      </select>

      <input name="subscription" placeholder="Subscription" value={form.subscription} onChange={handleChange} />
      <input name="old_card_number" placeholder="Old Card Number" value={form.old_card_number} onChange={handleChange} />
      <input name="location" placeholder="Location" value={form.location} onChange={handleChange} />

      <label>
        Active
        <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />
      </label>

      <button onClick={createFamily}>Create Family</button>

      {family && (
        <div style={{ marginTop: '20px' }}>
          <p style={{ color: 'green' }}>Family created successfully!</p>
          <p><strong>Family ID:</strong> {family.family_id}</p>
          <button onClick={() => navigate(`/add-member?family_id=${family.family_id}`)}>Add Member</button>
          <button onClick={resetForm} style={{ marginLeft: '10px' }}>Add New</button>
        </div>
      )}
{family?.family_pic && (
 <img src={`${API_BASE_URL}${family.family_pic}`} 
    alt="Family"
    style={{ width: 200, marginTop: 10 }}
  />
)}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default AddFamily;
