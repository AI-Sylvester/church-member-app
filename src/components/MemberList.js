import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField
} from '@mui/material';
import API_BASE_URL from '../config';

// Format date as dd-MMM-yyyy
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).replace(/ /g, '-');
};

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/member/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMembers(res.data);
        setError('');
      } catch (err) {
        console.error(err);
        setError('Failed to load members');
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [token]);

  const handleView = (member) => {
    setSelectedMember(member);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setSelectedMember(null);
  };

  // Filtered list based on search
  const filteredMembers = members.filter((m) => {
    const query = searchQuery.toLowerCase();
    return Object.values(m).some(val =>
      val &&
      val.toString().toLowerCase().includes(query)
    );
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} color="#0B3D91" mb={2}>
        All Members
      </Typography>

      <TextField
        label="Search members"
        variant="outlined"
        size="small"
        fullWidth
        sx={{ mb: 2 }}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {loading && (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && filteredMembers.length === 0 && (
        <Typography>No members found.</Typography>
      )}

      {filteredMembers.length > 0 && (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
          <Table size="small">
            <TableHead sx={{ backgroundColor: '#0B3D91' }}>
              <TableRow>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Sex</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Age</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Profession</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Mobile</TableCell>
<TableCell sx={{ color: '#fff', fontWeight: 600 }}>Residing</TableCell>
<TableCell sx={{ color: '#fff', fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMembers.map((m) => (
                <TableRow key={m.member_id} hover>
                  <TableCell>{m.member_id}</TableCell>
                  <TableCell>{m.name}</TableCell>
                  <TableCell>{m.sex || '-'}</TableCell>
                  <TableCell>{m.age ?? '-'}</TableCell>
                  <TableCell>{m.profession || '-'}</TableCell>
              <TableCell>{m.mobile || '-'}</TableCell>
<TableCell>{m.residing_here ? 'Yes' : 'No'}</TableCell>
<TableCell>
  <Button variant="outlined" size="small" onClick={() => handleView(m)}>
    View
  </Button>
</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog for full member details */}
      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Member Details</DialogTitle>
        <DialogContent dividers>
          {selectedMember && (
            <Grid container spacing={2}>
              {Object.entries({
  'Member ID': selectedMember.member_id,
  'Name': selectedMember.name,
  'Sex': selectedMember.sex,
  'Mobile': selectedMember.mobile,
                'Date of Birth': formatDate(selectedMember.dob),
                'Age': selectedMember.age,
                'Relationship': selectedMember.relationship,
                'Marital Status': selectedMember.marital_status,
                'Qualification': selectedMember.qualification,
                'Profession': selectedMember.profession,
                'Residing Here': selectedMember.residing_here ? 'Yes' : 'No',
                'Church Group': selectedMember.church_group,
                'Active': selectedMember.active ? 'Yes' : 'No',
                'Baptism Date': formatDate(selectedMember.baptism_date),
                'Baptism Place': selectedMember.baptism_place,
                'Holy Communion Date': formatDate(selectedMember.holy_communion_date),
                'Holy Communion Place': selectedMember.holy_communion_place,
                'Confirmation Date': formatDate(selectedMember.confirmation_date),
                'Confirmation Place': selectedMember.confirmation_place,
                'Marriage Date': formatDate(selectedMember.marriage_date),
                'Marriage Place': selectedMember.marriage_place,
              }).map(([label, value]) => (
                <Grid item xs={12} sm={6} key={label}>
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', fontWeight: 500 }}
                  >
                    {label}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.primary', fontWeight: 600 }}
                    gutterBottom
                  >
                    {value || '-'}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MemberList;
