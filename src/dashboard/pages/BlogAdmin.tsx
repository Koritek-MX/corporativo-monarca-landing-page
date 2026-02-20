import { useEffect, useState } from "react";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi";
import Swal from "sweetalert2";

import {
  getAllBlogsByUserIdService,
  createBlogService,
  updateBlogService,
  deleteBlogService,
} from "../../services/blog.service";
import { useAuth } from "../../components/hooks/AuthContext";

const LEGAL_AREAS = [
  "Derecho Penal",
  "Derecho Laboral",
  "Derecho Familiar",
  "Derecho Corporativo",
  "Derecho Civil",
  "Derecho Mercantil",
  "Derecho Fiscal",
  "Derecho Administrativo",
  "Derecho Inmobiliario",
  "Derecho Migratorio",
];

const BlogAdmin = () => {

  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [loadingBlogs, setLoadingBlogs] = useState(false);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    area: "",
    content: "",
    imageUrl: "",
  });

  /* 👉 Cargar blogs */
  useEffect(() => {
    if (!user?.id) return;
    loadBlogs();
  }, [user]);

  const loadBlogs = async () => {
    try {
      setLoadingBlogs(true);
      Swal.fire({
        title: "Cargando blogs...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const [data] = await Promise.all([
        getAllBlogsByUserIdService(user.id),
        new Promise((resolve) => setTimeout(resolve, 700)),
      ]);

      setPosts(data);

    } catch {
      Swal.fire("Error", "No se pudieron cargar los blogs", "error");
    } finally {
      setLoadingBlogs(false);
      Swal.close();
    }
  };

  /* 👉 Crear / Editar */
  const handleSavePost = async () => {
    if (!form.title || !form.content || !form.area) {
      return Swal.fire("Error", "Completa los campos", "warning");
    }

    try {
      const payload = {
        title: form.title,
        subtitle: form.subtitle,
        area: form.area,
        content: form.content,
        imageUrl: form.imageUrl,
        userId: user.id
      };

      if (editingPost) {
        await updateBlogService(editingPost.id, payload);

        await Swal.fire({
          icon: "success",
          title: "Blog actualizado",
          timer: 1400,
          showConfirmButton: false,
        });
      } else {
        await createBlogService(payload);

        await Swal.fire({
          icon: "success",
          title: "Blog creado",
          timer: 1400,
          showConfirmButton: false,
        });
      }

      setIsModalOpen(false);
      setEditingPost(null);

      setForm({
        title: "",
        subtitle: "",
        area: "",
        content: "",
        imageUrl: "",
      });

      loadBlogs();

    } catch {
      Swal.fire("Error", "No se pudo guardar", "error");
    }
  };

  /* 👉 Eliminar */
  const handleDelete = (id: number) => {
    Swal.fire({
      title: "¿Eliminar artículo?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      confirmButtonColor: "#dc2626",
    }).then(async (res) => {
      if (res.isConfirmed) {
        await deleteBlogService(id);

        setPosts(prev => prev.filter(p => p.id !== id));

        Swal.fire({
          icon: "success",
          title: "Blog eliminado",
          timer: 1200,
          showConfirmButton: false,
        });
      }
    });
  };

  /* 👉 Editar */
  const openEditPost = (post: any) => {
    setEditingPost(post);

    setForm({
      title: post.title,
      subtitle: post.subtitle,
      area: post.area,
      content: post.content,
      imageUrl: post.imageUrl,
    });

    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">

      {/* HEADER */}
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
          onClick={() => {
            setEditingPost(null);
            setForm({
              title: "",
              subtitle: "",
              area: "",
              content: "",
              imageUrl: "",
            });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-semibold hover:bg-primary/90 transition"
        >
          <HiOutlinePlus />
          Nuevo blog
        </button>
      </div>

      {/* TABLA */}
      {loadingBlogs ? (
        <div className="py-10 text-center text-gray-500">
          Cargando blogs...
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <div className="text-5xl mb-3">📰</div>
          <p className="font-semibold text-lg">
            No hay blogs registrados
          </p>
          <p className="text-sm">
            Cuando agregues uno aparecerá aquí.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-primary text-white uppercase text-xs">
              <tr>

                <th className="px-6 py-4 text-left">Imagen</th>
                <th className="px-6 py-4 text-left">Título</th>
                <th className="px-6 py-4 text-left">Área</th>
                <th className="px-6 py-4 text-left">Fecha</th>
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
                  <td className="px-6 py-4">
                    {post.imageUrl ? (
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-14 h-14 object-cover rounded-lg border"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500">
                        Sin imagen
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-semibold text-primary">
                    {post.title}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {post.area}
                  </td>

                  <td className="px-6 py-4">
                    {new Date(post.createdAt).toLocaleDateString("es-MX")}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        className="text-primary hover:text-secondary"
                        onClick={() => openEditPost(post)}
                      >
                        <HiOutlinePencil size={22} />
                      </button>

                      <button
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDelete(post.id)}
                      >
                        <HiOutlineTrash size={22} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl">

            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-bold text-primary">
                {editingPost ? "Editar blog" : "Nuevo blog"}
              </h2>
            </div>

            <div className="px-6 py-6 space-y-4">
              <label className="block text-sm font-medium mb-1">
                Título
              </label>
              <input
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-3"
              />
              <label className="block text-sm font-medium mb-1">
                Subtítulo
              </label>
              <input
                value={form.subtitle}
                onChange={(e) =>
                  setForm({ ...form, subtitle: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-3"
              />
              <label className="block text-sm font-medium mb-1">
                Área legal
              </label>

              <select
                value={form.area}
                onChange={(e) =>
                  setForm({ ...form, area: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary"
              >
                <option value="">Selecciona un área legal</option>

                {LEGAL_AREAS.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
              <label className="block text-sm font-medium mb-1">
                URL iamgen
              </label>
              <input
                value={form.imageUrl}
                onChange={(e) =>
                  setForm({ ...form, imageUrl: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-3"
              />
              <label className="block text-sm font-medium mb-1">
                Contenido del blog
              </label>
              <textarea
                rows={8}
                value={form.content}
                onChange={(e) =>
                  setForm({ ...form, content: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600"
              >
                Cancelar
              </button>

              <button
                onClick={handleSavePost}
                className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90"
              >
                {editingPost ? "Actualizar" : "Publicar"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default BlogAdmin;