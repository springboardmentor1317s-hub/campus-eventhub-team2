import React, { useState } from "react";
import "./App.css";

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="container">
            <div className="form-container">
                {/* Toggle Buttons */}
                <div className="form-toggle">
                    <button
                        className={isLogin ? "active" : ""}
                        onClick={() => setIsLogin(true)}
                    >
                        Sign In
                    </button>
                    <button
                        className={!isLogin ? "active" : ""}
                        onClick={() => setIsLogin(false)}
                    >
                        Register
                    </button>
                </div>

                {/* Sign In Form */}
                {isLogin ? (
                    <div className="form">
                        <h2 className="form-title">Welcome Back!</h2>
                        <p className="subtitle">Sign in to your CampusEventHub account</p>

                        <input type="email" placeholder="Email Address" />
                        <input type="password" placeholder="Password" />

                        <a href="#">Forgot Password?</a>
                        <button>Sign In</button>

                        {/* Demo Credentials Section */}
                        <div className="demo-box">
                            <h4>Demo Accounts</h4>
                            <ul>
                                <li>
                                    <strong>Student:</strong> john@university.edu / password123
                                </li>
                                <li>
                                    <strong>College Admin:</strong> sarah@university.edu /
                                    password123
                                </li>
                                <li>
                                    <strong>Super Admin:</strong> admin@university.edu /
                                    password123
                                </li>
                            </ul>
                        </div>

                        <p>
                            Don&apos;t have an Account?{" "}
                            <a href="#" onClick={() => setIsLogin(false)}>
                                Sign Up
                            </a>
                        </p>
                    </div>
                ) : (
                    /* Register Form */
                    <div className="form">
                        <h2 className="form-title">Create Account</h2>
                        <p className="subtitle">Join CampusEventHub Today!</p>

                        <input type="text" placeholder="Full Name" />
                        <input type="email" placeholder="Email Address" />
                        <input type="text" placeholder="College / University" />

                        {/* Role Dropdown */}
                        <select>
                            <option value="">Select Role</option>
                            <option value="student">Student</option>
                            <option value="admin">College Admin</option>
                            <option value="superadmin">Super Admin</option>
                        </select>

                        <input type="password" placeholder="Password" />
                        <input type="password" placeholder="Confirm Password" />

                        <button>Create Account</button>
                        <p>
                            Already have an Account?{" "}
                            <a href="#" onClick={() => setIsLogin(true)}>
                                Sign In
                            </a>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
