import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config'; // <-- Import API base
const AddMember = () => {
const params = new URLSearchParams(window.location.search);
const [familyId, setFamilyId] = useState(params.get('family_id') || '');
  const [familyHead, setFamilyHead] = useState('');
  const [familyMobile, setFamilyMobile] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [relationship, setRelationship] = useState('');
  const [qualification, setQualification] = useState('');
  const [profession, setProfession] = useState('');
  const [residingHere, setResidingHere] = useState(true);
  const [churchGroup, setChurchGroup] = useState('');
  const [active, setActive] = useState(true);
  const [baptismDate, setBaptismDate] = useState('');
  const [holyCommunionDate, setHolyCommunionDate] = useState('');
  const [holyCommunionPlace, setHolyCommunionPlace] = useState('');
  const [confirmationDate, setConfirmationDate] = useState('');
  const [confirmationPlace, setConfirmationPlace] = useState('');
  const [marriageDate, setMarriageDate] = useState('');
  const [marriagePlace, setMarriagePlace] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [headAsMember, setHeadAsMember] = useState(false);
  const [baptismPlace, setBaptismPlace] = useState('');
const [sex, setSex] = useState('');
  const token = localStorage.getItem('token');

  // Calculate age from dob whenever dob changes
  useEffect(() => {
    if (!dob) {
      setAge('');
      return;
    }
    const birthDate = new Date(dob);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
    setAge(calculatedAge >= 0 ? calculatedAge.toString() : '');
  }, [dob]);

  // Fetch family head name & mobile when familyId changes
  useEffect(() => {
    if (!familyId) {
      setFamilyHead('');
      setFamilyMobile('');
      if (headAsMember) {
        setName('');
        setHeadAsMember(false);
      }
      return;
    }
    const fetchFamilyDetails = async () => {
      try {
      const res = await axios.get(`${API_BASE_URL}/family/${familyId}`, { headers: { Authorization: `Bearer ${token}` } });
        setFamilyHead(res.data.head_name || '');
        setFamilyMobile(res.data.mobile_number || '');
        if (headAsMember) {
          setName(res.data.head_name || '');
        }
        setError('');
      } catch {
        setFamilyHead('');
        setFamilyMobile('');
        setError('Family not found');
        setName('');
      }
    };
    fetchFamilyDetails();
  }, [familyId, headAsMember, token]);

  // Handle checkbox toggle
 const toggleHeadAsMember = (checked) => {
  setHeadAsMember(checked);
  if (checked) {
    setName(familyHead);
    setRelationship('Head'); // <-- Set relationship to Head
  } else {
    setName('');
    setRelationship(''); // <-- Clear relationship
  }
};

  const handleAddMember = async () => {
    setMessage('');
    setError('');

    if (!familyId || !name || !dob) {
      setError('Please fill required fields: Family ID, Name, Date of Birth');
      return;
    }

    try {
      const res = await axios.post(
        `${API_BASE_URL}/member/add`,
        {
          family_id: familyId,
          name,
          age: age ? parseInt(age) : null,
          dob,
          marital_status: maritalStatus || null,
          relationship: relationship || null,
          qualification: qualification || null,
          profession: profession || null,
          residing_here: residingHere,
          church_group: churchGroup || null,
          active: active,
          baptism_date: baptismDate || null,
          baptism_place: baptismPlace || null, // <-- Add this line
          holy_communion_date: holyCommunionDate || null,
          holy_communion_place: holyCommunionPlace || null,
          confirmation_date: confirmationDate || null,
          confirmation_place: confirmationPlace || null,
          marriage_date: marriageDate || null,
          marriage_place: marriagePlace || null,
           sex: sex || null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(`Member ${res.data.name} added successfully. Member ID: ${res.data.member_id}`);
      setError('');
      // Reset form except familyId so user can add multiple members
      setName('');
      setDob('');
      setAge('');
      setMaritalStatus('');
      setRelationship('');
      setQualification('');
      setProfession('');
      setResidingHere(true);
      setChurchGroup('');
      setActive(true);
      setBaptismDate('');
      setHolyCommunionDate('');
      setHolyCommunionPlace('');
      setConfirmationDate('');
      setConfirmationPlace('');
      setMarriageDate('');
      setMarriagePlace('');
      setHeadAsMember(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to add member. Check Family ID.');
      setMessage('');
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: 'auto' }}>
      <h2>Add Member</h2>

      <label>
        Family ID*:
        <input
          placeholder="Family ID"
          value={familyId}
          onChange={(e) => setFamilyId(e.target.value.toUpperCase())}
          required
        />
      </label>
      {error === 'Family not found' && <p style={{ color: 'red' }}>Family not found</p>}

      {familyHead && (
        <>
          <p>
            <strong>Family Head:</strong> {familyHead}
          </p>
          <p>
            <strong>Family Mobile:</strong> {familyMobile}
          </p>
        </>
      )}

      <label>
        <input
          type="checkbox"
          checked={headAsMember}
          onChange={(e) => toggleHeadAsMember(e.target.checked)}
          disabled={!familyHead}
        />{' '}
        Head as Member
      </label>

      <label>
        Name*:
        <input
          placeholder="Member Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={headAsMember}
        />
      </label>
<label>
  Sex:
  <select value={sex} onChange={(e) => setSex(e.target.value)} required>
    <option value="">--Select--</option>
    <option value="Male">Male</option>
    <option value="Female">Female</option>
    <option value="Transgender">Transgender</option>
  </select>
</label>
      <label>
        Date of Birth*:
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          required
        />
      </label>

      <label>
        Age:
        <input type="number" value={age} readOnly placeholder="Auto-calculated age" />
      </label>

      <label>
        Marital Status:
        <select value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)}>
          <option value="">--Select--</option>
          <option value="Single">Single</option>
          <option value="Married">Married</option>
          <option value="Divorced">Divorced</option>
          <option value="Widowed">Widowed</option>
        </select>
      </label>

      <label>
        Relationship:
        <select value={relationship} onChange={(e) => setRelationship(e.target.value)}>
          <option value="">--Select--</option>
          <option value="Head">Head</option>
          <option value="Son">Son</option>
          <option value="Spouse">Spouse</option>
          <option value="Daughter">Daughter</option>
          <option value="Daughter in law">Daughter in law</option>
          <option value="Son in law">Son in law</option>
          <option value="Grandson">Grandson</option>
          <option value="Grandfather">Grandfather</option>
          <option value="Grandmother">Grandmother</option>
          <option value="Grand daughter">Grand daughter</option>
          <option value="Others">Others</option>
          <option value="Father in law">Father in law</option>
          <option value="Mother in law">Mother in law</option>
        </select>
      </label>

      <label>
        Qualification:
        <input
          placeholder="Qualification"
          value={qualification}
          onChange={(e) => setQualification(e.target.value)}
        />
      </label>

      <label>
        Profession:
        <select value={profession} onChange={(e) => setProfession(e.target.value)}>
          <option value="">--Select--</option>
          <option value="Student">Student</option>
          <option value="Labour">Labour</option>
          <option value="Housewife">Housewife</option>
          <option value="Business">Business</option>
          <option value="Govt">Govt</option>
          <option value="Private sector">Private sector</option>
        </select>
      </label>

      <label>
        Residing Here:
        <input
          type="checkbox"
          checked={residingHere}
          onChange={() => setResidingHere(!residingHere)}
        />
      </label>

      <label>
        Church Group:
        <input
          placeholder="Church Group"
          value={churchGroup}
          onChange={(e) => setChurchGroup(e.target.value)}
        />
      </label>

      <label>
        Active:
        <input
          type="checkbox"
          checked={active}
          onChange={() => setActive(!active)}
        />
      </label>

      <hr />

      <label>
        Baptism Date:
        <input
          type="date"
          value={baptismDate}
          onChange={(e) => setBaptismDate(e.target.value)}
        />
      </label>
<label>
  Baptism Place:
  <input
    placeholder="Place"
    value={baptismPlace}
    onChange={(e) => setBaptismPlace(e.target.value)}
  />
</label>
      <label>
        Holy Communion Date:
        <input
          type="date"
          value={holyCommunionDate}
          onChange={(e) => setHolyCommunionDate(e.target.value)}
        />
      </label>

      <label>
        Holy Communion Place:
        <input
          placeholder="Place"
          value={holyCommunionPlace}
          onChange={(e) => setHolyCommunionPlace(e.target.value)}
        />
      </label>

      <label>
        Confirmation Date:
        <input
          type="date"
          value={confirmationDate}
          onChange={(e) => setConfirmationDate(e.target.value)}
        />
      </label>

      <label>
        Confirmation Place:
        <input
          placeholder="Place"
          value={confirmationPlace}
          onChange={(e) => setConfirmationPlace(e.target.value)}
        />
      </label>

      <label>
        Marriage Date:
        <input
          type="date"
          value={marriageDate}
          onChange={(e) => setMarriageDate(e.target.value)}
        />
      </label>

      <label>
        Marriage Place:
        <input
          placeholder="Place"
          value={marriagePlace}
          onChange={(e) => setMarriagePlace(e.target.value)}
        />
      </label>

      <button onClick={handleAddMember} style={{ marginTop: 15 }}>
        Add Member
      </button>

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && error !== 'Family not found' && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default AddMember;
