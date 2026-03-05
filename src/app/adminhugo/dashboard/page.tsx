"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProjects, addProject, deleteProject, updateProject } from "@/lib/firestore";
import { uploadImage } from "@/lib/storage";
import type { Project, ProjectPhase } from "@/types";



export default function AdminDashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading]   = useState(true);
  const [tab, setTab]           = useState<"list" | "add">("list");
  const [editId, setEditId]     = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !sessionStorage.getItem("bao_admin")) {
      router.replace("/adminhugo");
    }
  }, [router]);

  const load = async () => {
    setLoading(true);
    setProjects(await getProjects());
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce projet ?")) return;
    await deleteProject(id);
    load();
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      <div className="fixed inset-0 pointer-events-none z-0">
        <img src="/images/forest-bg.jpg" alt="" className="w-full h-full object-cover"
          style={{ filter: "brightness(0.1) saturate(0.3)", opacity: 0.4 }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-8 pt-32 pb-24">

        {/* Header */}
        <div className="flex items-end justify-between mb-16 gap-6 flex-wrap">
          <div>
            <p className="font-mono text-[10px] tracking-[0.5em] mb-4" style={{ color: C.brown }}>
              — ADMIN · BAO DIGITALDESIGN
            </p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
              fontSize: "clamp(2.5rem,5vw,4rem)", color: C.text, lineHeight: 1 }}>
              Dashboard
            </h1>
          </div>
          <button onClick={() => { sessionStorage.removeItem("bao_admin"); router.push("/adminhugo"); }}
            className="font-mono text-[10px] tracking-widest transition-colors duration-300"
            style={{ color: C.muted }}
            onMouseEnter={e => (e.currentTarget.style.color = C.coral)}
            onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>
            DÉCONNEXION →
          </button>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-3 gap-px mb-14" style={{ background: C.border }}>
          {[
            { val: projects.length, label: "Projets",  color: C.sage  },
            { val: projects.filter(p => p.featured).length, label: "En vedette", color: C.brown },
            { val: projects.reduce((a,p) => a + (p.phases?.length ?? 0), 0), label: "Phases total", color: C.blue },
          ].map((s, i) => (
            <div key={i} className="py-8 px-6 text-center" style={{ background: C.card }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
                fontSize: "2.8rem", color: s.color, lineHeight: 1 }}>{s.val}</p>
              <p className="font-mono text-[9px] tracking-widest mt-2" style={{ color: C.muted }}>{s.label.toUpperCase()}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mb-10" style={{ borderBottom: `1px solid ${C.border}` }}>
          {([["list", "Projets"], ["add", editId ? "Modifier" : "Ajouter"]] as const).map(([t, l]) => (
            <button key={t}
              onClick={() => { setTab(t); if (t === "list") setEditId(null); }}
              className="font-mono text-[10px] tracking-widest px-8 py-4 transition-all duration-300"
              style={{
                color: tab === t ? C.text : C.muted,
                borderBottom: tab === t ? `1px solid ${C.brown}` : "1px solid transparent",
                marginBottom: "-1px",
                background: "transparent",
              }}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Liste */}
        {tab === "list" && (
          <div>
            <div className="flex justify-end mb-6">
              <button onClick={() => setTab("add")}
                className="group inline-flex items-center gap-4 font-mono text-[10px] tracking-widest transition-all duration-400"
                style={{ color: C.text, border: `1px solid ${C.border}`, padding: "12px 20px", background: `${C.brown}15` }}>
                + NOUVEAU PROJET
              </button>
            </div>

            {loading && (
              <p className="font-mono text-[10px] tracking-widest py-20 text-center" style={{ color: C.muted }}>
                CHARGEMENT...
              </p>
            )}

            {!loading && projects.length === 0 && (
              <div className="py-32 text-center" style={{ border: `1px solid ${C.border}` }}>
                <p className="font-mono text-[10px] tracking-widest" style={{ color: C.muted }}>
                  AUCUN PROJET · CRÉEZ LE PREMIER
                </p>
              </div>
            )}

            <div className="space-y-px" style={{ background: C.border }}>
              {projects.map((p, i) => (
                <div key={p.id}
                  className="group flex items-center gap-6 px-6 py-5 transition-colors duration-300"
                  style={{ background: C.card }}
                  onMouseEnter={e => (e.currentTarget.style.background = C.cardHov)}
                  onMouseLeave={e => (e.currentTarget.style.background = C.card)}>

                  {/* Cover mini */}
                  <div className="w-14 h-14 shrink-0 overflow-hidden" style={{ background: C.bgLight }}>
                    {p.coverImage
                      ? <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover"/>
                      : <div className="w-full h-full flex items-center justify-center">
                          <span className="font-mono text-[8px]" style={{ color: C.muted }}>IMG</span>
                        </div>
                    }
                  </div>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <p style={{ color: C.text, fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.2rem", fontWeight: 300 }}>{p.title}</p>
                    <p className="font-mono text-[9px] tracking-wider mt-1" style={{ color: C.muted }}>
                      {p.category} · {p.year} · {p.phases?.length ?? 0} phases
                    </p>
                  </div>

                  {/* Featured badge */}
                  {p.featured && (
                    <span className="font-mono text-[8px] tracking-widest px-2 py-1"
                      style={{ color: C.brown, border: `1px solid ${C.brown}40` }}>
                      VEDETTE
                    </span>
                  )}

                  {/* Actions */}
                  <div className="flex gap-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button onClick={() => { setEditId(p.id); setTab("add"); }}
                      className="font-mono text-[9px] tracking-widest transition-colors duration-300"
                      style={{ color: C.sage }}
                      onMouseEnter={e => (e.currentTarget.style.color = C.text)}
                      onMouseLeave={e => (e.currentTarget.style.color = C.sage)}>
                      ÉDITER
                    </button>
                    <button onClick={() => handleDelete(p.id)}
                      className="font-mono text-[9px] tracking-widest transition-colors duration-300"
                      style={{ color: C.muted }}
                      onMouseEnter={e => (e.currentTarget.style.color = C.coral)}
                      onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>
                      SUPPR.
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Formulaire add/edit */}
        {tab === "add" && (
          <ProjectForm
            editProject={editId ? projects.find(p => p.id === editId) : undefined}
            onSaved={() => { load(); setTab("list"); setEditId(null); }}
            onCancel={() => { setTab("list"); setEditId(null); }}
          />
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// FORM
// ─────────────────────────────────────────────────────────────
function ProjectForm({
  editProject, onSaved, onCancel,
}: { editProject?: Project; onSaved: () => void; onCancel: () => void; }) {
  const [saving, setSaving]     = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [form, setForm]         = useState<Omit<Project, "id" | "createdAt">>({
    slug: editProject?.slug ?? "", title: editProject?.title ?? "",
    category: editProject?.category ?? "", year: editProject?.year ?? new Date().getFullYear().toString(),
    description: editProject?.description ?? "", coverImage: editProject?.coverImage ?? "",
    phases: editProject?.phases ?? [], tags: editProject?.tags ?? [], featured: editProject?.featured ?? false,
  });
  const [tagInput, setTagInput] = useState(editProject?.tags?.join(", ") ?? "");
  const [phases, setPhases]     = useState<(ProjectPhase & { file?: File })[]>(
    editProject?.phases?.map(p => ({ ...p })) ?? []
  );

  const upd = (k: keyof typeof form, v: any) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.title || !form.slug) return alert("Titre et slug requis.");
    setSaving(true);
    try {
      let coverUrl = form.coverImage;
      if (coverFile) {
        const r = await uploadImage(coverFile, `bao-portfolio/projects/${form.slug}`);
        coverUrl = r.url;
      }
      const savedPhases: ProjectPhase[] = await Promise.all(
        phases.map(async (ph, i) => {
          let imgUrl = ph.imageUrl;
          if (ph.file) {
            const r = await uploadImage(ph.file, `bao-portfolio/projects/${form.slug}`);
            imgUrl = r.url;
          }
          return { id: ph.id, title: ph.title, description: ph.description, imageUrl: imgUrl, order: i };
        })
      );
      const data = { ...form, coverImage: coverUrl, phases: savedPhases,
        tags: tagInput.split(",").map(t => t.trim()).filter(Boolean) };
      if (editProject?.id) await updateProject(editProject.id, data);
      else await addProject(data);
      onSaved();
    } catch (e) { console.error(e); alert("Erreur lors de la sauvegarde."); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
          fontSize: "1.8rem", color: C.text }}>
          {editProject ? "Modifier le projet" : "Nouveau projet"}
        </p>
        <button onClick={onCancel} className="font-mono text-[9px] tracking-widest"
          style={{ color: C.muted }}>← ANNULER</button>
      </div>

      <div className="space-y-0">
        {/* Champs principaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px mb-px" style={{ background: C.border }}>
          {[
            { k: "title",    l: "TITRE",    ph: "Nom du projet" },
            { k: "slug",     l: "SLUG",     ph: "nom-du-projet" },
            { k: "category", l: "CATÉGORIE",ph: "3D Modelling" },
            { k: "year",     l: "ANNÉE",    ph: "2024" },
          ].map(f => (
            <Field key={f.k} label={f.l} placeholder={f.ph}
              value={(form as any)[f.k]}
              onChange={v => upd(f.k as any, v)} />
          ))}
        </div>

        <Field label="DESCRIPTION" placeholder="Description du projet..."
          value={form.description} onChange={v => upd("description", v)} multiline />

        <Field label="TAGS (virgule)" placeholder="Blender, Rendering, Surface"
          value={tagInput} onChange={setTagInput} />

        {/* Cover */}
        <div className="py-6 px-0" style={{ borderBottom: `1px solid ${C.border}` }}>
          <label className="font-mono text-[9px] tracking-widest block mb-4" style={{ color: C.muted }}>
            IMAGE DE COUVERTURE
          </label>
          <div className="flex items-center gap-6">
            {(form.coverImage && !coverFile) && (
              <img src={form.coverImage} alt="cover" className="h-16 w-24 object-cover" />
            )}
            <label className="font-mono text-[9px] tracking-widest cursor-pointer transition-colors duration-300 px-4 py-3"
              style={{ color: C.sage, border: `1px solid ${C.border}` }}>
              CHOISIR UN FICHIER
              <input type="file" accept="image/*" className="hidden"
                onChange={e => setCoverFile(e.target.files?.[0] ?? null)} />
            </label>
            {coverFile && <span className="font-mono text-[9px]" style={{ color: C.muted }}>{coverFile.name}</span>}
          </div>
        </div>

        {/* Featured */}
        <div className="py-6 flex items-center gap-5" style={{ borderBottom: `1px solid ${C.border}` }}>
          <button onClick={() => upd("featured", !form.featured)}
            className="w-10 h-5 relative transition-colors duration-300"
            style={{ background: form.featured ? C.brown : C.card, border: `1px solid ${C.border}`, borderRadius: "10px" }}>
            <span className="absolute top-0.5 w-4 h-4 transition-all duration-300"
              style={{ background: C.text, borderRadius: "50%",
                left: form.featured ? "calc(100% - 18px)" : "2px" }} />
          </button>
          <span className="font-mono text-[9px] tracking-widest" style={{ color: C.muted }}>
            PROJET EN VEDETTE
          </span>
        </div>

        {/* Phases */}
        <div className="pt-10">
          <div className="flex items-center justify-between mb-8">
            <p className="font-mono text-[10px] tracking-widest" style={{ color: C.brown }}>
              — PHASES ({phases.length})
            </p>
            <button onClick={() => setPhases(p => [...p, { id: `ph_${Date.now()}`, title: "", description: "", imageUrl: "", order: p.length }])}
              className="font-mono text-[9px] tracking-widest px-4 py-2 transition-colors duration-300"
              style={{ color: C.sage, border: `1px solid ${C.border}` }}>
              + AJOUTER UNE PHASE
            </button>
          </div>

          <div className="space-y-px" style={{ background: C.border }}>
            {phases.map((ph, i) => (
              <div key={ph.id} className="p-6" style={{ background: C.card }}>
                <div className="flex items-center justify-between mb-5">
                  <span className="font-mono text-[9px] tracking-widest" style={{ color: C.muted }}>
                    PHASE {String(i + 1).padStart(2, "0")}
                  </span>
                  <button onClick={() => setPhases(p => p.filter((_, idx) => idx !== i))}
                    className="font-mono text-[8px] tracking-widest transition-colors duration-300"
                    style={{ color: C.muted }}
                    onMouseEnter={e => (e.currentTarget.style.color = C.coral)}
                    onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>
                    RETIRER
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: "8px" }}>
                    <label className="font-mono text-[8px] tracking-widest block mb-2" style={{ color: C.muted }}>TITRE</label>
                    <input type="text" value={ph.title}
                      onChange={e => setPhases(p => p.map((x, idx) => idx === i ? { ...x, title: e.target.value } : x))}
                      placeholder="Esquisse / Wireframe / Rendu..."
                      className="w-full bg-transparent outline-none"
                      style={{ color: C.text, fontWeight: 300, caretColor: C.sage, fontFamily: "Inter, sans-serif" }} />
                  </div>
                  <div style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: "8px" }}>
                    <label className="font-mono text-[8px] tracking-widest block mb-2" style={{ color: C.muted }}>IMAGE</label>
                    <label className="font-mono text-[8px] tracking-widest cursor-pointer" style={{ color: C.sage }}>
                      CHOISIR →
                      <input type="file" accept="image/*" className="hidden"
                        onChange={e => {
                          const f = e.target.files?.[0];
                          if (f) setPhases(p => p.map((x, idx) => idx === i ? { ...x, file: f } : x));
                        }} />
                    </label>
                    {ph.file && <span className="font-mono text-[8px] ml-2" style={{ color: C.muted }}>{ph.file.name}</span>}
                  </div>
                </div>
                <div style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: "8px" }}>
                  <label className="font-mono text-[8px] tracking-widest block mb-2" style={{ color: C.muted }}>DESCRIPTION</label>
                  <textarea value={ph.description}
                    onChange={e => setPhases(p => p.map((x, idx) => idx === i ? { ...x, description: e.target.value } : x))}
                    rows={2} placeholder="Décrivez cette phase..."
                    className="w-full bg-transparent outline-none resize-none"
                    style={{ color: C.text, fontWeight: 300, caretColor: C.sage, fontFamily: "Inter, sans-serif" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save */}
        <div className="pt-10 flex gap-5">
          <button onClick={save} disabled={saving}
            className="group inline-flex items-center gap-6 font-mono text-[10px] tracking-widest transition-all duration-500"
            style={{ color: C.text, border: `1px solid ${C.border}`, padding: "16px 36px",
              background: `${C.brown}20`, opacity: saving ? 0.5 : 1 }}>
            {saving ? "SAUVEGARDE..." : editProject ? "METTRE À JOUR" : "PUBLIER LE PROJET"}
            {!saving && <span className="h-px w-5 group-hover:w-12 transition-all duration-500" style={{ background: C.brown }} />}
          </button>
          <button onClick={onCancel} className="font-mono text-[10px] tracking-widest px-8 transition-colors duration-300"
            style={{ color: C.muted }}>
            ANNULER
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Champ réutilisable ───────────────────────────────────────
function Field({ label, value, onChange, placeholder, multiline }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; multiline?: boolean;
}) {
  return (
    <div className="py-6" style={{ borderBottom: `1px solid ${C.border}`, background: C.bg, padding: "24px 0" }}>
      <label className="font-mono text-[9px] tracking-widest block mb-3" style={{ color: C.muted }}>{label}</label>
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            rows={3} className="w-full bg-transparent outline-none resize-none"
            style={{ color: C.text, fontWeight: 300, caretColor: C.sage, fontFamily: "Inter, sans-serif" }} />
        : <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            className="w-full bg-transparent outline-none"
            style={{ color: C.text, fontWeight: 300, caretColor: C.sage, fontFamily: "Inter, sans-serif" }} />
      }
    </div>
  );
}

const C = {
  bg: "#1C2B28", bgLight: "#243330", card: "#2E4440", cardHov: "#344E49",
  border: "rgba(177,182,149,0.12)", borderHov: "rgba(177,182,149,0.25)",
  sage: "#B1B695", brown: "#7D451B", blue: "#7699D4", coral: "#F08080",
  text: "#EDE8DF", sub: "#8E9B7A", muted: "#5A6B52",
};