const posts = [
  {
    title: "¿Qué hacer ante un despido injustificado?",
    excerpt:
      "Conoce los pasos legales que debes seguir para proteger tus derechos laborales y actuar de forma correcta.",
    category: "Derecho Laboral",
    date: "15 Feb 2026",
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c",
  },
  {
    title: "Importancia de los contratos en las empresas",
    excerpt:
      "Un contrato bien estructurado evita conflictos legales y protege los intereses de tu negocio.",
    category: "Derecho Corporativo",
    date: "08 Feb 2026",
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216",
  },
  {
    title: "¿Qué hacer si te llega una carta invitación del SAT?",
    excerpt:
      "Te explicamos si eres persona física o moral y si estás obligad@ al pago de contribuciones,",
    category: "Derecho Fiscal",
    date: "01 Feb 2026",
    image:
      "https://images.milenio.com/91vCgNe_QxPdcDClxYh5xLVTAqQ=/345x194/uploads/media/2023/03/21/sat-agencia-enfoque.jpg",
  },
];

const Blog = () => {
  return (
    <section id="blog" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="max-w-3xl mb-16">
          <span className="inline-flex items-center mb-4 px-4 py-2 rounded-full bg-primary/5 text-secondary text-xs tracking-widest uppercase">
            Blog
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Artículos y asesoría legal
          </h2>

          <p className="text-gray-600">
            Mantente informado con análisis legales, consejos prácticos y
            novedades del ámbito jurídico.
          </p>
        </div>

        {/* Posts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <article
              key={index}
              className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col"
            >
              {/* Image */}
              <div className="h-52 w-full overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col flex-1">
                {/* Meta */}
                <div className="flex items-center justify-between mb-3 text-xs uppercase tracking-wider">
                  <span className="text-secondary font-medium">
                    {post.category}
                  </span>
                  <span className="text-gray-400">{post.date}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-primary mb-3 leading-snug">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-1">
                  {post.excerpt}
                </p>

                {/* Read more */}
                <div className="mt-6 text-right">
                {/* <span className="inline-flex items-center gap-2 text-sm font-medium text-primary/70 group-hover:text-secondary transition">
                  Ver más
                  <span className="transform group-hover:translate-x-1 transition">
                    →
                  </span>
                </span> */}
              </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Blog;