import { redirect } from "next/navigation";

const RegisterRedirectPage = () => {
  redirect("/auth?mode=signup");
};

export default RegisterRedirectPage;
