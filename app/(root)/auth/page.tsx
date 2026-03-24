"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

import { AppForm, AppFormField, FormLoader, SubmitButton } from "@/components";
import { login, parseApiError, register } from "@/app/lib/authClient";

type AuthMode = "login" | "signup" | "forgot";
type MotionState = "idle" | "exiting" | "entering";

type LoginValues = {
  username: string;
  password: string;
};

type SignupValues = {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  mobile_number: string;
  whatsapp_number: string;
  password: string;
  password2: string;
};

type ForgotValues = {
  email: string;
};

const modeOrder: AuthMode[] = ["login", "signup", "forgot"];

const parseMode = (value: string | null): AuthMode => {
  if (value === "signup" || value === "forgot" || value === "login") {
    return value;
  }
  return "login";
};

const modeTitle: Record<AuthMode, string> = {
  login: "Login",
  signup: "Create account",
  forgot: "Forgot password",
};

const loginSchema = Yup.object({
  username: Yup.string().trim().required("Username or email is required."),
  password: Yup.string().required("Password is required."),
});

const signupSchema = Yup.object({
  username: Yup.string().trim().min(3, "Username must be at least 3 characters.").required("Username is required."),
  email: Yup.string().email("Enter a valid email address.").required("Email is required."),
  first_name: Yup.string().trim().required("First name is required."),
  last_name: Yup.string().trim().required("Last name is required."),
  mobile_number: Yup.string()
    .trim()
    .matches(/^\+233\d{9}$/, "Use +233 followed by 9 digits.")
    .required("Mobile number is required."),
  whatsapp_number: Yup.string()
    .trim()
    .matches(/^\+233\d{9}$/, "Use +233 followed by 9 digits.")
    .notRequired(),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters.")
    .matches(/[A-Z]/, "Password must include at least one uppercase letter.")
    .matches(/[a-z]/, "Password must include at least one lowercase letter.")
    .matches(/\d/, "Password must include at least one number.")
    .required("Password is required."),
  password2: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match.")
    .required("Please confirm your password."),
});

