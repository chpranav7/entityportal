import React, { useEffect, useState } from 'react';
import { Grid, Snackbar, IconButton } from '@mui/material';
import MUIDataTable from 'mui-datatables';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { readData, updateAccount, deleteAccount } from '../../services/services';

export default function Search() {
  const [data, setData] = useState([]);
  const [snackPack, setSnackPack] = useState([]);
  const [openSnack, setOpenSnack] = useState(false);
  const [snackMessageInfo, setSnackMessageInfo] = useState(undefined);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    readData().then(response => {
      setData(response.data);
    }).catch(error => {
      console.log("Error fetching data:", error);
    });
  };

  const handleDelete = (accountId) => {
    deleteAccount(accountId).then(() => {
      fetchData();  // Refresh data after delete
      enqueueSnackbar('Account deleted successfully');
    }).catch(error => {
      enqueueSnackbar('Failed to delete account');
      console.error("Error deleting account:", error);
    });
  };

  const handleEdit = (accountId, accountDetails) => {
    updateAccount(accountId, accountDetails).then(() => {
      fetchData();  // Refresh data after update
      enqueueSnackbar('Account updated successfully');
    }).catch(error => {
      enqueueSnackbar('Failed to update account');
      console.error("Error updating account:", error);
    });
  };

  const enqueueSnackbar = (message) => {
    setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
  };

  useEffect(() => {
    if (snackPack.length && !snackMessageInfo) {
      // Set a new snack when we don't have an active one
      setSnackMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpenSnack(true);
    } else if (snackPack.length && snackMessageInfo && openSnack) {
      // Close an active snack when a new one is added
      setOpenSnack(false);
    }
  }, [snackPack, snackMessageInfo, openSnack]);

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnack(false);
  };

  const handleExited = () => {
    setSnackMessageInfo(undefined);
  };

  const columns = [
    {
      name: "accountId",
      label: "Account ID",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "accountNumber",
      label: "Account Number",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "Actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          const account = data[dataIndex];
          return (
            <div>
              <IconButton onClick={() => handleEdit(account.accountId, account)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDelete(account.accountId)}>
                <DeleteIcon />
              </IconButton>
            </div>
          );
        }
      }
    }
  ];

  const options = {
    filterType: 'checkbox',
  };

  const theme = createTheme();

  return (
    <ThemeProvider theme={theme}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <MUIDataTable
            title={"Account Details"}
            data={data}
            columns={columns}
            options={options}
          />
        </Grid>
      </Grid>
      <Snackbar
        key={snackMessageInfo ? snackMessageInfo.key : undefined}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={openSnack}
        autoHideDuration={6000}
        onClose={handleSnackClose}
        onExited={handleExited}
        message={snackMessageInfo ? snackMessageInfo.message : undefined}
      />
    </ThemeProvider>
  );
}
