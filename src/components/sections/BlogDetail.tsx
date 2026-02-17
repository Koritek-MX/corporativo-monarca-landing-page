import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getBlogByIdService } from "../../services/blog.service";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    loadBlog();
  }, [id]);

  const loadBlog = async () => {
    try {
      Swal.fire({
        title: "Cargando artículo...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const start = Date.now();

      const data = await getBlogByIdService(Number(id));
      setBlog(data);

      const elapsed = Date.now() - start;
      if (elapsed < 800) {
        await new Promise(resolve =>
          setTimeout(resolve, 800 - elapsed)
        );
      }

    } catch {
      Swal.fire("Error", "No se pudo cargar el blog", "error");
    } finally {
      Swal.close();
    }
  };

  if (!blog) return null;

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">

        {/* Botón regresar */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 text-gray-600 hover:text-primary transition"
        >
          ← Regresar
        </button>

        {/* Imagen */}
        <div className="rounded-2xl overflow-hidden mb-8 shadow">
          <img
            src={blog.imageUrl}
            alt={blog.title}
            className="w-full h-[350px] object-cover"
          />
        </div>

        {/* Meta */}
        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <span>{blog.area}</span>
          <span>
            {new Date(blog.createdAt).toLocaleDateString("es-MX")}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-primary mb-4">
          {blog.title}
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-gray-600 mb-8">
          {blog.subtitle}
        </p>

        {/* Content */}
        <div className="prose max-w-none text-gray-700 leading-relaxed">
          {blog.content}
        </div>

        {/* Autor */}
        <div className="mt-12 border-t pt-6 text-sm text-gray-500">
          Autor: {blog.user?.name || "Corporativo Monarca"}
        </div>

      </div>
    </section>
  );
};

export default BlogDetail;