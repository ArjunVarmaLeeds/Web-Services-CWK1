import React, { useEffect, useMemo, useState } from "react";
import { admin } from "../services/api";
import { Loader } from "../components/Loader";
import { ErrorAlert } from "../components/ErrorAlert";

const initialForm = { email: "", password: "" };

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await admin.listUsers();
      setUsers(data?.data ?? []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Unable to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openModal = (user = null) => {
    setEditing(user);
    setForm({ email: user?.email ?? "", password: "" });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setForm(initialForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError(null);

    try {
      if (editing) {
        const payload = { email: form.email };
        await admin.updateUser(editing.id, payload);
      } else {
        await admin.createUser(form.email, form.password);
      }
      await fetchUsers();
      closeModal();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to save user.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (user) => {
    const ok = window.confirm(`Delete user ${user.email}? This cannot be undone.`);
    if (!ok) return;
    try {
      await admin.deleteUser(user.id);
      await fetchUsers();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Unable to delete user.");
    }
  };

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => a.id - b.id);
  }, [users]);

  return (
    <div className="container-fluid py-4">
      <div className="d-flex flex-column flex-md-row align-items-start justify-content-between gap-3 mb-4">
        <div>
          <h2 className="mb-1">User Management</h2>
          <p className="text-muted mb-0">Create, edit, and manage application users (admin only).</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <i className="bi bi-plus-lg me-2"></i> New user
        </button>
      </div>

      {loading ? (
        <Loader message="Loading users..." />
      ) : (
        <>
          {error ? <ErrorAlert message={error} onClose={() => setError(null)} /> : null}

          <div className="card overflow-auto">
            <div className="table-responsive">
              <table className="table table-dark table-striped align-middle mb-0">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Email</th>
                    <th scope="col">Created</th>
                    <th scope="col" className="text-end">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.email}</td>
                      <td>{new Date(user.createdAt).toLocaleString()}</td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-light me-2" onClick={() => openModal(user)}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(user)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {modalOpen ? (
        <div className="modal fade show d-block" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark border-secondary">
              <div className="modal-header">
                <h5 className="modal-title">{editing ? "Edit user" : "Create user"}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={closeModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      className="form-control"
                      value={form.email}
                      onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                      required
                      type="email"
                    />
                  </div>
                  {!editing ? (
                    <div className="mb-3">
                      <label className="form-label">Password</label>
                      <input
                        className="form-control"
                        value={form.password}
                        onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
                        type="password"
                        required
                        minLength={6}
                      />
                    </div>
                  ) : null}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-light" onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submitLoading}>
                    {submitLoading ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
