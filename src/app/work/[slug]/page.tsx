import { getProjectBySlug, getProjects } from "@/lib/firestore";
import { notFound } from "next/navigation";
import ProjectGallery from "@/components/work/ProjectGallery";
import Link from "next/link";

export const revalidate = 60;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map(p => ({ slug: p.slug }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  return (
    <div className="min-h-screen bg-forest-950 pt-32 pb-24">
      <div className="fixed inset-0 z-0 opacity-20"
        style={{
          backgroundImage: "url('/images/forest-bg.jpg')",
          backgroundSize: "cover",
          filter: "blur(4px)",
        }}
      />
      <div className="fixed inset-0 z-0 bg-forest-950/80" />

      <div className="relative z-10 max-w-6xl mx-auto px-8">
        {/* Back link */}
        <Link
          href="/work"
          className="nav-link text-forest-500 hover:text-cream transition-colors flex items-center gap-3 mb-16 group"
        >
          <span className="w-8 h-px bg-forest-600 group-hover:w-4 transition-all" />
          BACK TO WORK
        </Link>

        {/* Project header */}
        <div className="mb-16">
          <p className="nav-link text-forest-500 mb-4">
            {project.category} · {project.year}
          </p>
          <h1 className="text-display text-cream mb-6">{project.title}</h1>
          <div className="line-nature w-32 mb-8" />
          <p className="text-cream/70 font-light max-w-2xl leading-relaxed text-lg">
            {project.description}
          </p>
          <div className="flex gap-2 mt-6 flex-wrap">
            {project.tags?.map(t => (
              <span key={t} className="nav-link text-forest-400 text-xs border border-forest-700 px-3 py-1">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Phases gallery */}
        <ProjectGallery phases={project.phases} />
      </div>
    </div>
  );
}