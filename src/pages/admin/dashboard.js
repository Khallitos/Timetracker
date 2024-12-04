import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useAppContext } from "../../context/AppContext";
import Sidebar from "@/components/admin/AdminSidebar";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const dashboardDesign = {
  display: "flex",
  marginTop: "50px",
};

const cardDesign = {
  width: 230,
  height: 100,
  padding: 2,
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
};

const TimerDesigns = {
  fontSize: "20px",
  fontWeight: "bold",
};

const Dashboard = () => {
  const {
    totalWorkedTime,
    format,
    calculateRemainingTime,
    breakTime,
    overTime,
  } = useAppContext();

  const [loading, setLoading] = useState(true);
  const toastDisplayedRef = useRef(false); // Prevent multiple toasts
  const router = useRouter();

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
      }
    };

    validateRole();
  }, [router]);

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
          flexDirection: "row",
          backgroundColor: "white",
          marginTop: "12px",
          borderTop: "2px solid #b9eaf5",
          gap: "20px",
          padding: "20px",
        }}
      >
        <Box sx={cardDesign}>
          <Typography>Remaining Work Time</Typography>

          <Typography sx={TimerDesigns}>
            {calculateRemainingTime(totalWorkedTime)}
          </Typography>
        </Box>

        <Box sx={cardDesign}>
          <Typography>Total Worked Hours</Typography>

          <Typography sx={TimerDesigns}>{format(totalWorkedTime)}</Typography>
        </Box>

        <Box sx={cardDesign}>
          <Typography>Break Time</Typography>

          <Typography sx={TimerDesigns}>{format(breakTime)}</Typography>
        </Box>

        <Box sx={cardDesign}>
          <Typography>OverTime</Typography>

          <Typography sx={TimerDesigns}>{format(overTime)}</Typography>
        </Box>
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default Dashboard;
