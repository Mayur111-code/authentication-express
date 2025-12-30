import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Check password strength
    if (name === "password") {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await API.post("/auth/register", form);
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    switch(passwordStrength) {
      case 0: return "bg-gray-200";
      case 1: return "bg-red-500";
      case 2: return "bg-yellow-500";
      case 3: return "bg-blue-500";
      case 4: return "bg-green-500";
      default: return "bg-gray-200";
    }
  };

  const getStrengthText = () => {
    switch(passwordStrength) {
      case 0: return "Very weak";
      case 1: return "Weak";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Strong";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-4">
      <div className="absolute inset-0 bg-dots-pattern opacity-5 -z-10"></div>
      
      <div className="w-full max-w-xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl transform rotate-6">
              <i className="fas fa-user-plus text-white text-2xl"></i>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Join Our Community
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Create your account and start your journey with us
          </p>
        </div>

        {/* Registration Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Benefits */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800">Benefits of joining</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <i className="fas fa-shield-alt text-green-600"></i>
                  </div>
                  <span className="text-gray-700">Secure & encrypted data protection</span>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <i className="fas fa-bolt text-blue-600"></i>
                  </div>
                  <span className="text-gray-700">Fast and seamless experience</span>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <i className="fas fa-headset text-purple-600"></i>
                  </div>
                  <span className="text-gray-700">24/7 customer support</span>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <i className="fas fa-gift text-pink-600"></i>
                  </div>
                  <span className="text-gray-700">Exclusive member benefits</span>
                </li>
              </ul>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                <p className="text-sm text-gray-600">
                  <i className="fas fa-info-circle text-blue-500 mr-2"></i>
                  Already have an account? 
                  <Link to="/login" className="ml-1 font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>

            {/* Right Column - Form */}
            <div>
              {error && (
                <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                      <i className="fas fa-exclamation-triangle text-red-600"></i>
                    </div>
                    <div>
                      <p className="font-medium text-red-800">Registration Failed</p>
                      <p className="text-sm text-red-600 mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="far fa-user text-gray-400"></i>
                    </div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3.5 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="far fa-envelope text-gray-400"></i>
                    </div>
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3.5 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fas fa-lock text-gray-400"></i>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Create a strong password"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3.5 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <i className={`far ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-gray-400 hover:text-gray-600 transition-colors`}></i>
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {form.password && (
                    <div className="mt-3">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-600">Password strength</span>
                        <span className={`text-xs font-semibold ${
                          passwordStrength <= 1 ? 'text-red-600' :
                          passwordStrength === 2 ? 'text-yellow-600' :
                          passwordStrength === 3 ? 'text-blue-600' : 'text-green-600'
                        }`}>
                          {getStrengthText()}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                          style={{ width: `${passwordStrength * 25}%` }}
                        ></div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        <i className="fas fa-info-circle mr-1"></i>
                        Use 8+ characters with uppercase, numbers & symbols
                      </div>
                    </div>
                  )}
                </div>

                {/* Phone Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fas fa-phone text-gray-400"></i>
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+1 (555) 123-4567"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3.5 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-0.5"
                  />
                  <label htmlFor="terms" className="ml-3 text-sm text-gray-600">
                    I agree to the{" "}
                    <a href="#" className="text-purple-600 hover:text-purple-800 font-medium">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-purple-600 hover:text-purple-800 font-medium">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                {/* Register Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl ${
                    loading 
                      ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 hover:from-purple-700 hover:via-pink-600 hover:to-red-600'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-6 h-6 border-t-2 border-white border-solid rounded-full animate-spin mr-3"></div>
                      Creating Account...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <i className="fas fa-rocket mr-3"></i>
                      Create Account
                    </div>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-4 text-gray-500 text-sm">Or sign up with</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              {/* Social Registration */}
              <div className="grid grid-cols-3 gap-3">
                <button className="flex items-center justify-center py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:border-gray-300">
                  <i className="fab fa-google text-red-500 mr-2"></i>
                  <span className="text-sm font-medium">Google</span>
                </button>
                <button className="flex items-center justify-center py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:border-gray-300">
                  <i className="fab fa-facebook text-blue-600 mr-2"></i>
                  <span className="text-sm font-medium">Facebook</span>
                </button>
                <button className="flex items-center justify-center py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:border-gray-300">
                  <i className="fab fa-apple text-gray-800 mr-2"></i>
                  <span className="text-sm font-medium">Apple</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Your Brand. All rights reserved.</p>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/80 to-transparent pointer-events-none -z-5"></div>
      <div className="fixed top-10 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob -z-10"></div>
      <div className="fixed bottom-10 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 -z-10"></div>
    </div>
  );
};

export default Register;