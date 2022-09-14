import { z } from 'zod';

import { IssueSchema } from '../schemas/IssueSchema';
import IssuesList from './common/IssuesList';

interface IssueRelationListProps {
  relationshipLabel: string;
  issues: z.infer<typeof IssueSchema>[];
}

const IssueRelationList = (props: IssueRelationListProps) => {
  const { relationshipLabel, issues } = props;
  return (
    <div>
      <span className="font-bold text-slate-800 text-lg">
        {relationshipLabel}
      </span>
      <div className="mt-4">
        <IssuesList issues={issues} />
      </div>
    </div>
  );
};

export default IssueRelationList;
