import React from "react";
import { Box, Typography } from "@mui/material";

const footerDesign = {
  left: "0",
  bottom: "0",
  position: "fixed",
  width: "100%",
  backgroundColor: "red",
  color: "white",
  textAlign: "center",
  marginTop: "30px",
  display: "flex",
  justifyContent: "space-around",
  height: "60px",
  backgroundColor: "#3c3939",
};

const footerButtonDesign = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};
const footerTop = {
  marginTop: "45px",
  display: "flex",
  backgroundColor: "#fff",
  flexDirection: "column",
  marginBottom: "70px",
  alignItems: "center",
  color: "black",
  justifyContent: "center",
  padding: {
    xs: "20px",
  },
  marginX: {
    xs: "auto",
  },
};

const Footer = () => {
  return (
    <Box>
      <Box sx={footerDesign}>
        <Typography variant="p"> Copyright © TimeTracker 2024.</Typography>
      </Box>
    </Box>
  );
};

export default Footer;
