import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
  });

  useEffect(() => {
    API.get("/auth/profile")
      .then((res) => {
        setUser(res.data.user);
        setEditForm({
          name: res.data.user.name,
          phone: res.data.user.phone
        });
        // Generate avatar based on user's name or email
        generateAvatar(res.data.user);
        setLoading(false);
      })
      .catch(() => {
        navigate("/login");
      });
  }, []);

  const generateAvatar = (userData) => {
    // Using DiceBear API for avatars - you can choose different styles
    const seed = userData.name || userData.email;
    // You can change 'avataaars' to other styles like: 'bottts', 'micah', 'pixel-art', 'identicon'
    const style = 'avataaars';
    const url = `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=6366f1&radius=50`;
    setAvatarUrl(url);
  };

  const logout = async () => {
    await API.post("/auth/logout");
    navigate("/login");
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await API.put("/auth/profile", editForm);
      setUser(response.data.user);
      setIsEditing(false);
      generateAvatar(response.data.user);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-4">
      {/* Background decorative elements */}
      <div className="fixed top-0 left-0 right-0 h-64 bg-gradient-to-r from-blue-500/10 to-purple-500/10 -z-10"></div>
      <div className="fixed bottom-0 left-0 right-0 h-64 bg-gradient-to-r from-green-500/10 to-cyan-500/10 -z-10"></div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600">Manage your account information</p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <i className="fas fa-arrow-left"></i>
            Back to Dashboard
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Avatar & Stats */}
          <div className="space-y-6">
            {/* Avatar Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex flex-col items-center">
                {/* Avatar */}
                <div className="relative mb-4">
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt={`${user.name}'s avatar`}
                      className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff&size=128`;
                      }}
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                      {getInitials(user.name)}
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <i className="fas fa-check text-white text-xs"></i>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-600 text-sm mb-2">{user.email}</p>
                
                <div className="flex gap-2 mt-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    Member
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Active
                  </span>
                </div>
              </div>

              {/* Avatar Options */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Avatar Options</h3>
                <div className="grid grid-cols-4 gap-2">
                  {['avataaars', 'bottts', 'micah', 'pixel-art'].map((style) => (
                    <button
                      key={style}
                      onClick={() => setAvatarUrl(`https://api.dicebear.com/7.x/${style}/svg?seed=${user.name || user.email}&backgroundColor=6366f1&radius=50`)}
                      className="w-12 h-12 rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 transition-colors"
                      title={`${style} style`}
                    >
                      <img 
                        src={`https://api.dicebear.com/7.x/${style}/svg?seed=${user.name || user.email}&backgroundColor=6366f1&radius=50&size=48`}
                        alt={`${style} avatar`}
                        className="w-full h-full"
                      />
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">Click to change avatar style</p>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Account Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Member since</span>
                  <span className="font-medium">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Last login</span>
                  <span className="font-medium">Today</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Account status</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">Verified</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <i className="fas fa-user-shield text-blue-600"></i>
                  <span>Privacy Settings</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <i className="fas fa-bell text-purple-600"></i>
                  <span>Notification Preferences</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <i className="fas fa-shield-alt text-green-600"></i>
                  <span>Security</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Info & Actions */}
          <div className="md:col-span-2 space-y-6">
            {/* Profile Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                <button
                  onClick={handleEditToggle}
                  className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  <i className={`fas ${isEditing ? 'fa-times' : 'fa-edit'}`}></i>
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              <div className="space-y-6">
                {/* Name Field */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <i className="fas fa-user text-gray-400"></i>
                        <span className="font-medium text-gray-900">{user.name}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <i className="fas fa-envelope text-gray-400"></i>
                      <span className="font-medium text-gray-900">{user.email}</span>
                      <span className="ml-auto px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">Verified</span>
                    </div>
                  </div>
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={editForm.phone}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <i className="fas fa-phone text-gray-400"></i>
                      <span className="font-medium text-gray-900">{user.phone}</span>
                    </div>
                  )}
                </div>

                {/* Additional Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      User ID
                    </label>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <code className="text-sm text-gray-600 font-mono">#{user.id || 'USR-001'}</code>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Type
                    </label>
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                      <span className="font-medium text-blue-800">Premium Member</span>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleUpdateProfile}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <i className="fas fa-save mr-2"></i>
                      Save Changes
                    </button>
                    <button
                      onClick={handleEditToggle}
                      className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Danger Zone Card */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl shadow-lg p-8 border border-red-100">
              <h2 className="text-2xl font-bold text-red-900 mb-4">Account Actions</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-red-800 mb-2">Logout</h3>
                  <p className="text-red-600 text-sm mb-4">Sign out from your current session</p>
                  <button
                    onClick={logout}
                    className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-medium rounded-xl hover:from-red-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-sign-out-alt"></i>
                    Logout Account
                  </button>
                </div>
                <div>
                  <h3 className="font-semibold text-red-800 mb-2">Danger Zone</h3>
                  <p className="text-red-600 text-sm mb-4">Permanently delete your account</p>
                  <button className="w-full md:w-auto px-6 py-3 bg-white text-red-600 border border-red-300 font-medium rounded-xl hover:bg-red-50 transition-colors">
                    <i className="fas fa-trash-alt mr-2"></i>
                    Delete Account
                  </button>
                </div>
              </div>
              <div className="mt-6 p-4 bg-white/50 rounded-xl">
                <div className="flex items-start gap-3">
                  <i className="fas fa-exclamation-triangle text-orange-500 mt-0.5"></i>
                  <p className="text-sm text-red-700">
                    <span className="font-semibold">Warning:</span> Deleting your account is permanent and cannot be undone. All your data will be permanently removed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;