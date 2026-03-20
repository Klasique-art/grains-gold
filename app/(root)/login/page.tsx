import { redirect } from "next/navigation";

const LoginRedirectPage = () => {
  redirect("/auth?mode=login");
};

export default LoginRedirectPage;
