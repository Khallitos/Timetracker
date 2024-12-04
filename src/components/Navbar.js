import React, { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import StopCircleIcon from "@mui/icons-material/StopCircle";

const MainBox = {
  display: "flex",
  background: "#b9eaf5",
  height: "50px",
  alignItems: "center",
  flexDirection: "row",
  justifyContent: "space-between",
  position: "fixed",
  zIndex: "1",
  width: "100%",
  top: "0px",
  paddingLeft: "10px",
  paddingRight: "10px",
};

const loginButtonDesign = {
  display: "flex",
  gap: "10px",
};

const Navbar = () => {
  const {
    username,
    logUserOff,
    token,
    email,
    pictureUrl,
    isRunning,
    startTimer,
    pauseTimer,
    format,
    totalWorkedTime,
    overTime,
    workStopped,
  } = useAppContext();

  const router = useRouter();
  const logoutUser = () => {
    logUserOff();
  };

  const [loading, setLoading] = useState(true);
  const [isUser, setIsUser] = useState(false);

  const pauseWorkButton = () => {
    pauseTimer();
  };

  const startWorkButton = () => {
    startTimer();
  };

  const stopWork = () => {
    workStopped();
  };

  const findrole = () => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      setIsUser(true);
    }
  };
  useEffect(() => {
    if (token) {
      setLoading(false);
    }
    findrole();
  }, [token]);

  return (
    <>
      <Box sx={MainBox}>
        <Head>
          <link
            href="https://fonts.cdnfonts.com/css/nexa-bold"
            rel="stylesheet"
          />
        </Head>
        {isUser ? (
          <Link
            href="/admin/dashboard"
            style={{ textDecoration: "none", color: "#3e5060" }}
          >
            <Typography>TimeTracker</Typography>
          </Link>
        ) : (
          <Link
            href="/user/dashboard"
            style={{ textDecoration: "none", color: "#3e5060" }}
          >
            <Typography>TimeTracker</Typography>
          </Link>
        )}

        <Box sx={{ display: "flex" }}>
          <Link href="/">
            <Typography
              variant="p"
              noWrap
              sx={{
                flexGrow: 1,
                display: { xs: "", sm: "block" },
                textDecoration: "none",
                color: "white",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            ></Typography>
          </Link>
        </Box>

        {token && (
          <Box sx={loginButtonDesign}>
            <Typography>{format(totalWorkedTime)}</Typography>

            {overTime ? (
              <StopCircleIcon
                sx={{
                  cursor: "pointer",
                  color: "red",
                  transition: "transform 0.3s ease", // Smooth transition
                  "&:hover": {
                    transform: "scale(1.2)", // Scale up on hover
                  },
                }}
                onClick={stopWork}
              ></StopCircleIcon>
            ) : isRunning ? (
              <PauseCircleIcon
                onClick={pauseWorkButton}
                sx={{
                  cursor: "pointer",
                  color: "blue",
                  transition: "transform 0.3s ease", // Smooth transition
                  "&:hover": {
                    transform: "scale(1.2)", // Scale up on hover
                  },
                }}
              />
            ) : (
              <PlayCircleIcon
                onClick={startWorkButton}
                sx={{
                  cursor: "pointer",
                  color: "green",
                  transition: "transform 0.3s ease", // Smooth transition
                  "&:hover": {
                    transform: "scale(1.2)", // Scale up on hover
                  },
                }}
              />
            )}

            <Typography sx={{ display: "flex", gap: "3px" }}>
              <Image
                src={pictureUrl || "/default-image.png"}
                width={30}
                height={30}
                style={{
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              {email}
            </Typography>
            <PowerSettingsNewIcon
              sx={{
                cursor: "pointer",
                transition: "transform 0.3s ease", // Smooth transition
                "&:hover": {
                  transform: "scale(1.2)", // Scale up on hover
                },
              }}
              onClick={logoutUser}
            />
          </Box>
        )}
      </Box>
    </>
  );
};

export default Navbar;
