import { GroupPage, groupMeta } from '@/components/site/group-page';

export const metadata = groupMeta('ilkokul');

export default function Page() {
  return <GroupPage groupKey="ilkokul" />;
}
