import { CertificateType } from '../../_types';

interface Props {
  certificates?: CertificateType[];
}

export default function CertificatesSection({ certificates }: Props) {
  if (!certificates?.length) return null;

  return (
    <div className='mt-4'>
      <h2 className="font-semibold text-lg">Certificates</h2>
      <ul className="space-y-3">
        {certificates.map(cert => (
          <li key={cert.id} className="text-sm">
            <p className="text-gray-200 font-medium">{cert.title} — <span className="text-gray-400">{cert.issuer}</span></p>
            <p className="text-gray-400">Issued: {cert.issueDate}</p>
            {cert.credentialUrl && (
              <a href={cert.credentialUrl} target="_blank" className="text-blue-400 hover:underline">View Credential</a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}