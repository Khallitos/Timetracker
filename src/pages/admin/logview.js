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

const Logview = () => {
  const [leaveRequests, setLeaveRequest] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const toastDisplayedRef = useRef(false);
  const router = useRouter();

  const { logDetailsFetched } = useAppContext();

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US");
  };

  const logDetails = async () => {
    const data = await logDetailsFetched();
    setLeaveRequest(data);
  };

  useEffect(() => {
    const validateRole = async () => {
      const role = localStorage.getItem("role");

      if (role !== "admin") {
        if (!toastDisplayedRef.current) {
          toast.error("You are not authorized to view this page.", {
            position: "top-center",
            autoClose: 2000,
          });
          toastDisplayedRef.current = true;
        }
        router.push("/");
      } else {
        setLoading(false);
        logDetails();
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

  const paginatedData = (leaveRequests || []).slice(
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
        <Typography variant="h6">LOGS OVERVIEW</Typography>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="vacation requests table">
            <TableHead>
              <TableRow>
                <TableCell>Index</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>Date Created</TableCell>
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
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{request.username}</TableCell>
                    <TableCell>{request.action}</TableCell>
                    <TableCell>{request.ipAddress}</TableCell>
                    <TableCell>{formatDate(request.timestamp)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No logs available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={(leaveRequests || []).length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </Box>
  );
};

export default Logview;
