import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, TextField, Checkbox, FormControlLabel, FormControl,
  InputLabel, Select, MenuItem, Typography, Button,
} from '@mui/material';
import API_BASE_URL from '../config';

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
  const [baptismPlace, setBaptismPlace] = useState('');
  const [holyCommunionDate, setHolyCommunionDate] = useState('');
  const [holyCommunionPlace, setHolyCommunionPlace] = useState('');
  const [confirmationDate, setConfirmationDate] = useState('');
  const [confirmationPlace, setConfirmationPlace] = useState('');
  const [marriageDate, setMarriageDate] = useState('');
  const [marriagePlace, setMarriagePlace] = useState('');
  const [mobile, setMobile] = useState('');
  const [sex, setSex] = useState('');
  const [headAsMember, setHeadAsMember] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  // Calculate age when DOB changes
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

  // Fetch family head and mobile when familyId changes
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
        const res = await axios.get(`${API_BASE_URL}/family/${familyId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFamilyHead(res.data.head_name || '');
        setFamilyMobile(res.data.mobile_number || '');
        if (headAsMember) {
          setName(res.data.head_name || '');
          setRelationship('Head');
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

  // Handle toggle for Head as Member checkbox
  const handleToggleHeadAsMember = (checked) => {
    setHeadAsMember(checked);
    if (checked) {
      setName(familyHead);
      setRelationship('Head');
    } else {
      setName('');
      setRelationship('');
    }
  };

  // Handle form submit: Add Member
  const handleAddMember = async () => {
    setMessage('');
    setError('');

    if (!familyId || !name || !dob) {
      setError('Please fill required fields: Family ID, Name, Date of Birth');
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/member/add`, {
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
        baptism_place: baptismPlace || null,
        holy_communion_date: holyCommunionDate || null,
        holy_communion_place: holyCommunionPlace || null,
        confirmation_date: confirmationDate || null,
        confirmation_place: confirmationPlace || null,
        marriage_date: marriageDate || null,
        marriage_place: marriagePlace || null,
        sex: sex || null,
        mobile: mobile || null
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage(`Member ${res.data.name} added successfully. Member ID: ${res.data.member_id}`);

      // Clear form fields after success
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
      setBaptismPlace('');
      setHolyCommunionDate('');
      setHolyCommunionPlace('');
      setConfirmationDate('');
      setConfirmationPlace('');
      setMarriageDate('');
      setMarriagePlace('');
      setMobile('');
      setSex('');
      setHeadAsMember(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to add member. Check Family ID.');
    }
  };
  return (
    <Box sx={{  mx: 'auto', mt: 2, px: 2 }}>
  <Box sx={{
  backgroundColor: '#ededda', // Vatican gold
  color: '#000',              // Black text for contrast
  p: 2,
  borderRadius: 2,
  mb: 3,
  textAlign: 'center',
  border: '1px solid #ccc'
}}>
  <Typography variant="h6">Add Member</Typography>
</Box>
      {/* FAMILY INFO */}
   {/* FAMILY INFO */}
<Box sx={{ border: '1px solid #ccc', p: 2, mb: 2, borderRadius: 1 }}>
  <Typography variant="h6" mb={2}>Family Info</Typography>

  <Box
    sx={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 1,
      mb: 2,
    }}
  >
    <Box sx={{ flexBasis: 'calc(33.33% - 16px)' }}>
      <TextField
        label="Family ID*"
        value={familyId}
        onChange={(e) => setFamilyId(e.target.value.toUpperCase())}
        fullWidth
      />
    </Box>
    <Box sx={{ flexBasis: 'calc(33.33% - 16px)' }}>
      <TextField
        label="Family Head"
        value={familyHead}
        InputProps={{ readOnly: true }}
        fullWidth
      />
    </Box>
    <Box sx={{ flexBasis: 'calc(33.33% - 16px)' }}>
      <TextField
        label="Head Mobile"
        value={familyMobile}
        InputProps={{ readOnly: true }}
        fullWidth
      />
    </Box>
  </Box>

  {error === 'Family not found' && (
    <Typography color="error" sx={{ mb: 2 }}>
      {error}
    </Typography>
  )}

  <FormControlLabel
    control={
      <Checkbox
        checked={headAsMember}
        onChange={(e) => handleToggleHeadAsMember(e.target.checked)}
        disabled={!familyHead}
      />
    }
    label="Head as Member"
  />
</Box>
<Box sx={{ border: '1px solid #ccc', p: 2, mb: 2, borderRadius: 1 }}>
  <Typography variant="h6" mb={2}>Member Details</Typography>

  {/* Flex container for 4 fields per row */}
  <Box
    sx={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 1,
      mb: 1,
    }}
  >
    {/* Each item takes 25% minus gap */}
    <Box sx={{ flexBasis: 'calc(25% - 16px)' }}>
      <TextField
        label="Name*"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={headAsMember}
        fullWidth
      />
    </Box>
     <Box sx={{ flexBasis: 'calc(25% - 16px)' }}>
      <TextField
        type="date"
        label="Date of Birth*"
        value={dob}
        onChange={(e) => setDob(e.target.value)}
        InputLabelProps={{ shrink: true }}
        fullWidth
      />
    </Box>
    <Box sx={{ flexBasis: 'calc(25% - 16px)' }}>
      <TextField
        label="Age"
        value={age}
        InputProps={{ readOnly: true }}
        fullWidth
      />
    </Box>
    <Box sx={{ flexBasis: 'calc(25% - 16px)' }}>
      <FormControl fullWidth>
        <InputLabel>Sex</InputLabel>
        <Select
          value={sex}
          onChange={(e) => setSex(e.target.value)}
          label="Sex"
         
        >
          <MenuItem value="">--Select--</MenuItem>
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Transgender">Transgender</MenuItem>
        </Select>
      </FormControl>
    </Box>
   
  </Box>

  <Box
    sx={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 1,
      mb: 1,
    }}
  >
    <Box sx={{ flexBasis: 'calc(25% - 16px)' }}>
      <FormControl fullWidth>
        <InputLabel>Marital Status</InputLabel>
        <Select
          value={maritalStatus}
          onChange={(e) => setMaritalStatus(e.target.value)}
          label="Marital Status"
          
        >
          <MenuItem value="">--Select--</MenuItem>
          <MenuItem value="Single">Single</MenuItem>
          <MenuItem value="Married">Married</MenuItem>
          <MenuItem value="Divorced">Divorced</MenuItem>
          <MenuItem value="Widowed">Widowed</MenuItem>
        </Select>
      </FormControl>
    </Box>
    <Box sx={{ flexBasis: 'calc(25% - 16px)' }}>
      <FormControl fullWidth>
        <InputLabel>Relationship</InputLabel>
        <Select
          value={relationship}
          onChange={(e) => setRelationship(e.target.value)}
          label="Relationship"
          disabled={headAsMember}
        >
          <MenuItem value="">--Select--</MenuItem>
          <MenuItem value="Head">Head</MenuItem>
          <MenuItem value="Spouse">Spouse</MenuItem>
          <MenuItem value="Child">Child</MenuItem>
          <MenuItem value="Parent">Parent</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
      </FormControl>
    </Box>
    <Box sx={{ flexBasis: 'calc(25% - 16px)' }}>
      <TextField
        label="Qualification"
        value={qualification}
        onChange={(e) => setQualification(e.target.value)}
      
        fullWidth
      />
    </Box>
    <Box sx={{ flexBasis: 'calc(25% - 16px)' }}>
      <TextField
        label="Profession"
        value={profession}
        onChange={(e) => setProfession(e.target.value)}
        
        fullWidth
      />
    </Box>
  </Box>

  {/* Residing Here, Church Group, Active, Mobile */}
  <Box
    sx={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 1,
      alignItems: 'center',
    }}
  >
       <Box sx={{ flexBasis: 'calc(25% - 16px)' }}>
      <TextField
        label="Mobile"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        fullWidth
      />
    </Box>
       <Box sx={{ flexBasis: 'calc(25% - 16px)' }}>
      <TextField
        label="Church Group"
        value={churchGroup}
        onChange={(e) => setChurchGroup(e.target.value)}
        fullWidth
      />
    </Box>
     <Box sx={{ flexBasis: 'calc(25% - 16px)' }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={residingHere}
            onChange={(e) => setResidingHere(e.target.checked)}
          />
        }
        label="Residing Here"
      />
    </Box>
    <Box sx={{ flexBasis: 'calc(25% - 16px)' }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
          />
        }
        label="Active"
      />
    </Box>
   </Box>
