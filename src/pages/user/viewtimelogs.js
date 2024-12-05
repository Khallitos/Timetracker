import * as React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/router";
import { useAppContext } from "../../context/AppContext";
import { ToastContainer, toast } from "react-toastify";
import Sidebar from "@/components/admin/AdminSidebar";

const dashboardDesign = {
  display: "flex",
  marginTop: "50px",
};

const Viewtimelogs = () => {
  const [timeSheet, setTimeSheet] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const router = useRouter();

  const convert = (time) => {
    const hour = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hour}:${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  };

  const { getUserTimeSheet } = useAppContext();

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US");
  };

  const timeSheetDetails = async () => {
    const data = await getUserTimeSheet();
    setTimeSheet(data);
  };

  useEffect(() => {
    const validateRole = async () => {
      const role = localStorage.getItem("role");
      if (role !== "user") {
        router.push("/unauthorised");
      } else {
        setLoading(false);
        timeSheetDetails();
      }
    };
    validateRole();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const paginatedData = (timeSheet || []).slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return (
      <CircularProgress
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
    );
  }

  return (
    <Box sx={dashboardDesign}>
      <Sidebar />
      <Box
        sx={{
          width: "100%",
          marginLeft: "20px",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
          marginTop: "12px",
          borderTop: "2px solid #b9eaf5",
          gap: "20px",
          padding: "20px",
        }}
      >
        <Typography variant="h6">TIME SHEET OVERVIEW</Typography>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="vacation requests table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: "#f0f8ff" }}>Index</TableCell>
                <TableCell sx={{ backgroundColor: "#dbe9f4" }}>
                  Username
                </TableCell>
                <TableCell sx={{ backgroundColor: "#f9fbe7" }}>
                  Date Started
                </TableCell>
                <TableCell sx={{ backgroundColor: "#f9fbe7" }}>
                  Date Ended
                </TableCell>
                <TableCell sx={{ backgroundColor: "#d4edda" }}>
                  Total Worked Time
                </TableCell>
                <TableCell sx={{ backgroundColor: "#fff3cd" }}>
                  Total Break Time
                </TableCell>
                <TableCell sx={{ backgroundColor: "#e2e3e5" }}>
                  Total Overtime
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((request, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor:
                        request.action === "login" ? "#d4edda" : "#f8d7da",
                      "&:hover": {
                        backgroundColor:
                          request.action === "login" ? "#c3e6cb" : "#f5c6cb",
                      },
                    }}
                  >
                    <TableCell sx={{ backgroundColor: "#ffffff" }}>
                      {index + 1}
                    </TableCell>
                    <TableCell sx={{ backgroundColor: "#dbe9f4" }}>
                      {request.username}
                    </TableCell>
                    <TableCell sx={{ backgroundColor: "#f9fbe7" }}>
                      {formatDate(request.startDate)}
                    </TableCell>
                    <TableCell sx={{ backgroundColor: "#f9fbe7" }}>
                      {formatDate(request.endDate)}
                    </TableCell>
                    <TableCell sx={{ backgroundColor: "#d4edda" }}>
                      {convert(
                        request.endDateInSeconds - request.startDateInSeconds
                      )}
                    </TableCell>
                    <TableCell sx={{ backgroundColor: "#fff3cd" }}>
                      {convert(request.breakTimeCount)}
                    </TableCell>
                    <TableCell sx={{ backgroundColor: "#e2e3e5" }}>
                      {convert(request.overTimerCount ?? 0)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No Time logs available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={(timeSheet || []).length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </Box>
  );
};

export default Viewtimelogs;
