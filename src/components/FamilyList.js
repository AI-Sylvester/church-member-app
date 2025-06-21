import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
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
  TextField,
  CircularProgress,
  FormControlLabel,
  Switch,
  Avatar,
} from '@mui/material';
import API_BASE_URL from '../config';

const FamilyList = () => {
  const [families, setFamilies] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);

  const [selectedFamily, setSelectedFamily] = useState(null);
  const [editData, setEditData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editFile, setEditFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem('token');

  const fetchFamilies = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/family/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFamilies(res.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load family records');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchFamilies();
  }, [fetchFamilies]);

  const handleView = async (familyId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/family/${familyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedFamily(res.data);
      setViewOpen(true);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch family details');
    }
  };

  const handleEdit = async (familyId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/family/${familyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditData(res.data);
      setEditFile(null);
      setEditOpen(true);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch family details');
    }
  };

  const handleEditChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditSave = async () => {
    if (!editData) return;
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(editData).forEach(([key, val]) => {
        formData.append(key, key === 'active' ? (val ? 'true' : 'false') : val || '');
      });

      if (editFile) {
        formData.append('family_pic', editFile);
      }

      await axios.put(`${API_BASE_URL}/family/${editData.family_id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setEditOpen(false);
      fetchFamilies();
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to update family');
    } finally {
      setSaving(false);
    }
  };

  const handleImageClick = (family_pic) => {
    if (family_pic) {
      setSelectedImage(`${API_BASE_URL}/uploads/${family_pic}`);
      setImageOpen(true);
    }
  };

  // Filter and sort families
  const filteredFamilies = useMemo(() => {
    const lower = searchQuery.toLowerCase();
    const filtered = families.filter((fam) =>
      Object.values(fam).some((val) =>
        val !== null &&
        val !== undefined &&
        val.toString().toLowerCase().includes(lower)
      )
    );
    return filtered.sort((a, b) => a.family_id - b.family_id);
  }, [families, searchQuery]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} color="#0B3D91" mb={2}>
        Family Records
      </Typography>

      <TextField
        label="Search"
        variant="outlined"
        size="small"
        fullWidth
        sx={{ mb: 3 }}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by any field..."
      />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredFamilies.length === 0 ? (
        <Typography>No family records found.</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#0B3D91' }}>
              <TableRow>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Family ID</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Head Name</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>City</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Mobile</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Active</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Picture</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600, textAlign: 'center' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFamilies.map((fam) => (
                <TableRow key={fam.family_id} hover>
                  <TableCell>{fam.family_id}</TableCell>
                  <TableCell>{fam.head_name}</TableCell>
                  <TableCell>{fam.city}</TableCell>
                  <TableCell>{fam.mobile_number}</TableCell>
                  <TableCell>{fam.active ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    {fam.family_pic ? (
                      <Avatar
  variant="square"
  src={`${API_BASE_URL}/uploads/${fam.family_pic}`}
  alt={`${fam.head_name} picture`}
  sx={{ width: 32, height: 32, cursor: 'pointer' }}
  onClick={() => handleImageClick(fam.family_pic)}
/>

                    ) : (
                      <Typography color="text.secondary">No Image</Typography>
                    )}
                  </TableCell>
                  <TableCell align="center" sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <Button size="small" variant="outlined" onClick={() => handleView(fam.family_id)}>
                      View
                    </Button>
                    <Button size="small" variant="contained" onClick={() => handleEdit(fam.family_id)}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* View Dialog */}
      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Family Details (Read-only)</DialogTitle>
        <DialogContent dividers>
          {selectedFamily ? (
            Object.entries(selectedFamily).map(([key, value]) => (
              <Box key={key} sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="textSecondary" component="span" sx={{ textTransform: 'capitalize', mr: 1 }}>
                  {key.replace(/_/g, ' ')}:
                </Typography>
                <Typography component="span">{value === null || value === '' ? '-' : value.toString()}</Typography>
              </Box>
            ))
          ) : (
            <Typography>Loading...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Family Details</DialogTitle>
        <DialogContent dividers>
          {editData ? (
            <Box component="form" sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, maxHeight: '70vh', overflowY: 'auto' }} noValidate autoComplete="off">
              <TextField label="Head Name" value={editData.head_name || ''} onChange={(e) => handleEditChange('head_name', e.target.value)} fullWidth required />
              <TextField label="Address Line 1" value={editData.address_line1 || ''} onChange={(e) => handleEditChange('address_line1', e.target.value)} fullWidth />
              <TextField label="Address Line 2" value={editData.address_line2 || ''} onChange={(e) => handleEditChange('address_line2', e.target.value)} fullWidth />
              <TextField label="City" value={editData.city || ''} onChange={(e) => handleEditChange('city', e.target.value)} fullWidth required />
              <TextField label="Pincode" value={editData.pincode || ''} onChange={(e) => handleEditChange('pincode', e.target.value)} fullWidth />
              <TextField label="Mobile Number" value={editData.mobile_number || ''} onChange={(e) => handleEditChange('mobile_number', e.target.value)} fullWidth required />
              <TextField label="Mobile Number 2" value={editData.mobile_number2 || ''} onChange={(e) => handleEditChange('mobile_number2', e.target.value)} fullWidth />
              <TextField label="Cemetery" value={editData.cemetery || ''} onChange={(e) => handleEditChange('cemetery', e.target.value)} fullWidth />
              <TextField label="Native" value={editData.native || ''} onChange={(e) => handleEditChange('native', e.target.value)} fullWidth />
              <TextField label="Resident From" value={editData.resident_from || ''} onChange={(e) => handleEditChange('resident_from', e.target.value)} fullWidth />
              <TextField label="House Type" value={editData.house_type || ''} onChange={(e) => handleEditChange('house_type', e.target.value)} fullWidth />
              <TextField label="Subscription" value={editData.subscription || ''} onChange={(e) => handleEditChange('subscription', e.target.value)} fullWidth />
              <FormControlLabel control={<Switch checked={!!editData.active} onChange={(e) => handleEditChange('active', e.target.checked)} />} label="Active" sx={{ gridColumn: 'span 2' }} />
              <TextField label="Location" value={editData.location || ''} onChange={(e) => handleEditChange('location', e.target.value)} fullWidth />
              <TextField label="Anbiyam" value={editData.anbiyam || ''} onChange={(e) => handleEditChange('anbiyam', e.target.value)} fullWidth />
              <TextField label="Cemetery Number" value={editData.cemetery_number || ''} onChange={(e) => handleEditChange('cemetery_number', e.target.value)} fullWidth />
              <TextField label="Old Card Number" value={editData.old_card_number || ''} onChange={(e) => handleEditChange('old_card_number', e.target.value)} fullWidth />

              <Box sx={{ gridColumn: 'span 2', textAlign: 'center' }}>
                {editFile ? (
                  <img src={URL.createObjectURL(editFile)} alt="Selected Preview" style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'contain' }} />
                ) : editData.family_pic ? (
                  <img src={`${API_BASE_URL}/uploads/${editData.family_pic}`} alt="Current Family Pic" style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'contain' }} />
                ) : (
                  <Typography color="text.secondary">No Image Available</Typography>
                )}
              </Box>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setEditFile(e.target.files[0]);
                  }
                }}
                style={{ gridColumn: 'span 2' }}
              />
            </Box>
          ) : (
            <Typography>Loading...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} disabled={saving}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" disabled={saving}>
            {saving ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Dialog */}
      <Dialog open={imageOpen} onClose={() => setImageOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Family Picture</DialogTitle>
        <DialogContent dividers sx={{ textAlign: 'center' }}>
          {selectedImage ? (
            <img src={selectedImage} alt="Family" style={{ maxWidth: '100%', maxHeight: '60vh', objectFit: 'contain' }} />
          ) : (
            <Typography>No Image Available</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FamilyList;
