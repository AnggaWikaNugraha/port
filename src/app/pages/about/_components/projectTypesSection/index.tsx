import Image from "next/image";
import Link from "next/link";
import { Layers } from "lucide-react";

import { ProjectCategoryGroupType } from "@/app/pages/projects/types";
import { displayProjectTitle } from "@/app/pages/projects/components/projectPresentation";

interface Props {
  categories?: ProjectCategoryGroupType[];
}

/**
 * Peta jenis project yang pernah dibuat: kategori sebagai heading, isinya
 * card kecil yang bisa digeser ke samping supaya tinggi section tetap
 * pendek berapa pun jumlah project-nya.
 *
 * Project tanpa kategori memang tidak muncul di sini — penyaringannya
 * sudah dilakukan di query (getPublicProjectCategories).
 */
export default function ProjectTypesSection({ categories }: Props) {
  const groups = (categories ?? []).filter(group => group.projects?.length);

  if (groups.length === 0) return null;

  return (
    <section className="mt-14 border-t border-white/[0.08] pt-10">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-600">Portfolio</p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">Project types</h2>

      <div className="mt-7 space-y-7">
        {groups.map(group => (
          <div key={group.id}>
            <div className="flex items-center gap-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">{group.name}</h3>
              <span className="h-px flex-1 bg-white/[0.06]" />
              <span className="text-[10px] tabular-nums text-gray-600">{group.projects.length}</span>
            </div>

            {/* digeser ke samping; di layar kecil card sengaja menyentuh tepi */}
            <div className="-mx-4 mt-3 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
              {group.projects.map(project => {
                const title = displayProjectTitle(project.title);

                return (
                  <Link
                    key={project.id}
                    href={`/pages/projects/${project.id}`}
                    className="group w-40 shrink-0 snap-start rounded-2xl border border-white/[0.08] bg-white/[0.02] p-2 transition-colors hover:border-white/20 hover:bg-white/[0.05] sm:w-44"
                  >
                    <div className="relative aspect-video overflow-hidden rounded-xl bg-white/[0.04]">
                      {project.coverImage ? (
                        <Image
                          src={project.coverImage}
                          alt={`${title} preview`}
                          fill
                          sizes="176px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-gray-600">
                          <Layers size={20} strokeWidth={1.2} />
                        </div>
                      )}
                    </div>

                    <p className="mt-2 truncate px-1 text-xs font-medium text-gray-200">{title}</p>

                    {project.stack.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1 px-1 pb-1">
                        {project.stack.map(stack => (
                          <span
                            key={stack}
                            className="rounded-full border border-white/[0.10] px-2 py-0.5 text-[10px] font-medium text-gray-400"
                          >
                            {stack}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
