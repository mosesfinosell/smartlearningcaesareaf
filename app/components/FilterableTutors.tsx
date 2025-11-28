'use client';

import { useEffect, useMemo, useState } from 'react';
import FilterPanel, { FilterGroup, FilterSelection } from './FilterPanel';

type TutorCard = {
  name: string;
  title?: string;
  tags: string[];
  description: string;
  ctaLabel?: string;
  ctaLink?: string;
};

type ApiTutor = {
  userId?: { firstName?: string; lastName?: string; email?: string };
  subjects?: Array<{ name?: string; level?: string }>;
  expertise?: string[];
  qualifications?: string[];
  languages?: string[];
  bio?: string;
};

function buildTags(t: ApiTutor): string[] {
  const tags: string[] = [];
  t.subjects?.forEach((s) => {
    if (s?.name) tags.push(String(s.name));
    if (s?.level) tags.push(String(s.level));
  });
  t.expertise?.forEach((e) => tags.push(String(e)));
  t.qualifications?.forEach((q) => tags.push(String(q)));
  t.languages?.forEach((l) => tags.push(String(l)));
  return tags.filter(Boolean);
}

export default function FilterableTutors({
  heading,
  description,
  filters,
  tutors: seedTutors = [],
  fetchFromApi = true,
}: {
  heading: string;
  description?: string;
  filters: FilterGroup[];
  tutors?: TutorCard[];
  fetchFromApi?: boolean;
}) {
  const [selection, setSelection] = useState<FilterSelection>({});
  const [apiTutors, setApiTutors] = useState<TutorCard[]>([]);

  useEffect(() => {
    if (!fetchFromApi) return;
    const controller = new AbortController();
    const apiBase = process.env.NEXT_PUBLIC_API_URL;
    if (!apiBase) return;
    fetch(`${apiBase}/tutors`, { signal: controller.signal })
      .then((res) => res.json())
      .then((payload) => {
        const list = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
        const mapped: TutorCard[] = list.map((t: ApiTutor) => {
          const name = [t.userId?.firstName, t.userId?.lastName].filter(Boolean).join(' ').trim() || 'Tutor';
          const desc = t.bio || 'Expert tutor available for personalized sessions.';
          return {
            name,
            title: t.userId?.email,
            description: desc,
            tags: buildTags(t),
          };
        });
        setApiTutors(mapped);
      })
      .catch(() => {
        setApiTutors([]);
      });
    return () => controller.abort();
  }, [fetchFromApi]);

  const combinedTutors = useMemo(() => {
    const source = apiTutors.length ? apiTutors : seedTutors;
    return source;
  }, [apiTutors, seedTutors]);

  const filteredTutors = useMemo(() => {
    return combinedTutors.filter((tutor) =>
      Object.entries(selection).every(([_, values]) => {
        if (!values || values.length === 0) return true;
        return values.some((v) => tutor.tags.map((tag) => tag.toLowerCase()).includes(v.toLowerCase()));
      })
    );
  }, [selection, combinedTutors]);

  return (
    <div className="space-y-6">
      <FilterPanel title={heading} description={description} groups={filters} onChange={setSelection} />
      <div className="grid md:grid-cols-3 gap-6">
        {filteredTutors.length === 0 ? (
          <p className="text-gray-600 col-span-full">No tutors or courses match this selection yet.</p>
        ) : (
          filteredTutors.map((tutor) => (
            <div key={tutor.name + tutor.title} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 space-y-3">
              <h3 className="text-xl font-semibold text-maroon">{tutor.name}</h3>
              {tutor.title && <p className="text-sm text-gray-600">{tutor.title}</p>}
              <p className="text-gray-700 text-sm">{tutor.description}</p>
              <div className="flex flex-wrap gap-2">
                {tutor.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              {tutor.ctaLink && (
                <a
                  href={tutor.ctaLink}
                  className="inline-flex items-center gap-2 text-maroon font-semibold hover:text-black text-sm"
                >
                  {tutor.ctaLabel || 'View details'}
                  <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
