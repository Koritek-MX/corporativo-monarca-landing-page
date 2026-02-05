import { useState } from "react";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi";

/* 📰 Mock posts */
const MOCK_POSTS = [
  {
    id: 1,
    title: "¿Qué hacer ante un despido injustificado?",
    category: "Derecho Laboral",
    date: "2026-02-01",
    status: "publicado",
  },
  {
    id: 2,
    title: "Divorcio en México: guía rápida",
    category: "Derecho Familiar",
    date: "2026-01-15",
    status: "borrador",
  },
];

const BlogAdmin = () => {
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "",
    content: "",
    image: null as File | null,
    status: "borrador",
  });

  const handleCreatePost = () => {
    if (!form.title || !form.content) return;

    setPosts([
      ...posts,
      {
        id: Date.now(),
        title: form.title,
        category: form.category,
        date: new Date().toISOString().split("T")[0],
        status: form.status,
      },
    ]);

    setForm({
      title: "",
      category: "",
      content: "",
      image: null,
      status: "borrador",
    });

    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">
            Blog
          </h1>
          <p className="text-gray-600">
            Administración de contenido del blog
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-semibold hover:bg-primary/90 transition"
        >
          <HiOutlinePlus />
          Nuevo artículo
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-primary text-white uppercase text-xs">
            <tr>
              <th className="px-6 py-4 text-left">Título</th>
              <th className="px-6 py-4 text-left">Categoría</th>
              <th className="px-6 py-4 text-left">Fecha</th>
              <th className="px-6 py-4 text-left">Estado</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {posts.map((post, index) => (
             <tr
                key={post.id}
                className={`
                border-t transition
                ${index % 2 === 0 ? "bg-white" : "bg-gray-200"}
                hover:bg-primary/5
              `}
              >
                <td className="px-6 py-4 font-semibold text-primary">
                  {post.title}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {post.category}
                </td>

                <td className="px-6 py-4">
                  {post.date}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`
                      px-3 py-1 rounded-full text-xs font-semibold capitalize
                      ${
                        post.status === "publicado"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }
                    `}
                  >
                    {post.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <button className="text-primary hover:text-secondary">
                      <HiOutlinePencil size={22} />
                    </button>

                    <button className="text-red-500 hover:text-red-600">
                      <HiOutlineTrash size={22} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL CREAR POST */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl">

            {/* Header */}
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-bold text-primary">
                Nuevo artículo
              </h2>
            </div>

            {/* Body */}
            <div className="px-6 py-6 space-y-4">

              <div>
                <label className="block text-sm font-medium mb-1">
                  Título
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Categoría
                </label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Contenido
                </label>
                <textarea
                  rows={6}
                  value={form.content}
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Imagen portada
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      image: e.target.files?.[0] || null,
                    })
                  }
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Estado
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary"
                >
                  <option value="borrador">Borrador</option>
                  <option value="publicado">Publicado</option>
                </select>
              </div>

            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600"
              >
                Cancelar
              </button>

              <button
                onClick={handleCreatePost}
                className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90"
              >
                Publicar
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default BlogAdmin;