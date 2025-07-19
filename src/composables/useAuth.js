import api from "@/lib/axios";
import { useRouter } from "vue-router";

export function useAuth() {
  const router = useRouter();
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {}

    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    router.push("/");
  };

  return {
    logout,
  };
}
