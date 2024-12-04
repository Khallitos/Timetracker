import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useReducer,
  useRef,
} from "react";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import axios from "axios";
import { AppReducer } from "./AppReducer";
import CircularProgress from "@mui/material/CircularProgress";
import { toast, ToastContainer } from "react-toastify";
const initialState = {
  showAlert: false,
  alertText: "",
  alertType: "",
};

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);
  const [pictureUrl, setPictureUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalWorkedTime, setTotalWorkedTime] = useState(0);
  const [isOverTime, setIsOverTime] = useState(false);
  const [overTime, setOverTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [breakTime, setBreakTime] = useState(0);
  const totalWorkTime = 28800;
  const workItervalRef = useRef(null);
  const breakIntervalRef = useRef(null);
  const overTimeIntervalRef = useRef(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("email");
    const storedPicture = localStorage.getItem("picture");

    if (storedToken) {
      setToken(storedToken);
      setEmail(storedEmail);
      setPictureUrl(storedPicture);
    }
  }, []);

  const addUserToLocalStorage = (token, id, email, picture, role) => {
    try {
      localStorage.setItem("token", token);
      localStorage.setItem("email", email);
      localStorage.setItem("picture", picture);
      localStorage.setItem("id", id);
      localStorage.setItem("role", role);
      setToken(token);
      setEmail(email);
      setPictureUrl(picture);
    } catch (error) {
      console.error("Error storing user data in localStorage:", error);
    }
  };

  const handleGoogleLogin = async (googleData) => {
    try {
      const { credential } = googleData;
      const { data } = await axios.post(
        "https://timetrackerserver-by8t.onrender.com/api/v1/auth/login",
        googleData
      );
      const { token, user } = data;

      const { id, email, picture, role } = user;
      addUserToLocalStorage(token, id, email, picture, role);

      if (role[0] === "user") {
        router.push("/user/dashboard");
      } else {
        router.push("/admin/dashboard");
      }
    } catch (error) {}
  };

  const logUserOff = async () => {
    const id = localStorage.getItem("id");
    const email = localStorage.getItem("email");
    const userDetails = {
      email: email,
      id: id,
    };
    const isloggedOut = await axios.post(
      "https://timetrackerserver-by8t.onrender.com/api/v1/auth/logout",
      userDetails
    );

    if (isloggedOut) {
      localStorage.clear();

      setToken(null);
      setEmail(null);
      setPictureUrl(null);
      router.push("/");
    }
  };
  const startTimer = () => {
    const startWorkTime = new Date();
    setStartDate(startWorkTime);
    setIsRunning(true);
    setIsBreak(false);
    toast.success("Timer has started successfully!", {
      position: "top-center",
      autoClose: 2000, // Close after 5 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const pauseTimer = () => {
    setIsRunning(false);
    setIsBreak(true);
    toast.success("Timer paused successfully!", {
      position: "top-center",
      autoClose: 2000, // Close after 5 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const format = (time) => {
    const hour = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return `${hour}:${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  };

  const calculateRemainingTime = () => {
    const remainingTime = totalWorkTime - totalWorkedTime;
    if (remainingTime <= 0) {
      return format(0);
    }

    return format(remainingTime);
  };

  useEffect(() => {
    if (isRunning) {
      workItervalRef.current = setInterval(() => {
        setTotalWorkedTime((prevTotalWorkedTime) => prevTotalWorkedTime + 1);
      }, 1000);
    } else {
      if (workItervalRef.current) {
        clearInterval(workItervalRef.current);
        workItervalRef.current = null;
      }
    }

    return () => {
      if (workItervalRef.current) {
        clearInterval(workItervalRef.current);
      }
    };
  }, [isRunning]);
  useEffect(() => {
    if (isBreak) {
      breakIntervalRef.current = setInterval(() => {
        setBreakTime((prevBreakTime) => prevBreakTime + 1);
      }, 1000);
    } else {
      if (breakIntervalRef.current) {
        clearInterval(breakIntervalRef.current);
        breakIntervalRef.current = null;
      }
    }

    return () => {
      if (breakIntervalRef.current) {
        clearInterval(breakIntervalRef.current);
      }
    };
  }, [isBreak]);

  useEffect(() => {
    if (isOverTime) {
      overTimeIntervalRef.current = setInterval(() => {
        setOverTime((prevOverTime) => prevOverTime + 1);
      }, 1000);
    } else {
      if (overTimeIntervalRef.current) {
        clearInterval(overTimeIntervalRef.current);
        overTimeIntervalRef.current = null;
      }
    }

    return () => {
      if (overTimeIntervalRef.current) {
        clearInterval(overTimeIntervalRef.current);
      }
    };
  }, [isOverTime]);

  useEffect(() => {
    if (isRunning && totalWorkedTime > totalWorkTime && !isOverTime) {
      setIsOverTime(true);
    }
  }, [totalWorkedTime, isRunning, isOverTime]);

  const workStopped = async () => {
    const endWorkTime = new Date();
    const breakTimeCount = breakTime;
    const overTimeCount = overTime;

    const userId = localStorage.getItem("id");
    const workerDetails = {
      userId: userId,
      startDate: startDate,
      endDate: endWorkTime,
      breakTimeCount: breakTimeCount || 0,
      overTimerCount: overTimeCount || 0,
    };

    try {
      const workTimeDetails = await axios.post(
        "https://timetrackerserver-by8t.onrender.com/api/v1/services/workTimerDetails",
        workerDetails
      );
    } catch (error) {}
    setIsRunning(false);
    setTotalWorkedTime(0);
    setBreakTime(0);
    setOverTime(0);
    setIsOverTime(false);
    clearInterval(workItervalRef.current);
    clearInterval(breakIntervalRef.current);
    clearInterval(overTimeIntervalRef);

    toast.success("Timer has been stopped successfully!", {
      position: "top-center",
      autoClose: 2000, // Close after 5 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const vacationLeaveTaken = async (values) => {
    const { startDate, endDate, comments, vacationType } = values;
    const userId = localStorage.getItem("id");
    const vacationRequestDetails = {
      userId: userId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      comments: comments,
      vacationType: vacationType,
    };

    try {
      const vacationDetails = await axios.post(
        "https://timetrackerserver-by8t.onrender.com/v1/services/requestVacation",
        vacationRequestDetails
      );

      if (vacationDetails.data.success === true) {
        toast.success("Vacation details submitted successfully!", {
          position: "top-center",
          autoClose: 2000, // Close after 2 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessages = error.response.data.errors || [];

        errorMessages.forEach((err) => {
          toast.error(err, {
            position: "top-center",
            autoClose: 2000, // Close after 5 seconds
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
      } else {
        toast.error(error.message, {
          position: "top-center",
          autoClose: 2000, // Close after 5 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };

  const vacationDetailsFetched = async () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const vacationDetails = await axios.get(
        "https://timetrackerserver-by8t.onrender.com/api/v1/services/requestVacationDetails",
        config
      );

      const vacationInfo = vacationDetails.data.data;

      return vacationInfo;
    } catch (error) {
      toast.error(error.message, {
        position: "top-center",
        autoClose: 2000, // Close after 5 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const adminVacationDetails = async () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const vacationDetails = await axios.get(
        "https://timetrackerserver-by8t.onrender.com/api/v1/admin/adminvacationdetails",
        config
      );

      const vacationInfo = vacationDetails.data.data;

      return vacationInfo;
    } catch (error) {
      toast.error(error.message, {
        position: "top-center",
        autoClose: 2000, // Close after 5 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const logDetailsFetched = async () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const logDetails = await axios.get(
        "https://timetrackerserver-by8t.onrender.com/api/v1/admin/logview",
        config
      );

      const logInfo = logDetails.data.data;

      return logInfo;
    } catch (error) {
      toast.error(error.message, {
        position: "top-center",
        autoClose: 2000, // Close after 5 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const getTimeSheet = async () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const logDetails = await axios.get(
        "https://timetrackerserver-by8t.onrender.com/api/v1/admin/timeview",
        config
      );

      const logInfo = logDetails.data.data;

      return logInfo;
    } catch (error) {
      toast.error(error.message, {
        position: "top-center",
        autoClose: 2000, // Close after 5 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const approveVacationRequest = async (requestId, userId) => {
    const vacationDecisionDetails = {
      requestId: requestId,
      userId: userId,
    };

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const vacationDetails = await axios.post(
        "https://timetrackerserver-by8t.onrender.com/api/v1/admin/vacationdecisionapproved",
        vacationDecisionDetails,
        config
      );

      if (vacationDetails.data.success === true) {
        toast.success(" Successfully Approved!", {
          position: "top-center",
          autoClose: 2000, // Close after 2 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessages = error.response.data.errors || [];

        errorMessages.forEach((err) => {
          toast.error(err, {
            position: "top-center",
            autoClose: 2000, // Close after 5 seconds
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
      } else {
        toast.error(error.message, {
          position: "top-center",
          autoClose: 2000, // Close after 5 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };

  const rejectVacationRequest = async (requestId, userId) => {
    const vacationDecisionDetails = {
      requestId: requestId,
      userId: userId,
    };
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const vacationDetails = await axios.post(
        "https://timetrackerserver-by8t.onrender.com/api/v1/admin/vacationdecisionrejected",
        vacationDecisionDetails,
        config
      );

      if (vacationDetails.data.success === true) {
        toast.success(" Successfully Denied!", {
          position: "top-center",
          autoClose: 2000, // Close after 2 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessages = error.response.data.errors || [];

        errorMessages.forEach((err) => {
          toast.error(err, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
      } else {
        toast.error(error.message, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };

  const workTimeChanges = async (values) => {
    const { startDate, startTime, endTime, pause, comments } = values;

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const startDateObj = new Date(startDate);

    const startTimeObj = convertTimeToDate(startTime, startDateObj);
    const endTimeObj = convertTimeToDate(endTime, startDateObj);
    const pauseInSeconds = convertTimeToSeconds(pause);

    const workTimeDetails = {
      startDate: startDateObj,
      startTime: startTimeObj,
      endTime: endTimeObj,
      breakTime: pauseInSeconds,
      comments: comments,
    };

    try {
      const workTimeReceived = await axios.post(
        "https://timetrackerserver-by8t.onrender.com/api/v1/services/worktimechanges",
        workTimeDetails,
        config
      );

      if (workTimeReceived.data.success === true) {
        toast.success("Work time data sent!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      if (error.response && error.response.data) {
        // Check if the server sent a `message` field
        const errorMessage = error.response.data.message || "An error occurred";

        // Display the error message in a toast
        toast.error(errorMessage, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        // Fallback error message
        toast.error("An unexpected error occurred.", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };

  const timeChangeDetails = async () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const logDetails = await axios.get(
        "https://timetrackerserver-by8t.onrender.com/api/v1/admin/timechangesview",
        config
      );

      const logInfo = logDetails.data.data;

      return logInfo;
    } catch (error) {
      toast.error(error.message, {
        position: "top-center",
        autoClose: 2000, // Close after 5 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const approveTimeRequest = async (requestId, userId) => {
    const TimeDecisionDetails = {
      requestId: requestId,
      userId: userId,
    };
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const timeDetails = await axios.post(
        "https://timetrackerserver-by8t.onrender.com/api/v1/admin/approvetimedecision",
        TimeDecisionDetails,
        config
      );

      if (timeDetails.data.success === true) {
        toast.success(" Successfully Approved!", {
          position: "top-center",
          autoClose: 2000, // Close after 2 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessages = error.response.data.errors || [];

        errorMessages.forEach((err) => {
          toast.error(err, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
      } else {
        toast.error(error.message, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };

  const rejectTimeRequest = async (requestId, userId) => {
    const TimeDecisionDetails = {
      requestId: requestId,
      userId: userId,
    };
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const timeDetails = await axios.post(
        "https://timetrackerserver-by8t.onrender.com/api/v1/admin/rejecttimedecision",
        TimeDecisionDetails,
        config
      );

      if (timeDetails.data.success === true) {
        toast.success(" Successfully Rejected!", {
          position: "top-center",
          autoClose: 2000, // Close after 2 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message || "An error occurred";

        toast.error(errorMessage, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error(error.message, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };
  const convertTimeToDate = (time, baseDate) => {
    const [hours, minutes] = time.split(":").map(Number);

    const date = new Date(baseDate);
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const convertTimeToSeconds = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 3600 + minutes * 60;
  };
  return (
    <AppContext.Provider
      value={{
        ...state,
        token,
        email,
        pictureUrl,
        isLoading,
        addUserToLocalStorage,
        handleGoogleLogin,
        logUserOff,
        startTimer,
        pauseTimer,
        isRunning,
        totalWorkedTime,
        totalWorkTime,
        format,
        calculateRemainingTime,
        breakTime,
        isOverTime,
        overTime,
        workStopped,
        vacationLeaveTaken,
        vacationDetailsFetched,
        logDetailsFetched,
        getTimeSheet,
        adminVacationDetails,
        approveVacationRequest,
        rejectVacationRequest,
        workTimeChanges,
        timeChangeDetails,
        approveTimeRequest,
        rejectTimeRequest,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useAppContext() {
  return useContext(AppContext);
}
