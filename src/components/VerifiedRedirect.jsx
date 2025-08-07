import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { FadeLoader } from "react-spinners";

export default function VerifiedRedirect() {
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            const user = auth.currentUser;
            if (!user || !user.emailVerified) return;

            const ref = doc(db, "users", user.uid);
            const snap = await getDoc(ref);

            if (!snap.exists()) {
                const firstName = localStorage.getItem("firstName");
                const lastName = localStorage.getItem("lastName");

                await setDoc(ref, {
                    email: user.email,
                    firstName: firstName || "",
                    lastName: lastName || ""
                });

                toast.success(`Welcome ${firstName}  Your profile is now saved!`);
            }

            navigate("/");
        };

        checkUser();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <FadeLoader color="#4f46e5" />
        </div>
    );

}
