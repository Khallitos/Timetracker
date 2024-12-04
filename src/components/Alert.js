import { Box } from "@mui/material";
import React from "react";
import { useAppContext } from "../context/AppContext";

export default function Alert() {
  const success = {
    color: "green",
  };

  const danger = {
    color: "red",
  };
  const { alertType, alertText } = useAppContext();
  return <Box sx={alertType === "success" ? success : danger}>{alertText}</Box>;
}
