import { useState } from "react";
import axios from "axios";

const CLIENT_ID = "Ov23lik1VjsjqfX5ZZ8A";

export function useGitHubAuth() {
    const [user, setUser] = useState(null);

    const loginWithGitHub = () => {
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${Ov23lik1VjsjqfX5ZZ8A}&scope=user`;
    };

    const fetchUserData = async (code) => {
        try {
            const { data } = await axios.post("http://localhost:5000/auth/github", { code });
            setUser(data);
        } catch (error) {
            console.error("GitHub Auth Error:", error);
        }
    };

    return { user, loginWithGitHub, fetchUserData };
}