const forgotSchema = Yup.object({
  email: Yup.string().email("Enter a valid email address.").required("Email is required."),
});

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const AuthPage = () => {
  const router = useRouter();

  const [activeMode, setActiveMode] = useState<AuthMode>("login");
  const [transitionTarget, setTransitionTarget] = useState<AuthMode | null>(null);
  const [motionState, setMotionState] = useState<MotionState>("idle");
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
  const [curtainSeed, setCurtainSeed] = useState(0);
  const [announceText, setAnnounceText] = useState("Login form active.");
  const [statusText, setStatusText] = useState("");
  const [statusTone, setStatusTone] = useState<"success" | "error">("success");
  const [pendingLabel, setPendingLabel] = useState("");

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirm, setShowSignupConfirm] = useState(false);

  const timeoutRef = useRef<number[]>([]);
  const isAnimating = motionState !== "idle";

  useEffect(() => {
    return () => {
      timeoutRef.current.forEach((timer) => window.clearTimeout(timer));
      timeoutRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const urlMode = parseMode(new URLSearchParams(window.location.search).get("mode"));
    if (urlMode !== activeMode) {
      setActiveMode(urlMode);
      setAnnounceText(`Opening ${modeTitle[urlMode]} form.`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const queueTimeout = (fn: () => void, delay: number) => {
    const id = window.setTimeout(fn, delay);
    timeoutRef.current.push(id);
  };

  const triggerModeSwitch = (nextMode: AuthMode, syncUrl = true) => {
    if (nextMode === activeMode || nextMode === transitionTarget) {
      return;
    }

    timeoutRef.current.forEach((timer) => window.clearTimeout(timer));
    timeoutRef.current = [];

    const currentIndex = modeOrder.indexOf(activeMode);
    const nextIndex = modeOrder.indexOf(nextMode);
    setSlideDirection(nextIndex > currentIndex ? 1 : -1);
    setTransitionTarget(nextMode);
    setMotionState("exiting");
    setCurtainSeed((value) => value + 1);
    setAnnounceText(`Opening ${modeTitle[nextMode]} form.`);

    if (syncUrl) {
      router.replace(`/auth?mode=${nextMode}`, { scroll: false });
    }

    queueTimeout(() => {
      setActiveMode(nextMode);
      setMotionState("entering");
    }, 220);

    queueTimeout(() => {
      setMotionState("idle");
      setTransitionTarget(null);
    }, 260);
  };

  const cardMotionClass =
    motionState === "idle"
      ? "translate-x-0 opacity-100"
      : motionState === "exiting"
      ? slideDirection === 1
        ? "-translate-x-8 opacity-0"
        : "translate-x-8 opacity-0"
      : slideDirection === 1
      ? "translate-x-8 opacity-0"
      : "-translate-x-8 opacity-0";

  const submitSimulation = async (label: string, successMessage: string) => {
    setStatusText("");
    setStatusTone("success");
    setPendingLabel(label);
    await wait(1100);
    setPendingLabel("");
    setStatusText(successMessage);
  };

  return (
    <section aria-labelledby="auth-title">
      <div className="inner-wrapper">
        <div className="mx-auto max-w-5xl">
          <header className="mb-6 text-center sm:mb-8">
            <h1 id="auth-title" className="big-text-2 font-black text-white">
              Customer account access
            </h1>
          </header>

          <div className="mx-auto w-full max-w-2xl">
            <div className="relative overflow-hidden rounded-2xl border border-secondary/25 bg-white shadow-xl">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
                <div
                  key={`left-${curtainSeed}`}
                  className={`auth-curtain-left absolute inset-y-0 left-0 w-1/2 bg-primary ${isAnimating ? "auth-curtain-left--run" : ""}`}
                />
                <div
                  key={`right-${curtainSeed}`}
                  className={`auth-curtain-right absolute inset-y-0 right-0 w-1/2 bg-secondary ${isAnimating ? "auth-curtain-right--run" : ""}`}
                />
              </div>

              <div className="relative z-10 p-4 sm:p-6">
                <p className="sr-only" aria-live="polite">
                  {announceText}
                </p>

                {statusText ? (
                  <p
                    className={`mb-4 rounded-lg border px-3 py-2 text-sm font-medium ${
                      statusTone === "error"
                        ? "border-red-200 bg-red-50 text-red-700"
                        : "border-accent-2/50 bg-white/15 text-white"
                    }`}
                  >
                    {statusText}
                  </p>
                ) : null}

                <div
                  id="auth-form-panel"
                  aria-label={`${modeTitle[activeMode]} form`}
                  className={`transition-all duration-300 motion-reduce:transition-none ${cardMotionClass}`}
                >
                  {activeMode === "login" ? (
                    <AppForm<LoginValues>
                      ariaLabel="Login form"
                      initialValues={{ username: "", password: "" }}
                      validationSchema={loginSchema}
                      onSubmit={async (values, actions) => {
                        setStatusText("");
                        setStatusTone("success");
                        setPendingLabel("Logging in");

                        try {
                          await login(values.username.trim(), values.password);
                          setStatusText("Login successful. Redirecting to dashboard...");
                          router.push("/dashboard");
                        } catch (error) {
                          const parsed = parseApiError(error, "Login failed. Please check your credentials.");
                          Object.entries(parsed.fields).forEach(([field, message]) => {
                            actions.setFieldError(field, message);
                          });
                          setStatusTone("error");
                          setStatusText(parsed.message);
                        } finally {
                          setPendingLabel("");
                          actions.setSubmitting(false);
                        }
                      }}
                    >
                      <h2 className="mb-1 text-xl font-black text-white">Login to your account</h2>
                      <AppFormField<LoginValues>
                        name="username"
                        label="Username or Email"
                        labelClassName="text-white"
                        placeholder="Enter username or email"
                        autoComplete="username"
                      />
                      <AppFormField<LoginValues>
                        name="password"
                        label="Password"
                        labelClassName="text-white"
                        type={showLoginPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        icon={showLoginPassword ? "eye-slash" : "eye"}
                        iconAria={showLoginPassword ? "Hide password" : "Show password"}
                        iconClick={() => setShowLoginPassword((state) => !state)}
                      />
                      <button
                        type="button"
                        onClick={() => triggerModeSwitch("forgot")}
                        className="w-fit rounded text-sm font-semibold text-white underline decoration-accent-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
                      >
                        Forgot password?
                      </button>
                      <SubmitButton title="Login" />
                      <p className="text-center text-sm text-white/95">
                        Need an account?{" "}
                        <button
                          type="button"
                          onClick={() => triggerModeSwitch("signup")}
                          className="rounded font-semibold text-white underline decoration-accent-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
                        >
                          Sign up
                        </button>
                      </p>
                    </AppForm>
                  ) : null}

                  {activeMode === "signup" ? (
                    <AppForm<SignupValues>
                      ariaLabel="Signup form"
                      initialValues={{
                        username: "",
                        email: "",
                        first_name: "",
                        last_name: "",
                        mobile_number: "",
                        whatsapp_number: "",
                        password: "",
                        password2: "",
                      }}
                      validationSchema={signupSchema}
                      onSubmit={async (values, actions) => {
                        setStatusText("");
                        setStatusTone("success");
                        setPendingLabel("Creating account");

                        try {
                          const response = await register({
                            username: values.username.trim(),
                            email: values.email.trim(),
                            first_name: values.first_name.trim(),
                            last_name: values.last_name.trim(),
                            mobile_number: values.mobile_number.trim(),
                            whatsapp_number: values.whatsapp_number.trim() || null,
                            password: values.password,
                            password2: values.password2,
                          });

                          setStatusText(response.message || "Account created successfully. Redirecting to dashboard...");
                          router.push("/dashboard");
                        } catch (error) {
                          const parsed = parseApiError(error, "Account creation failed. Please review your details.");
                          Object.entries(parsed.fields).forEach(([field, message]) => {
                            actions.setFieldError(field, message);
                          });
                          setStatusTone("error");
                          setStatusText(parsed.message);
                        } finally {
                          setPendingLabel("");
                          actions.setSubmitting(false);
                        }
                      }}
                    >
                      <h2 className="mb-1 text-xl font-black text-white">Create customer account</h2>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <AppFormField<SignupValues>
                          name="first_name"
                          label="First Name"
                          labelClassName="text-white"
                          placeholder="John"
                          autoComplete="given-name"
                        />
                        <AppFormField<SignupValues>
                          name="last_name"
                          label="Last Name"
                          labelClassName="text-white"
                          placeholder="Doe"
                          autoComplete="family-name"
                        />
                      </div>
                      <AppFormField<SignupValues>
                        name="username"
                        label="Username"
                        labelClassName="text-white"
                        placeholder="john_doe"
                        autoComplete="username"
                      />
                      <AppFormField<SignupValues>
                        name="email"
                        label="Email"
                        labelClassName="text-white"
                        type="email"
                        placeholder="john@example.com"
                        autoComplete="email"
                      />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <AppFormField<SignupValues>
                          name="mobile_number"
                          label="Mobile Number"
                          labelClassName="text-white"
                          type="tel"
                          placeholder="+233241234567"
                          autoComplete="tel"
                        />
                        <AppFormField<SignupValues>
                          name="whatsapp_number"
                          label="WhatsApp Number (Optional)"
                          labelClassName="text-white"
                          type="tel"
                          placeholder="+233241234567"
                          autoComplete="tel"
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <AppFormField<SignupValues>
                          name="password"
                          label="Password"
                          labelClassName="text-white"
                          type={showSignupPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          autoComplete="new-password"
                          icon={showSignupPassword ? "eye-slash" : "eye"}
                          iconAria={showSignupPassword ? "Hide password" : "Show password"}
                          iconClick={() => setShowSignupPassword((state) => !state)}
                        />
                        <AppFormField<SignupValues>
                          name="password2"
                          label="Confirm Password"
                          labelClassName="text-white"
                          type={showSignupConfirm ? "text" : "password"}
                          placeholder="Re-enter password"
                          autoComplete="new-password"
                          icon={showSignupConfirm ? "eye-slash" : "eye"}
                          iconAria={showSignupConfirm ? "Hide confirm password" : "Show confirm password"}
                          iconClick={() => setShowSignupConfirm((state) => !state)}
                        />
                      </div>
                      <SubmitButton title="Create account" />
                      <p className="text-center text-sm text-white/95">
                        Already a member?{" "}
                        <button
                          type="button"
                          onClick={() => triggerModeSwitch("login")}
                          className="rounded font-semibold text-white underline decoration-accent-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
                        >
                          Sign in
                        </button>
                      </p>
                    </AppForm>
                  ) : null}

                  {activeMode === "forgot" ? (
                    <AppForm<ForgotValues>
                      ariaLabel="Forgot password form"
                      initialValues={{ email: "" }}
                      validationSchema={forgotSchema}
                      onSubmit={async (values, actions) => {
                        await submitSimulation(
                          "Sending reset link",
                          `Simulation successful. A reset link was sent to ${values.email}.`,
                        );
                        actions.setSubmitting(false);
                      }}
                    >
                      <h2 className="mb-1 text-xl font-black text-white">Reset your password</h2>
                      <p className="text-sm text-white/90">
                        Enter your email and we will simulate a reset-link request.
                      </p>
                      <AppFormField<ForgotValues>
                        name="email"
                        label="Email"
                        labelClassName="text-white"
                        type="email"
                        placeholder="john@example.com"
                        autoComplete="email"
                      />
                      <SubmitButton title="Send reset link" />
                      <p className="text-center text-sm text-white/95">
                        Remembered your password?{" "}
                        <button
                          type="button"
                          onClick={() => triggerModeSwitch("login")}
                          className="rounded font-semibold text-white underline decoration-accent-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
                        >
                          Sign in
                        </button>
                      </p>
                    </AppForm>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FormLoader visible={Boolean(pendingLabel)} message={pendingLabel || "Processing"} />

      <style jsx>{`
        .auth-curtain-left--run {
          animation: auth-curtain-left 620ms ease-in-out forwards;
        }

        .auth-curtain-right--run {
          animation: auth-curtain-right 620ms ease-in-out forwards;
        }

        @keyframes auth-curtain-left {
          0% {
            transform: translateX(-100%);
          }
          40%,
          60% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        @keyframes auth-curtain-right {
          0% {
            transform: translateX(100%);
          }
          40%,
          60% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .auth-curtain-left--run,
          .auth-curtain-right--run {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
};

export default AuthPage;
