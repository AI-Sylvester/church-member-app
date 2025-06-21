import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Avatar,
  Grid
} from '@mui/material';

import API_BASE_URL from '../config';

const FamilyDetailsView = () => {
  const [familyIds, setFamilyIds] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [familyDetails, setFamilyDetails] = useState(null);
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');
  const [loadingFamily, setLoadingFamily] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchFamilyIds = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/family/ids`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFamilyIds(res.data);
      } catch (err) {
        setError('Failed to load family IDs');
      }
    };

    if (token) fetchFamilyIds();
  }, [token]);

  const fetchFamilyDetails = async (id) => {
    setLoadingFamily(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/family/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFamilyDetails(res.data);
      setError('');
    } catch (err) {
      setError('Failed to load family details');
      setFamilyDetails(null);
    } finally {
      setLoadingFamily(false);
    }
  };

  const fetchFamilyMembers = async (familyId) => {
    setLoadingMembers(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/member/byFamily/${familyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers(res.data);
      setError('');
    } catch (err) {
      setError('Failed to load family members');
      setMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleIdChange = async (e) => {
    const id = e.target.value;
    setSelectedId(id);
    if (id) {
      await fetchFamilyDetails(id);
      await fetchFamilyMembers(id);
    } else {
      setFamilyDetails(null);
      setMembers([]);
    }
  };

  const memberAttributes = [
    { label: 'Member ID', key: 'member_id' },
    { label: 'Name', key: 'name' },
    { label: 'Age', key: 'age' },
    { label: 'DOB', key: 'dob' },
    { label: 'Sex', key: 'sex' },
    { label: 'Marital Status', key: 'marital_status' },
    { label: 'Relationship', key: 'relationship' },
    { label: 'Qualification', key: 'qualification' },
    { label: 'Profession', key: 'profession' },
    { label: 'Residing Here', key: 'residing_here' },
    { label: 'Church Group', key: 'church_group' },
    { label: 'Active', key: 'active' },
  ];
const InfoLine = ({ label, value }) => (
  <Box display="flex" mb={1}>
    <Typography
      variant="body2"
      sx={{ fontWeight: 600, minWidth: 130, color: '#0B3D91' }}
    >
      {label}:
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {value || '-'}
    </Typography>
  </Box>
);
  const formatValue = (key, value) => {
    if (!value) return '-';
    if (['dob', 'baptism_date', 'holy_communion_date', 'confirmation_date', 'marriage_date'].includes(key)) {
      return new Date(value).toLocaleDateString();
    }
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return value;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap">
        <Typography variant="h5" fontWeight={700} color="#0B3D91">
          Family Profile
        </Typography>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Select Family ID</InputLabel>
          <Select value={selectedId} label="Select Family ID" onChange={handleIdChange}>
            {familyIds.map((id) => (
              <MenuItem key={id} value={id}>
                {id}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {(loadingFamily || loadingMembers) && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress sx={{ color: '#0B3D91' }} />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
{familyDetails && (
  <Card
    sx={{
      p: 3,
      mb: 4,
      backgroundColor: '#F5F9FF',
      borderRadius: 3,
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    }}
  >
    <Grid container spacing={3} alignItems="center">
      {/* Avatar Section */}
      <Grid item xs={12} md={3} textAlign="center">
        <Avatar
          src={familyDetails.family_pic ? `${API_BASE_URL}/uploads/${familyDetails.family_pic}` : ''}
          sx={{
            width: 120,
            height: 120,
            bgcolor: '#0B3D91',
            fontWeight: 700,
            fontSize: 32,
            border: '3px solid #fff',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            mx: 'auto',
          }}
        >
          {!familyDetails.family_pic && '?'}
        </Avatar>
        <Typography variant="subtitle1" fontWeight={600} color="#0B3D91" mt={2}>
          Head: {familyDetails.head_name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Family ID: {familyDetails.family_id}
        </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
    Total Members: {members.length}
  </Typography>
      </Grid>

      {/* Info Section */}
      <Grid item xs={12} md={9}>
        <Grid container spacing={2}>
          {/* Column 1 */}
          <Grid item xs={12} sm={4}>
            <InfoLine label="Address" value={`${familyDetails.address_line1}, ${familyDetails.address_line2}`} />
            <InfoLine label="City & Pincode" value={`${familyDetails.city} - ${familyDetails.pincode}`} />
            <InfoLine label="Contact" value={`${familyDetails.mobile_number}${familyDetails.mobile_number2 ? `, ${familyDetails.mobile_number2}` : ''}`} />
            <InfoLine label="Location" value={familyDetails.location} />
          </Grid>

          {/* Column 2 */}
          <Grid item xs={12} sm={4}>
            <InfoLine label="Native" value={familyDetails.native} />
            <InfoLine
              label="Resident From"
              value={familyDetails.resident_from ? new Date(familyDetails.resident_from).toLocaleDateString() : '-'}
            />
            <InfoLine label="House Type" value={familyDetails.house_type} />
            <InfoLine label="Subscription" value={familyDetails.subscription} />
          </Grid>

          {/* Column 3 */}
          <Grid item xs={12} sm={4}>
            <InfoLine label="Anbiyam" value={familyDetails.anbiyam} />
            <InfoLine label="Cemetery" value={familyDetails.cemetery} />
            <InfoLine label="Cemetery No." value={familyDetails.cemetery_number} />
            <InfoLine label="Active" value={familyDetails.active ? 'Yes' : 'No'} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </Card>
)}

      {/* Members Horizontal Table */}
      {members.length > 0 && (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#0B3D91' }}>
              <TableRow>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Member ID</TableCell>
                {memberAttributes.slice(1).map((attr) => (
                  <TableCell key={attr.key} sx={{ color: '#fff', fontWeight: 700 }}>
                    {attr.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.member_id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{member.member_id}</TableCell>
                  {memberAttributes.slice(1).map((attr) => (
                    <TableCell key={attr.key}>{formatValue(attr.key, member[attr.key])}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default FamilyDetailsView;
