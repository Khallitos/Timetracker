import React, { useState, useEffect, useRef } from "react";
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

const timetrackerchanges = () => {
  const [timeChangeRequest, setTimeChangeRequest] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [approvedRequests, setApprovedRequests] = useState(new Set());
  const [deniedRequests, setDeniedRequests] = useState(new Set());
  const toastDisplayedRef = useRef(false);
  const router = useRouter();

  const { timeChangeDetails, approveTimeRequest, rejectTimeRequest } =
    useAppContext();

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US");
  };

  const convert = (time) => {
    const hour = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hour}:${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  };

  const fetchTimeChanges = async () => {
    try {
      const data = await timeChangeDetails();
      setTimeChangeRequest(data);
    } catch (error) {
      console.error("Error fetching time change requests:", error);
    }
  };

  const approveRequest = async (requestId, userId) => {
    try {
      setApprovedRequests((prev) => new Set(prev).add(requestId));
      await approveTimeRequest(requestId, userId);
      fetchTimeChanges();
    } catch (error) {
      setApprovedRequests((prev) => {
        const updated = new Set(prev);
        updated.delete(requestId);
        return updated;
      });
    }
  };

  const rejectRequest = async (requestId, userId) => {
    try {
      setDeniedRequests((prev) => new Set(prev).add(requestId));
      await rejectTimeRequest(requestId, userId);
      fetchTimeChanges();
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
        fetchTimeChanges();
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

  const paginatedData = (timeChangeRequest || []).slice(
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
        <Typography variant="h6">Time Change Requests</Typography>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="time change requests table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: "#f0f8ff" }}>Index</TableCell>
                <TableCell sx={{ backgroundColor: "#dbe9f4" }}>
                  Username
                </TableCell>
                <TableCell sx={{ backgroundColor: "#f9fbe7" }}>
                  Start Date
                </TableCell>
                <TableCell sx={{ backgroundColor: "#f9fbe7" }}>
                  End Date
                </TableCell>
                <TableCell sx={{ backgroundColor: "#d4edda" }}>
                  Total Worked Time (hrs)
                </TableCell>
                <TableCell sx={{ backgroundColor: "#fff3cd" }}>
                  Total Break Time (hrs)
                </TableCell>
                <TableCell sx={{ backgroundColor: "#e2e3e5" }}>
                  Comments
                </TableCell>
                <TableCell sx={{ backgroundColor: "#e2e3e5" }}>
                  Status
                </TableCell>
                <TableCell sx={{ backgroundColor: "#cce5ff" }}>
                  Approve
                </TableCell>
                <TableCell sx={{ backgroundColor: "#f8d7da" }}>
                  Reject
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((request, index) => (
                  <TableRow
                    key={request._id}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#E3F2FD" : "#FCE4EC",
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{request.username}</TableCell>
                    <TableCell>{formatDate(request.startDate)}</TableCell>
                    <TableCell>{formatDate(request.endDate)}</TableCell>
                    <TableCell>
                      {convert(
                        request.endDateInSeconds - request.startDateInSeconds
                      )}
                    </TableCell>
                    <TableCell>{convert(request.breakTime ?? 0)}</TableCell>
                    <TableCell>{request.comments}</TableCell>
                    <TableCell
                      sx={{
                        backgroundColor:
                          request.status === "pending"
                            ? "#fff3cd"
                            : request.status === "denied"
                            ? "#f8d7da"
                            : request.status === "approved"
                            ? "#d4edda"
                            : "transparent",
                        fontWeight: "bold",
                      }}
                    >
                      {request.status}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="success"
                        disabled={approvedRequests.has(request._id)}
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
                        disabled={deniedRequests.has(request._id)}
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
                    No time change requests available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={(timeChangeRequest || []).length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default timetrackerchanges;
