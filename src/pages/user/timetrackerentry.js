import * as React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import Sidebar from "@/components/Sidebar";
import { useAppContext } from "../../context/AppContext";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/router";

const dashboardDesign = {
  display: "flex",
  marginTop: "50px",
  height: "115vh",
};

const formText = {
  fontSize: "100px",
  marginTop: "10px",
  marginBottom: "20px",
  width: "300px",
  textColor: "white",
  backgroundColor: "white",
};

const workTimeValues = {
  startDate: "",
  startTime: "",
  endTime: "",
  pause: "",
  comments: "",
};

const Timetrackerentry = () => {
  const { workTimeChanges } = useAppContext();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [values, setValues] = useState(workTimeValues);
  const [errors, setErrors] = useState({});

  const timeRegex = /^[0-9]{1,2}:[0-5][0-9]$/; // Time format validation regex

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleDateChange = (field, date) => {
    setValues({ ...values, [field]: date });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!values.startDate) {
      newErrors.startDate = "Start date is required.";
    }

    if (!values.startTime) {
      newErrors.startTime = "Start time is required.";
    } else if (!timeRegex.test(values.startTime)) {
      newErrors.startTime = "Start time must be in h:mm format (e.g., 9:30).";
    }

    if (!values.endTime) {
      newErrors.endTime = "End time is required.";
    } else if (!timeRegex.test(values.endTime)) {
      newErrors.endTime = "End time must be in h:mm format (e.g., 17:00).";
    }

    if (!values.pause) {
      newErrors.pause = "Pause duration is required.";
    } else if (!timeRegex.test(values.pause)) {
      newErrors.pause = "Pause duration must be in h:mm format (e.g., 0:30).";
    }

    if (!values.comments) {
      newErrors.comments = "Comments are required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const uploadRequest = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const isSuccess = workTimeChanges(values);

      if (isSuccess) {
        setValues(workTimeValues);
      }
    } else {
    }
  };

  useEffect(() => {
    const validateRole = async () => {
      const role = localStorage.getItem("role");

      if (role !== "user") {
        router.push("/unauthorised");
      } else {
        setLoading(false);
      }
    };
    validateRole();
  }, []);

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
    <form>
      <Box sx={dashboardDesign}>
        <Sidebar />
        <Box
          sx={{
            width: "100%",
            marginLeft: "20px",
            display: "flex",
            margigBottom: "50%",
            flexDirection: "column",
            backgroundColor: "white",
            marginTop: "12px",
            borderTop: "2px solid #b9eaf5",
            gap: "20px",

            padding: "20px",
          }}
        >
          <Typography variant="h6" sx={{ color: "#333", marginBottom: "10px" }}>
            Enter Working Time
          </Typography>

          <TextField
            label="Start Date"
            type="date"
            name="startDate"
            value={values.startDate}
            onChange={(e) => handleDateChange("startDate", e.target.value)}
            error={Boolean(errors.startDate)}
            helperText={errors.startDate}
            sx={{ marginBottom: "10px", width: "200px" }}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Start Time"
            name="startTime"
            value={values.startTime}
            onChange={handleChange}
            error={Boolean(errors.startTime)}
            helperText={errors.startTime}
            sx={{ marginBottom: "10px", width: "200px" }}
          />

          <TextField
            label="End Time"
            name="endTime"
            value={values.endTime}
            onChange={handleChange}
            error={Boolean(errors.endTime)}
            helperText={errors.endTime}
            sx={{ marginBottom: "10px", width: "200px" }}
          />

          <TextField
            label="Pause"
            name="pause"
            value={values.pause}
            onChange={handleChange}
            error={Boolean(errors.pause)}
            helperText={errors.pause}
            sx={{ marginBottom: "10px", width: "200px" }}
          />

          <TextField
            label="Comment (Max 500 words)"
            name="comments"
            value={values.comments}
            onChange={handleChange}
            error={Boolean(errors.comments)}
            helperText={errors.comments}
            multiline
            rows={4}
            sx={{ width: "400px" }}
          />

          <Button
            variant="contained"
            onClick={uploadRequest}
            sx={{
              width: "200px",
            }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default Timetrackerentry;