</Box>

{/* SACRAMENT DETAILS */}
<Box sx={{ border: '1px solid #ccc', p: 2, mb: 2, borderRadius: 1 }}>
  <Typography variant="h6" mb={2}>Sacraments</Typography>

  <Box
    sx={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 1,
      mb: 1,
    }}
  >
    <Box sx={{ flexBasis: 'calc(25% - 16px)' }}>
      <TextField
        type="date"
        label="Baptism Date"
        value={baptismDate}
        onChange={(e) => setBaptismDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        fullWidth
      />
    </Box>
    <Box sx={{ flexBasis: 'calc(25% - 16px)' }}>
      <TextField
        label="Baptism Place"
        value={baptismPlace}
        onChange={(e) => setBaptismPlace(e.target.value)}
        fullWidth
      />
    </Box>
    <Box sx={{ flexBasis: 'calc(25% - 16px)' }}>
      <TextField
        type="date"
        label="Holy Communion Date"
        value={holyCommunionDate}
        onChange={(e) => setHolyCommunionDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        fullWidth
      />
    </Box>
    <Box sx={{ flexBasis: 'calc(25% - 16px)' }}>
      <TextField
        label="Holy Communion Place"
        value={holyCommunionPlace}
        onChange={(e) => setHolyCommunionPlace(e.target.value)}
        fullWidth
      />
    </Box>
  </Box>

  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
    <Box sx={{ flexBasis: 'calc(25% - 16px)' }}>
      <TextField
        type="date"
        label="Confirmation Date"
        value={confirmationDate}
        onChange={(e) => setConfirmationDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        fullWidth
      />
    </Box>
    <Box sx={{ flexBasis: 'calc(25% - 16px)' }}>
      <TextField
        label="Confirmation Place"
        value={confirmationPlace}
        onChange={(e) => setConfirmationPlace(e.target.value)}
        fullWidth
      />
    </Box>
    <Box sx={{ flexBasis: 'calc(25% - 16px)' }}>
      <TextField
        type="date"
        label="Marriage Date"
        value={marriageDate}
        onChange={(e) => setMarriageDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        fullWidth
      />
    </Box>
    <Box sx={{ flexBasis: 'calc(25% - 16px)' }}>
      <TextField
        label="Marriage Place"
        value={marriagePlace}
        onChange={(e) => setMarriagePlace(e.target.value)}
        fullWidth
      />
    </Box>
  </Box>
</Box>


      {message && <Typography color="success.main" mb={2}>{message}</Typography>}
      {error && <Typography color="error" mb={2}>{error}</Typography>}

  <Button
  onClick={handleAddMember}
  fullWidth
  variant="contained"
  sx={{
    backgroundColor: '#c5c5be',   // Vatican gold
    color: '#000',                // Black text for contrast
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#e6c200'  // Slightly darker on hover
    }
  }}
>
  Add Member
</Button>
    </Box>
  );
};

export default AddMember;
