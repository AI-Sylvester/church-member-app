import React, { useEffect, useState, useCallback } from 'react';
import {
  Paper, Typography, CircularProgress, Alert, Grid, FormControl,
  InputLabel, Select, MenuItem, Box, Table, TableHead, TableRow,
  TableCell, TableBody, Button, 
} from '@mui/material';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import API_BASE_URL from '../config';

const AnbiyamFamilyView = () => {
  const [anbiyams, setAnbiyams] = useState([]);
  const [selectedAnbiyam, setSelectedAnbiyam] = useState('');
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;

    const fetchAnbiyams = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/anbiyam`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnbiyams(res.data);
      } catch (err) {
        setError('Failed to load Anbiyam list.');
      }
    };

    fetchAnbiyams();
  }, [token]);

  const fetchFamilies = useCallback(async (anbiyamName) => {
    if (!token) return;

    try {
      setLoading(true);
      setError('');
      const res = await axios.get(
        `${API_BASE_URL}/family/anbiyamfam/${encodeURIComponent(anbiyamName)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFamilies(res.data);
    } catch (err) {
      setError('Failed to load families for the selected Anbiyam.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleAnbiyamChange = (e) => {
    const selectedName = e.target.value;
    setSelectedAnbiyam(selectedName);
    fetchFamilies(selectedName);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);

    const title = `Family Details - (${selectedAnbiyam})`;
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = doc.getTextWidth(title);
    const centerX = (pageWidth - textWidth) / 2;

    doc.text(title, centerX, 20); // 🔧 Centered heading

    const tableData = families.map((fam, index) => ([
      index + 1,
      fam.family_id,
      fam.head_name,
      fam.mobile_number,
      `${fam.address_line1 || ''}, ${fam.address_line2 || ''}, ${fam.city || ''}`
    ]));

    autoTable(doc, {
      startY: 30,
      head: [['S.No', 'Family ID', 'Head Name', 'Mobile', 'Address']],
      body: tableData,
    });

    doc.save(`Families_${selectedAnbiyam}.pdf`);
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h6">Family List by Anbiyam</Typography>
        </Grid>
        <Grid item>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Anbiyam</InputLabel>
            <Select
              value={selectedAnbiyam}
              onChange={handleAnbiyamChange}
              label="Anbiyam"
            >
              {anbiyams.map((anb) => (
                <MenuItem key={anb.id} value={anb.name}>
                  {anb.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box mt={3}>
        {selectedAnbiyam && (
          <Typography
            variant="h6"
            align="center"
            gutterBottom
            sx={{ mb: 2 }}
          >
            Family Details - ({selectedAnbiyam}) {/* 🔧 Centered heading */}
          </Typography>
        )}

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {loading ? (
          <CircularProgress />
        ) : families.length > 0 ? (
          <>
            <Box display="flex" justifyContent="flex-end" mb={2}> {/* 🔧 Right-aligned button */}
              <Button variant="outlined" color="primary" onClick={exportToPDF}>
                Export to PDF
              </Button>
            </Box>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>S.No</TableCell>
                  <TableCell>Family ID</TableCell>
                  <TableCell>Head Name</TableCell>
                  <TableCell>Mobile</TableCell>
                  <TableCell>Address</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {families.map((fam, index) => (
                  <TableRow key={fam.family_id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{fam.family_id}</TableCell>
                    <TableCell>{fam.head_name}</TableCell>
                    <TableCell>{fam.mobile_number}</TableCell>
                    <TableCell>{`${fam.address_line1 || ''}, ${fam.address_line2 || ''}, ${fam.city || ''}`}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        ) : (
          selectedAnbiyam && !error && (
            <Typography>No families found for "{selectedAnbiyam}".</Typography>
          )
        )}
      </Box>
    </Paper>
  );
};

export default AnbiyamFamilyView;
