import { GroupPage, groupMeta } from '@/components/site/group-page';

export const metadata = groupMeta('ortaokul');

export default function Page() {
  return <GroupPage groupKey="ortaokul" />;
}
