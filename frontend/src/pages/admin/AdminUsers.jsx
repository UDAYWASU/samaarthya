// AdminDashboard.jsx
import React, { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ name: "", email: "", user_type: "student" });

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/admin/users/all");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    await fetch(`http://localhost:4000/api/admin/users/delete/${id}`, { method: "DELETE" });
    fetchUsers();
  };

  const handleEdit = async () => {
    await fetch(`http://localhost:4000/api/admin/users/update/${editingUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingUser),
    });
    setEditingUser(null);
    fetchUsers();
  };

  const handleCreate = async () => {
    await fetch("http://localhost:4000/api/admin/users/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });
    setNewUser({ name: "", email: "", user_type: "student" });
    fetchUsers();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin User Management</h1>

      <div className="bg-white shadow p-4 rounded mb-6">
        <h2 className="text-lg font-semibold mb-2">Create New User</h2>
        <input
          type="text"
          placeholder="Name"
          className="border px-2 py-1 mr-2"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="border px-2 py-1 mr-2"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <select
          className="border px-2 py-1 mr-2"
          value={newUser.user_type}
          onChange={(e) => setNewUser({ ...newUser, user_type: e.target.value })}
        >
          <option value="student">Student</option>
          <option value="professional">Professional</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={handleCreate} className="bg-green-600 text-white px-4 py-1 rounded">
          Create
        </button>
      </div>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">User Type</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border p-2">
                {editingUser?.id === user.id ? (
                  <input
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="border px-2 py-1"
                  />
                ) : (
                  user.name
                )}
              </td>
              <td className="border p-2">
                {editingUser?.id === user.id ? (
                  <input
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="border px-2 py-1"
                  />
                ) : (
                  user.email
                )}
              </td>
              <td className="border p-2">
                {editingUser?.id === user.id ? (
                  <select
                    value={editingUser.user_type}
                    onChange={(e) => setEditingUser({ ...editingUser, user_type: e.target.value })}
                    className="border px-2 py-1"
                  >
                    <option value="student">Student</option>
                    <option value="professional">Professional</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : (
                  user.user_type
                )}
              </td>
              <td className="border p-2 space-x-2">
                {editingUser?.id === user.id ? (
                  <>
                    <button onClick={handleEdit} className="bg-blue-600 text-white px-3 py-1 rounded">Save</button>
                    <button onClick={() => setEditingUser(null)} className="bg-gray-400 text-white px-3 py-1 rounded">Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setEditingUser(user)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                    <button onClick={() => handleDelete(user.id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
