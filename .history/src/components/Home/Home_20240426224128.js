import React from 'react';
import { Grid, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { csvFileUpload, updateAccountDetails, deleteAccount } from '../../services/services';

export default function Home() {
  const [orderData, setOrderData] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [openSnack, setOpenSnack] = React.useState(false);
  const [snackMessage, setSnackMessage] = React.useState('');

  const handleSnackClose = () => {
    setOpenSnack(false);
  };

  const fileUpload = (e) => {
    csvFileUpload(e.target.files[0]).then(resp => {
      setOrderData(resp.data);
      setSnackMessage('File uploaded successfully!');
      setOpenSnack(true);
    }).catch(error => {
      console.error("Error uploading file: ", error);
      setSnackMessage('Error uploading file.');
      setOpenSnack(true);
    });
  };

  const handleEdit = (account) => {
    // Open a modal or form to edit the account, then submit the changes
    const updatedAccountDetails = {
      // Example fields, you need to implement the actual update logic
      
      accountNumber: '123456',
      amount: 100,
      currency: 'USD',
      description: 'Updated description',
      passcode: '1234',
      city: 'New City',
      country: 'New Country',
      date: '2021-01-01'
    };

    updateAccountDetails(account.accountId, updatedAccountDetails).then(response => {
      console.log('Update successful:', response.data);
      setSnackMessage('Update successful');
      setOpenSnack(true);
      // Optionally refresh the data or handle the UI update
    }).catch(error => {
      console.error('Update failed:', error);
      setSnackMessage('Update failed');
      setOpenSnack(true);
    });
  };

  const handleDelete = (accountId) => {
    deleteAccount(accountId).then(() => {
      setOrderData(currentData => currentData.filter(data => data.accountId !== accountId));
      setSnackMessage('Record successfully deleted.');
      setOpenSnack(true);
    }).catch(error => {
      console.error("Error deleting record: ", error);
      setSnackMessage('Failed to delete record.');
      setOpenSnack(true);
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const columns = [
    { id: 'accountId', label: 'ACC. ID', maxWidth: 30 },
    { id: 'accountNumber', label: 'ACCOUNT NUMBER', maxWidth: 100 },
    { id: 'amount', label: 'AMOUNT', maxWidth: 30 },
    { id: 'currency', label: 'CURRENCY', maxWidth: 100 },
    { id: 'description', label: 'DESCRIPTION', maxWidth: 100 },
    { id: 'passcode', label: 'PASSCODE', maxWidth: 70 },
    { id: 'city', label: 'CITY', maxWidth: 70 },
    { id: 'country', label: 'COUNTRY', maxWidth: 70 },
    { id: 'date', label: 'DATE', maxWidth: 70 },
    { id: 'actions', label: 'ACTIONS', maxWidth: 100 }
  ];

  return (
    <React.Fragment>
      <Grid container direction="row" spacing={1} style={{ paddingLeft: '100px' }}>
        <Grid item md={12}>
          <Typography variant="h6" fontWeight={700}>
            UPLOAD CSV FILE:
          </Typography>
          <input type="file" id="myFile" name="filename" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={fileUpload} />
          <Typography variant="h6" fontWeight={700} style={{ marginTop: '20px' }}>
            PROCESSED DATA FROM CSV:
          </Typography>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map(column => (
                    <TableCell key={column.id} style={{ maxWidth: column.maxWidth }}>
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {orderData.length > 0 ? orderData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.accountId}>
                    {columns.map(column => (
                      <TableCell key={column.id} align={column.align}>
                        {column.id === 'actions' ? (
                          <>
                            <IconButton onClick={() => handleEdit(row)}><EditIcon /></IconButton>
                            <IconButton onClick={() => handleDelete(row.accountId)}><DeleteIcon /></IconButton>
                          </>
                        ) : row[column.id]}
                      </TableCell>
                    ))}
                  </TableRow>
                )) : <TableRow><TableCell colSpan={columns.length} style={{ textAlign: 'center' }}>No Records found</TableCell></TableRow>}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={orderData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Grid>
      </Grid>
      <Snackbar
        open={openSnack}
        onClose={handleSnackClose}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        message={snackMessage}
      />
    </React.Fragment>
  );
}
