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
  Button,
} from "@mui/material";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useRouter } from "next/router";
import { useAppContext } from "../../context/AppContext";
import { ToastContainer, toast } from "react-toastify";

const dashboardDesign = {
  display: "flex",
  marginTop: "50px",
};

const Vacationlistview = () => {
  const [leaveRequests, setLeaveRequest] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [approvedRequests, setApprovedRequests] = useState(new Set());
  const [deniedRequests, setDeniedRequests] = useState(new Set());
  const router = useRouter();

  const {
    adminVacationDetails,
    approveVacationRequest,
    rejectVacationRequest,
  } = useAppContext();

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US");
  };

  const fetchVacationDetails = async () => {
    const data = await adminVacationDetails();
    setLeaveRequest(data);
  };

  const approveRequest = async (requestId, userId) => {
    try {
      setApprovedRequests((prev) => new Set(prev).add(requestId));
      await approveVacationRequest(requestId, userId);
      fetchVacationDetails();
    } catch (error) {
      setApprovedRequests((prev) => {
        const updated = new Set(prev);
        updated.delete(requestId);
        return updated;
      });
      toast.error("Error approving request.");
    }
  };

  const rejectRequest = async (requestId, userId) => {
    try {
      setDeniedRequests((prev) => new Set(prev).add(requestId));
      await rejectVacationRequest(requestId, userId);
      fetchVacationDetails();
    } catch (error) {
      setDeniedRequests((prev) => {
        const updated = new Set(prev);
        updated.delete(requestId);
        return updated;
      });
      toast.error("Error rejecting request.");
    }
  };

  useEffect(() => {
    const validateRole = async () => {
      const role = localStorage.getItem("role");

      if (role !== "admin") {
        router.push("/unauthorised");
      } else {
        setLoading(false);
        fetchVacationDetails();
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
      <AdminSidebar />
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
        <Typography variant="h6">VACATION OVERVIEW</Typography>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="vacation requests table">
            <TableHead>
              <TableRow>
                <TableCell>Index</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Vacation Type</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Comments</TableCell>
                <TableCell>Approve</TableCell>
                <TableCell>Reject</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((request, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#E3F2FD" : "#FCE4EC",
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{request.username}</TableCell>
                    <TableCell>{request.vacationType}</TableCell>
                    <TableCell>{formatDate(request.startDate)}</TableCell>
                    <TableCell>{formatDate(request.endDate)}</TableCell>
                    <TableCell
                      sx={{
                        backgroundColor:
                          request.status[0] === "pending"
                            ? "#FFF9C4"
                            : request.status[0] === "approved"
                            ? "#C8E6C9"
                            : request.status[0] === "denied"
                            ? "#FCE4EC"
                            : "transparent",
                        color: "black",
                        fontWeight: "bold",
                      }}
                    >
                      {request.status[0]}
                    </TableCell>
                    <TableCell>{request.comments}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="success"
                        disabled={
                          request.status[0] === "approved" ||
                          approvedRequests.has(request._id)
                        }
                        onClick={() =>
                          approveRequest(request._id, request.userId)
                        }
                      >
                        Approve
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="error"
                        disabled={
                          request.status[0] === "denied" ||
                          deniedRequests.has(request._id)
                        }
                        onClick={() =>
                          rejectRequest(request._id, request.userId)
                        }
                      >
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No leave requests available
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

export default Vacationlistview;
