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