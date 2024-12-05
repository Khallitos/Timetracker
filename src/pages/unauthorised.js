import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const Unauthorized = () => {
  const [role, setRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Get role from localStorage
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  return (
    <div style={styles.container}>
      <h1>You are not authorized to view this page</h1>
      <p>
        If you are redirected here, it may be because you need the appropriate
        permissions.
      </p>

      {role === "user" ? (
        <Link href="/user/dashboard">Home</Link>
      ) : role === "admin" ? (
        <Link href="/admin/dashboard">Home</Link>
      ) : (
        <Link href="/">Home</Link>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    textAlign: "center",
    backgroundColor: "#f0f0f0",
    color: "#333",
  },
};

export default Unauthorized;
