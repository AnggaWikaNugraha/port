import { CertificateType } from '../../_types';
import { formatLongDate } from '@/lib/tgl';
import { ExternalLink } from 'lucide-react';

interface Props {
  certificates?: CertificateType[];
}

export default function CertificatesSection({ certificates }: Props) {
  if (!certificates?.length) return null;

  return (
    <section className="mb-8 mt-14 border-t border-white/[0.08] pt-10">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-600">Learning</p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">Certificates</h2>
      <ul className="mt-7 grid gap-3 sm:grid-cols-2">
        {certificates.map(cert => (
          <li key={cert.id} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 text-sm">
            <p className="font-semibold leading-6 text-gray-200">{cert.title}</p>
            <p className="mt-1 text-gray-500">{cert.issuer}</p>
            <p className="mt-3 text-xs leading-5 text-gray-600">
              Issued: {formatLongDate(cert.issueDate)}
              {cert.expirationDate && ` · Expires: ${formatLongDate(cert.expirationDate)}`}
            </p>
            {cert.credentialUrl && (
              <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 transition hover:text-white">
                View credential <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
