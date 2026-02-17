// import { useEffect, useState } from "react";
// import {
//   HiOutlinePlus,
//   HiOutlinePencil,
//   HiOutlineTrash,
// } from "react-icons/hi";
// import Swal from "sweetalert2";

// import {
//   getAllBlogsService,
//   createBlogService,
//   updateBlogService,
//   deleteBlogService,
// } from "../../services/blog.service";

// const BlogAdmin = () => {
//   const [posts, setPosts] = useState<any[]>([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingPost, setEditingPost] = useState<any>(null);

//   const [form, setForm] = useState({
//     title: "",
//     category: "",
//     content: "",
//     image: null as File | null,
//     status: "borrador",
//   });

//   /* 👉 Cargar blogs */
//   useEffect(() => {
//     loadBlogs();
//   }, []);

//   const loadBlogs = async () => {
//     try {
//       Swal.fire({
//         title: "Cargando blogs...",
//         allowOutsideClick: false,
//         didOpen: () => Swal.showLoading(),
//       });
//       const [data] = await Promise.all([
//         getAllBlogsService(),
//         new Promise((resolve) => setTimeout(resolve, 700)),
//       ]);
//       console.log("BLOGS: ", data);
//       setPosts(data);
//     } catch (error) {
//       Swal.fire("Error", "No se pudieron cargar los blogs", "error");
//     } finally {
//       Swal.close();
//     }
//   };


//   /* 👉 Crear / Editar */
//   const handleSavePost = async () => {
//     if (!form.title || !form.content) {
//       return Swal.fire("Error", "Completa los campos", "warning");
//     }

//     try {
//       const payload = {
//         title: form.title,
//         subtitle: form.content.substring(0, 140),
//         area: form.category,
//         content: form.content,
//         status: form.status,
//         imageUrl: form.image?.name || "",
//         userId: 1, // luego usuario logueado
//       };

//       if (editingPost) {
//         await updateBlogService(editingPost.id, payload);

//         await Swal.fire({
//           icon: "success",
//           title: "Blog actualizado",
//           timer: 1400,
//           showConfirmButton: false,
//         });
//       } else {
//         await createBlogService(payload);

//         await Swal.fire({
//           icon: "success",
//           title: "Blog creado",
//           timer: 1400,
//           showConfirmButton: false,
//         });
//       }

//       setIsModalOpen(false);
//       setEditingPost(null);

//       setForm({
//         title: "",
//         category: "",
//         content: "",
//         image: null,
//         status: "borrador",
//       });

//       loadBlogs();

//     } catch {
//       Swal.fire("Error", "No se pudo guardar", "error");
//     }
//   };

//   /* 👉 Eliminar */
//   const handleDelete = (id: number) => {
//     Swal.fire({
//       title: "¿Eliminar artículo?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Eliminar",
//       confirmButtonColor: "#dc2626",
//     }).then(async (res) => {
//       if (res.isConfirmed) {
//         await deleteBlogService(id);

//         setPosts(prev => prev.filter(p => p.id !== id));

//         Swal.fire({
//           icon: "success",
//           title: "Blog eliminado",
//           timer: 1200,
//           showConfirmButton: false,
//         });
//       }
//     });
//   };

//   /* 👉 Editar */
//   const openEditPost = (post: any) => {
//     setEditingPost(post);

//     setForm({
//       title: post.title,
//       category: post.area,
//       content: post.content,
//       image: null,
//       status: post.status,
//     });

//     setIsModalOpen(true);
//   };

//   return (
//     <div className="flex flex-col gap-6">

//       {/* HEADER */}
//       <div className="flex items-start justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-primary">
//             Blog
//           </h1>
//           <p className="text-gray-600">
//             Administración de contenido del blog
//           </p>
//         </div>

//         <button
//           onClick={() => {
//             setEditingPost(null);
//             setForm({
//               title: "",
//               category: "",
//               content: "",
//               image: null,
//               status: "borrador",
//             });
//             setIsModalOpen(true);
//           }}
//           className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-semibold hover:bg-primary/90 transition"
//         >
//           <HiOutlinePlus />
//           Nuevo blog
//         </button>
//       </div>

//       {/* TABLA */}
//       <div className="bg-white rounded-2xl shadow-sm border overflow-x-auto">
//         <table className="w-full text-sm">
//           <thead className="bg-primary text-white uppercase text-xs">
//             <tr>
//               <th className="px-6 py-4 text-left">Título</th>
//               <th className="px-6 py-4 text-left">Categoría</th>
//               <th className="px-6 py-4 text-left">Fecha</th>
//               <th className="px-6 py-4 text-left">Autor</th>
//               <th className="px-6 py-4 text-right">Acciones</th>
//             </tr>
//           </thead>

