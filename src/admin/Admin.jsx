import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  doc,
} from "firebase/firestore";

import {
  LayoutDashboard,
  FolderKanban,
  LogOut,
  ExternalLink,
  Pencil,
  Trash2,
  Upload,
} from "lucide-react";

import { auth, db } from "../firebase/config";
import { originalProjects } from "../data/originalProjects";
import "./admin.css";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [tab, setTab] = useState("dashboard");

  const [projects, setProjects] = useState([]);
  const [hiddenIds, setHiddenIds] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState(null);
  const [image, setImage] = useState("");
  const [editId, setEditId] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stop = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChecking(false);
    });

    return () => stop();
  }, []);

  useEffect(() => {
    if (!user) return;

    const stop = onSnapshot(
      collection(db, "projects"),
      (result) => {
        const data = result.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        setProjects(data);
      },
      () => setMessage("Could not load projects.")
    );

    const stopHidden = onSnapshot(
      collection(db, "hiddenProjects"),
      (result) => {
        setHiddenIds(result.docs.map((item) => item.id));
      }
    );

    return () => {
      stop();
      stopHidden();
    };
  }, [user]);

  async function login(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setMessage("Email or password is incorrect.");
    }

    setLoading(false);
  }

  async function forgotPassword() {
    if (!email) {
      setMessage("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("If this email is registered, a reset link will be sent.");
    } catch {
      setMessage("Could not send the reset email.");
    }

    setLoading(false);
  }

  function clearForm() {
    setTitle("");
    setDescription("");
    setLink("");
    setTags("");
    setFile(null);
    setImage("");
    setEditId("");
  }

  async function uploadImage(file) {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    throw new Error("Only JPG, PNG and WebP images are allowed.");
  }

  if (file.size > 2 * 1024 * 1024) {
    throw new Error("Image must be smaller than 2 MB.");
  }

  const base64 = await new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result.split(",")[1]);
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const token = await auth.currentUser.getIdToken();

  const response = await fetch("/api/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      image: base64,
      type: file.type,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Upload failed");
  }

  return result;
}

  async function saveProject(e) {
  e.preventDefault();

  setLoading(true);
  setMessage("");

  try {
    let imageUrl = image;
    let imagePath = "";

    if (file) {
      const result = await uploadImage(file);

      imageUrl = result.url;
      imagePath = result.imagePath;
    }

    if (!imageUrl) {
      throw new Error("Please upload an image.");
    }

    const data = {
      title,
      description,
      link,
      image: imageUrl,
      tags: tags.split(",").map((tag) => tag.trim()),
    };

    if (file) {
      data.imagePath = imagePath;
    }

    if (editId) {
      await updateDoc(doc(db, "projects", editId), data);
    } else {
      await addDoc(collection(db, "projects"), data);
    }

    clearForm();
    setMessage("Project saved successfully!");
  } catch (error) {
    setMessage(error.message);
  }

  setLoading(false);
}

  function editProject(project) {
    setTab("projects");

    setEditId(project.id);
    setTitle(project.title);
    setDescription(project.description);
    setLink(project.link);
    setImage(project.image);
    setTags((project.tags || []).join(", "));
    setFile(null);

    window.scrollTo(0, 0);
  }

  async function removeProject(project) {
  if (!window.confirm("Delete this project?")) return;

  setLoading(true);

  try {
    const isOriginal = originalProjects.some(
      (item) => item.id === project.id
    );

    if (isOriginal) {
      await setDoc(doc(db, "hiddenProjects", project.id), {
        hidden: true,
      });
    }

    await deleteDoc(doc(db, "projects", project.id));

    setMessage("Project deleted successfully!");
  } catch {
    setMessage("Could not delete project.");
  }

  setLoading(false);
}

  async function importProjects() {
    setLoading(true);

    try {
      for (const project of originalProjects) {
        const exists = projects.some(
          (item) =>
            item.id === project.id || item.title === project.title
        );

        if (!exists && !hiddenIds.includes(project.id)) {
          const { id, ...data } = project;

          await setDoc(doc(db, "projects", id), data);
        }
      }

      setMessage("Original projects imported successfully!");
    } catch {
      setMessage("Could not import original projects.");
    }

    setLoading(false);
  }

  const missingProjects = originalProjects.filter(
    (old) =>
      !hiddenIds.includes(old.id) &&
      !projects.some(
        (item) =>
          item.id === old.id || item.title === old.title
      )
  );

  const totalProjects = projects.length + missingProjects.length;

  if (checking) {
    return <div className="cms-center">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="cms-center">
        <form className="cms-login cms-box" onSubmit={login}>
          <div className="cms-logo">&lt;FM/&gt;</div>

          <h1>Welcome Back</h1>

          <p className="cms-muted">
            Sign in to manage your portfolio.
          </p>

          <label>Email Address</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="button"
            className="cms-forgot"
            onClick={forgotPassword}
          >
            Forgot Password?
          </button>

          {message && <p className="cms-message">{message}</p>}

          <button className="cms-primary" disabled={loading}>
            {loading ? "Please wait..." : "Sign In"}
          </button>

          <a href="/" className="cms-back">
            ← Back to Portfolio
          </a>
        </form>
      </div>
    );
  }

  return (
    <div className="cms-layout">
      <aside className="cms-sidebar">
        <div className="cms-logo">&lt;FM/&gt;</div>

        <p className="cms-label">ADMIN PANEL</p>

        <nav className="cms-nav">
          <button
            className={tab === "dashboard" ? "active" : ""}
            onClick={() => setTab("dashboard")}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>

          <button
            className={tab === "projects" ? "active" : ""}
            onClick={() => setTab("projects")}
          >
            <FolderKanban size={20} />
            Projects
          </button>
        </nav>

        <div className="cms-bottom">
          <a href="/" target="_blank" rel="noreferrer">
            <ExternalLink size={18} />
            View Portfolio
          </a>

          <button onClick={() => signOut(auth)}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="cms-main">
        {tab === "dashboard" ? (
          <>
            <h1>
              Dashboard<span>.</span>
            </h1>

            <p className="cms-muted">
              Welcome to your portfolio management panel.
            </p>

            <div className="cms-stats">
              <div className="cms-box cms-stat">
                <FolderKanban size={28} />

                <h2>{totalProjects}</h2>

                <p>Total Projects</p>
              </div>

              <div className="cms-box cms-stat">
                <LayoutDashboard size={28} />

                <h2>Active</h2>

                <p>Admin Session</p>
              </div>
            </div>

            <div className="cms-box">
              <h2>Manage Your Projects</h2>

              <p className="cms-muted">
                Add, edit and delete your portfolio projects.
              </p>

              <button
                className="cms-primary"
                onClick={() => setTab("projects")}
              >
                Manage Projects
              </button>
            </div>
          </>
        ) : (
          <>
            <h1>
              Manage Projects<span>.</span>
            </h1>

            <p className="cms-muted">
              Add, edit and remove your projects.
            </p>
            {missingProjects.length > 0 && (
              <div className="cms-box">
                <h2>Original Projects</h2>

                <p className="cms-muted">
                  Import your original projects to edit or delete them.
                </p>

                <button
                  className="cms-primary"
                  onClick={importProjects}
                  disabled={loading}
                >
                  <Upload size={18} />
                  Import Original Projects
                </button>
              </div>
            )}

            <div className="cms-box">
              <h2>
                {editId ? "Edit Project" : "Add New Project"}
              </h2>

              <form className="cms-form" onSubmit={saveProject}>
                <label>Project Title</label>

                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Project title"
                />

                <label>Description</label>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows="4"
                  placeholder="Project description"
                />

                <label>Project Image</label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                />

                {image && !file && (
                  <img
                    src={image}
                    alt="Current project"
                    className="cms-preview"
                  />
                )}

                {file && (
                  <p className="cms-muted">
                    Selected image: {file.name}
                  </p>
                )}

                <label>Website Link</label>

                <input
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  required
                  placeholder="https://..."
                />

                <label>Technologies</label>

                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="React, CSS, JavaScript"
                />

                <div className="cms-actions">
                  <button
                    className="cms-primary"
                    disabled={loading}
                  >
                    {loading
                      ? "Saving..."
                      : editId
                      ? "Save Changes"
                      : "Add Project"}
                  </button>

                  {editId && (
                    <button
                      type="button"
                      className="cms-secondary"
                      onClick={clearForm}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              {message && <p className="cms-message">{message}</p>}
            </div>

            <div className="cms-box">
              <h2>All Projects ({totalProjects})</h2>

              <div className="cms-list">
                {[...missingProjects, ...projects].map((project) => (
                  <div className="cms-item" key={project.id}>
                    <img src={project.image} alt={project.title} />

                    <div className="cms-item-info">
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                    </div>

                    <div className="cms-item-buttons">
                      <button
                        onClick={() => editProject(project)}
                        disabled={
                          loading ||
                          missingProjects.some(
                            (item) => item.id === project.id
                          )
                        }
                      >
                        <Pencil size={16} />
                        Edit
                      </button>

                      <button
                        className="danger"
                        onClick={() => removeProject(project)}
                        disabled={
                          loading ||
                          missingProjects.some(
                            (item) => item.id === project.id
                          )
                        }
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {missingProjects.length > 0 && (
                <p className="cms-muted">
                  Import original projects to enable editing and deleting.
                </p>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}