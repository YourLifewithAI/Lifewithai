import { redirect } from 'next/navigation';

// Preserve the engineering-domain entry link after the visual city launch.
export default function DomainsPage() {
  redirect('/arcology/research');
}
