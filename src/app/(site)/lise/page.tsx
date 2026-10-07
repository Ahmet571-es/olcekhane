import { GroupPage, groupMeta } from '@/components/site/group-page';

export const metadata = groupMeta('lise');

export default function Page() {
  return <GroupPage groupKey="lise" />;
}
