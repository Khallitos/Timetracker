import * as React from "react";
import Divider from "@mui/material/Divider";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";
import { Box, Button, Typography } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";

const AdminSidebar = () => {
  return (
    <Box
      sx={{
        width: "300px",
        height: "100vh",
        background: "linear-gradient(to bottom, #f0f8ff, #e6f7ff)",
        marginLeft: "10px",
        display: "flex",
        flexDirection: "column",
        marginTop: "13px",
        padding: "20px",
        boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Box>
        <Link href="/admin/dashboard" style={{ textDecoration: "none" }}>
          <Typography
            sx={{
              marginBottom: "10px",
              color: "rgba(0, 0, 0, 0.6)",
              fontSize: "20px",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            ADMIN DASHBOARD
          </Typography>
        </Link>

        <Typography
          sx={{
            marginBottom: "10px",
            color: "rgba(0, 0, 0, 0.6)",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          VACATIONS
        </Typography>

        <Link href="/admin/vacationlistview" style={{ textDecoration: "none" }}>
          <Button
            startIcon={<AssessmentIcon />}
            sx={{
              width: "100%",
              justifyContent: "flex-start",
              color: "#007bff",
              textTransform: "none",
              fontSize: "15px",
              marginBottom: "10px",
              "&:hover": {
                backgroundColor: "rgba(0, 123, 255, 0.1)",
              },
            }}
          >
            View Vacations
          </Button>
        </Link>
      </Box>

      <Box>
        <Typography
          sx={{
            marginBottom: "10px",
            color: "rgba(0, 0, 0, 0.6)",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          TIME TRACKING
        </Typography>

        <Link href="/admin/timetrackerview" style={{ textDecoration: "none" }}>
          <Button
            startIcon={<AssessmentIcon />}
            sx={{
              width: "100%",
              justifyContent: "flex-start",
              color: "#007bff",
              textTransform: "none",
              fontSize: "15px",
              marginBottom: "10px",
              "&:hover": {
                backgroundColor: "rgba(0, 123, 255, 0.1)",
              },
            }}
          >
            Time Logs Viewer
          </Button>
        </Link>

        <Link
          href="/admin/timetrackerchanges"
          style={{ textDecoration: "none" }}
        >
          <Button
            startIcon={<AssessmentIcon />}
            sx={{
              width: "100%",
              justifyContent: "flex-start",
              color: "#007bff",
              textTransform: "none",
              fontSize: "15px",
              marginBottom: "10px",
              "&:hover": {
                backgroundColor: "rgba(0, 123, 255, 0.1)",
              },
            }}
          >
            Time Changes View
          </Button>
        </Link>

        <Typography
          sx={{
            marginBottom: "10px",
            color: "rgba(0, 0, 0, 0.6)",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          LOGS
        </Typography>

        <Link href="/admin/logview" style={{ textDecoration: "none" }}>
          <Button
            startIcon={<AssessmentIcon />}
            sx={{
              width: "100%",
              justifyContent: "flex-start",
              color: "#007bff",
              textTransform: "none",
              fontSize: "15px",
              marginBottom: "10px",
              "&:hover": {
                backgroundColor: "rgba(0, 123, 255, 0.1)",
              },
            }}
          >
            Logs View
          </Button>
        </Link>
      </Box>

      <Divider sx={{ marginY: "20px", backgroundColor: "#cfe2f3" }} />
    </Box>
  );
};

export default AdminSidebar;