//           <tbody>
//             {posts.map((post, index) => (
//               <tr
//                 key={post.id}
//                 className={`
//                   border-t transition
//                   ${index % 2 === 0 ? "bg-white" : "bg-gray-200"}
//                   hover:bg-primary/5
//                 `}
//               >
//                 <td className="px-6 py-4 font-semibold text-primary">
//                   {post.title}
//                 </td>

//                 <td className="px-6 py-4 text-gray-600">
//                   {post.area}
//                 </td>

//                 <td className="px-6 py-4">
//                   {new Date(post.createdAt).toLocaleDateString("es-MX")}
//                 </td>

//                 <td className="px-6 py-4 text-gray-600">
//                   {post.user.name}
//                 </td>

//                 <td className="px-6 py-4 text-right">
//                   <div className="flex justify-end gap-3">
//                     <button
//                       className="text-primary hover:text-secondary"
//                       onClick={() => openEditPost(post)}
//                     >
//                       <HiOutlinePencil size={22} />
//                     </button>

//                     <button
//                       className="text-red-500 hover:text-red-600"
//                       onClick={() => handleDelete(post.id)}
//                     >
//                       <HiOutlineTrash size={22} />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* MODAL */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
//           <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl">

//             <div className="px-6 py-4 border-b">
//               <h2 className="text-lg font-bold text-primary">
//                 {editingPost ? "Editar blog" : "Nuevo blog"}
//               </h2>
//             </div>

//             <div className="px-6 py-6 space-y-4">

//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Título
//                 </label>
//                 <input
//                   value={form.title}
//                   onChange={(e) =>
//                     setForm({ ...form, title: e.target.value })
//                   }
//                   className="w-full border rounded-lg px-4 py-3"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Categoría
//                 </label>
//                 <input
//                   value={form.category}
//                   onChange={(e) =>
//                     setForm({ ...form, category: e.target.value })
//                   }
//                   className="w-full border rounded-lg px-4 py-3"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Contenido
//                 </label>
//                 <textarea
//                   rows={6}
//                   value={form.content}
//                   onChange={(e) =>
//                     setForm({ ...form, content: e.target.value })
//                   }
//                   className="w-full border rounded-lg px-4 py-3"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Imagen portada URL
//                 </label>
//                 <input
//                   onChange={(e) =>
//                     setForm({
//                       ...form,
//                       image: e.target.files?.[0] || null,
//                     })
//                   }
//                   className="w-full border rounded-lg px-4 py-3"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Estado
//                 </label>
//                 <select
//                   value={form.status}
//                   onChange={(e) =>
//                     setForm({ ...form, status: e.target.value })
//                   }
//                   className="w-full border rounded-lg px-4 py-3"
//                 >
//                   <option value="borrador">Borrador</option>
//                   <option value="publicado">Publicado</option>
//                 </select>
//               </div>

//             </div>

//             <div className="flex justify-end gap-3 px-6 py-4 border-t">
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="px-4 py-2 text-gray-600"
//               >
//                 Cancelar
//               </button>

//               <button
//                 onClick={handleSavePost}
//                 className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90"
//               >
//                 {editingPost ? "Actualizar" : "Publicar"}
//               </button>
//             </div>

//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BlogAdmin;

import { useEffect, useState } from "react";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi";
import Swal from "sweetalert2";

import {
  getAllBlogsService,
  createBlogService,
  updateBlogService,
  deleteBlogService,
} from "../../services/blog.service";

const BlogAdmin = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    area: "",
    content: "",
    imageUrl: "",
  });

  /* 👉 Cargar blogs */
  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      Swal.fire({
        title: "Cargando blogs...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const [data] = await Promise.all([
        getAllBlogsService(),
        new Promise((resolve) => setTimeout(resolve, 700)),
      ]);

      setPosts(data);

    } catch {
      Swal.fire("Error", "No se pudieron cargar los blogs", "error");
    } finally {
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
        userId: 1, // luego auth real
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
      <div className="bg-white rounded-2xl shadow-sm border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-primary text-white uppercase text-xs">
            <tr>
              <th className="px-6 py-4 text-left">Título</th>
              <th className="px-6 py-4 text-left">Área</th>
              <th className="px-6 py-4 text-left">Fecha</th>
              <th className="px-6 py-4 text-left">Autor</th>
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
                  {post.area}
                </td>

                <td className="px-6 py-4">
                  {new Date(post.createdAt).toLocaleDateString("es-MX")}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {post.user?.name || "—"}
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
              <input
                value={form.area}
                onChange={(e) =>
                  setForm({ ...form, area: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-3"
              />
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