import api from "@/lib/axios";

export function useAuth() {
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {}

    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    window.location.href = "/";
  };

  return {
    logout,
  };
}
