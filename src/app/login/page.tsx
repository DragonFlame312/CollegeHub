"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { User, KeyRound, Eye, EyeOff, Mail, School } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

// Form schemas
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const collegeIdSchema = z.object({
  collegeId: z
    .string()
    .min(5, { message: "College ID must be at least 5 characters" }),
  pin: z
    .string()
    .min(4, { message: "PIN must be at least 4 characters" }),
});

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("email");
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { login, register, loginWithCollegeId, user } = useAuth();

  // Redirect if already logged in
  if (user) {
    router.push("/");
    return null;
  }

  // Email/Password Login Form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Sign Up Form
  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // College ID Form
  const collegeIdForm = useForm<z.infer<typeof collegeIdSchema>>({
    resolver: zodResolver(collegeIdSchema),
    defaultValues: {
      collegeId: "",
      pin: "",
    },
  });

  // Handle login submission
  async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
    try {
      setIsSubmitting(true);
      await login(values.email, values.password);
      toast.success("Login successful! Redirecting...");
      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle signup submission
  async function onSignupSubmit(values: z.infer<typeof signupSchema>) {
    try {
      setIsSubmitting(true);
      await register(values.name, values.email, values.password);
      toast.success("Account created successfully! Redirecting...");
      router.push("/");
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error?.message || "Failed to create account");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle college ID submission
  async function onCollegeIdSubmit(values: z.infer<typeof collegeIdSchema>) {
    try {
      setIsSubmitting(true);
      await loginWithCollegeId(values.collegeId, values.pin);
      toast.success("College ID login successful! Redirecting...");
      router.push("/");
    } catch (error) {
      console.error("College ID login error:", error);
      toast.error("Login failed. Please check your College ID and PIN.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Welcome to CollegeHub</h1>
          <p className="text-muted-foreground mt-2">
            {authMode === "login"
              ? "Sign in to access all features"
              : "Create a new account to get started"}
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email" className="flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="collegeId" className="flex items-center">
              <School className="mr-2 h-4 w-4" />
              College ID
            </TabsTrigger>
          </TabsList>

          {/* Email Login/Signup Tab */}
          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle>
                  {authMode === "login" ? "Log In" : "Sign Up"}
                </CardTitle>
                <CardDescription>
                  {authMode === "login"
                    ? "Enter your email and password to access your account"
                    : "Create a new account to access all features"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {authMode === "login" ? (
                  <Form {...loginForm}>
                    <form
                      onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  placeholder="your.email@example.com"
                                  className="pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Enter your password"
                                  className="pl-10"
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-0 top-0 h-9 w-9"
                                  onClick={() =>
                                    setShowPassword(!showPassword)
                                  }
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Logging in..." : "Log In"}
                      </Button>
                    </form>
                  </Form>
                ) : (
                  <Form {...signupForm}>
                    <form
                      onSubmit={signupForm.handleSubmit(onSignupSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={signupForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  placeholder="Your Name"
                                  className="pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signupForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  placeholder="your.email@example.com"
                                  className="pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signupForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Create a password"
                                  className="pl-10"
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-0 top-0 h-9 w-9"
                                  onClick={() =>
                                    setShowPassword(!showPassword)
                                  }
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signupForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Confirm your password"
                                  className="pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Creating account..." : "Sign Up"}
                      </Button>
                    </form>
                  </Form>
                )}
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="text-center text-sm">
                  {authMode === "login" ? (
                    <div>
                      Don&apos;t have an account?{" "}
                      <Button
                        variant="link"
                        className="p-0 h-auto"
                        onClick={() => setAuthMode("signup")}
                      >
                        Sign up
                      </Button>
                    </div>
                  ) : (
                    <div>
                      Already have an account?{" "}
                      <Button
                        variant="link"
                        className="p-0 h-auto"
                        onClick={() => setAuthMode("login")}
                      >
                        Log in
                      </Button>
                    </div>
                  )}
                </div>
                <div className="text-center text-sm">
                  <Link href="/" className="text-primary hover:underline">
                    Continue as guest
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* College ID Tab */}
          <TabsContent value="collegeId">
            <Card>
              <CardHeader>
                <CardTitle>College ID Login</CardTitle>
                <CardDescription>
                  Enter your college ID and PIN to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...collegeIdForm}>
                  <form
                    onSubmit={collegeIdForm.handleSubmit(onCollegeIdSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={collegeIdForm.control}
                      name="collegeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>College ID</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <School className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="Your College ID"
                                className="pl-10"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={collegeIdForm.control}
                      name="pin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>PIN</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your PIN"
                                className="pl-10"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-9 w-9"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Logging in..." : "Log In with College ID"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <div className="text-center text-sm">
                  <Link href="/" className="text-primary hover:underline">
                    Continue as guest
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
