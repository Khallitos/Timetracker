import * as React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
} from "@mui/material";
import Sidebar from "@/components/Sidebar";
import { useAppContext } from "../../context/AppContext";
import { vacationTypes } from "../../utils/vacationTypes";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/router";

const dashboardDesign = {
  display: "flex",
  marginTop: "50px",
};

const fieldContainer = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  alignItems: "flex-start",
};

const labelStyle = {
  fontWeight: "bold",
  marginBottom: "5px",
};

const inputStyle = {
  width: "300px",
  height: "40px",
};

const formText = {
  width: "30%",
};

const vacationRequestDetails = {
  startDate: "",
  endDate: "",
  comments: "",
  vacationType: "",
};

const Requestvacation = () => {
  const { vacationLeaveTaken } = useAppContext();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [values, setValues] = useState(vacationRequestDetails);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleDateChange = (field, date) => {
    setValues({ ...values, [field]: date });
  };

  const handleVacationTypeChange = (e) => {
    setValues({ ...values, vacationType: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!values.endDate) {
      newErrors.endDate = "End date is required.";
    }

    if (!values.comments) {
      newErrors.comments = "Comments are required.";
    }

    if (!values.vacationType) {
      newErrors.vacationType = "Vacation type is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const uploadRequest = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const isSuccess = vacationLeaveTaken(values);
      if (isSuccess) {
        setValues(vacationRequestDetails);
      }
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
            flexDirection: "column",
            backgroundColor: "white",
            marginTop: "12px",
            borderTop: "2px solid #b9eaf5",
            gap: "20px",
            padding: "20px",
          }}
        >
          <Typography variant="h6" sx={{ color: "#333" }}>
            Request Vacation
          </Typography>

          <FormControl fullWidth sx={fieldContainer}>
            <InputLabel id="vacation-type-label" sx={labelStyle}>
              Vacation Type
            </InputLabel>
            <Select
              labelId="vacation-type-label"
              id="vacation-type"
              name="vacationType"
              sx={{ width: "300px" }}
              value={values.vacationType}
              onChange={handleVacationTypeChange}
              label="Vacation Type"
              error={Boolean(errors.vacationType)}
            >
              {Object.entries(vacationTypes).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {value}
                </MenuItem>
              ))}
            </Select>

            {errors.vacationType && (
              <Typography color="error">{errors.vacationType}</Typography>
            )}
          </FormControl>

          <Box sx={fieldContainer}>
            <label htmlFor="start-date" style={labelStyle}>
              Start Date:
            </label>
            <input
              type="date"
              id="start-date"
              name="startDate"
              value={values.startDate || ""}
              required
              onChange={(e) => handleDateChange("startDate", e.target.value)}
              style={inputStyle}
            />
            {errors.startDate && (
              <Typography color="error">{errors.startDate}</Typography>
            )}
          </Box>

          <Box sx={fieldContainer}>
            <label htmlFor="end-date" style={labelStyle}>
              End Date:
            </label>
            <input
              type="date"
              id="end-date"
              name="endDate"
              value={values.endDate || ""}
              required
              onChange={(e) => handleDateChange("endDate", e.target.value)}
              min={values.startDate}
              style={inputStyle}
            />
            {errors.endDate && (
              <Typography color="error">{errors.endDate}</Typography>
            )}
          </Box>

          <TextField
            id="comments-box"
            rows={5}
            required
            multiline
            margin="normal"
            sx={formText}
            fullWidth
            variant="outlined"
            label="Comment (Max 500 words)"
            name="comments"
            value={values.comments}
            autoComplete="comments"
            autoFocus
            onChange={handleChange}
            error={Boolean(errors.comments)}
            helperText={errors.comments}
            InputLabelProps={{
              style: { color: "black" },
            }}
            InputProps={{
              style: {
                color: "black",
              },
            }}
          />

          <Button
            variant="contained"
            type="submit"
            sx={{ width: "200px" }}
            onClick={uploadRequest}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default Requestvacation;
