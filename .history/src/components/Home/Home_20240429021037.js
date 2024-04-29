import React, { useEffect, useState } from 'react';
import { Grid, Snackbar, IconButton, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { csvFileUpload, deleteAccount, updateAccount } from '../../services/services';

export default function Home() {
    const [orderData, setOrderData] = useState([]);
    const [openSnack, setOpenSnack] = useState(false);
    const [snackMessage, setSnackMessage] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        // Simulate fetching data on mount
        // This is where you would call an actual function to load data from your backend
    }, []);

    const handleSnackClose = () => {
        setOpenSnack(false);
    };

    const fileUpload = (e) => {
        csvFileUpload(e.target.files[0]).then(resp => {
            console.log(resp.data);
            setOrderData(resp.data);
            setSnackMessage('File uploaded successfully!');
            setOpenSnack(true);
        }).catch(error => {
            console.error("Error uploading file: ", error);
            setSnackMessage('Error uploading file.');
            setOpenSnack(true);
        });
    };

    const handleDelete = (accountId) => {
        deleteAccount(accountId).then(() => {
            setOrderData(currentData => currentData.filter(item => item.accountId !== accountId));
            setSnackMessage('Account successfully deleted');
            setOpenSnack(true);
        }).catch(error => {
            console.error("Error deleting account:", error);
            setSnackMessage('Failed to delete account');
            setOpenSnack(true);
        });
    };

    const handleEdit = (account) => {
        const updatedAccount = { ...account, amount: account.amount + 100 }; // Simulate an update
        updateAccount(account.accountId, updatedAccount).then(response => {
            setOrderData(currentData =>
                currentData.map(data => (data.accountId === account.accountId ? { ...data, ...response.data } : data))
            );
            setSnackMessage('Account updated successfully!');
            setOpenSnack(true);
        }).catch(error => {
            console.error("Error updating account:", error);
            setSnackMessage('Failed to update account.');
            setOpenSnack(true);
        });
    };

    const columns = [
        { id: 'accountId', label: 'ACC. ID' },
        { id: 'accountNumber', label: 'ACCOUNT NUMBER' },
        { id: 'amount', label: 'AMOUNT' },
        { id: 'currency', label: 'CURRENCY' },
        { id: 'description', label: 'DESCRIPTION' },
        { id: 'passcode', label: 'PASSCODE' },
        { id: 'city', label: 'CITY' },
        { id: 'country', label: 'COUNTRY' },
        { id: 'date', label: 'DATE' },
        {
            id: 'actions', label: 'ACTIONS', maxWidth: 100, options: {
                customBodyRenderLite: (dataIndex) => {
                    return (
                        <>
                            <IconButton onClick={() => handleEdit(orderData[dataIndex])}><EditIcon /></IconButton>
                            <IconButton onClick={() => handleDelete(orderData[dataIndex].accountId)}><DeleteIcon /></IconButton>
                        </>
                    );
                }
            }
        }
    ];

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

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
                                {orderData.length > 0 ? orderData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
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
