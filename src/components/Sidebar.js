import * as React from "react";
import { useState, useEffect } from "react";
import Divider from "@mui/material/Divider";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";
import { Box, Button, Typography } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";

const Sidebar = () => {
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
        <Link href="/user/dashboard" style={{ textDecoration: "none" }}>
          <Typography
            sx={{
              marginBottom: "30px",
              color: "rgba(0, 0, 0, 0.8)",
              fontWeight: "bold",
              fontSize: "18px",
            }}
          >
            DASHBOARD
          </Typography>
        </Link>

        <Link
          href="/user/requestvacation"
          style={{ textDecoration: "none", cursor: "pointer" }}
        >
          <Typography
            sx={{
              marginBottom: "10px",
              color: "rgba(0, 0, 0, 0.6)",
              fontSize: "16px",
            }}
          >
            MY VACATIONS
          </Typography>
        </Link>

        <Link href="/user/requestvacation" style={{ textDecoration: "none" }}>
          <Button
            startIcon={<AddIcon />}
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
            Request Vacation
          </Button>
        </Link>

        <Link href="/user/vacationlistview" style={{ textDecoration: "none" }}>
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
            Vacation List View
          </Button>
        </Link>
      </Box>

      <Box>
        <Typography
          sx={{
            marginBottom: "10px",
            color: "rgba(0, 0, 0, 0.6)",
            fontSize: "16px",
          }}
        >
          TIME TRACKING
        </Typography>

        <Link href="/user/timetrackerentry" style={{ textDecoration: "none" }}>
          <Button
            startIcon={<AddIcon />}
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
            Enter Working Time
          </Button>
        </Link>
      </Box>

      <Divider sx={{ marginY: "20px", backgroundColor: "#cfe2f3" }} />
    </Box>
  );
};

export default Sidebar;
