import { useCallback } from 'react';
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  Edge,
  MiniMap,
  Node,
  NodeChange,
  useEdgesState,
  useNodesState,
} from 'react-flow-renderer';
import { z } from 'zod';

import { IssuesListSchema } from '../../schemas/IssueSchema';
import IssueNode, { IssueNodeData } from './IssueNode';
import MapPersistenceManager from './MapPersistenceManager';

const nodeTypes = {
  issue: IssueNode,
};

const initialEdges: Edge[] = [];

interface IssueMapProp {
  initialNodes: Node[];
}

const IssuesMap = (props: IssueMapProp) => {
  const { initialNodes } = props;

  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => {
        const parsedChanges = changes.reduce((res, change) => {
          const validChange =
            change.type !== 'remove' ||
            (change.type === 'remove' &&
              nodes.find((n) => n.id === change.id)?.data.deletable); // Could support deletable nodes in the future
          if (validChange) {
            res.push(change);
          }

          return res;
        }, [] as NodeChange[]);

        return applyNodeChanges(parsedChanges, nds);
      }),
    [setNodes, nodes]
  );

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge({ ...connection }, eds)),
    [setEdges]
  );

  const onEdgesDelete = useCallback(
    (nodeId) =>
      setEdges((updatedEdges) =>
        applyEdgeChanges(
          [
            { id: nodeId, type: 'remove' },
            { id: nodeId, type: 'select', selected: false },
          ],
          updatedEdges
        )
      ),
    [setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onEdgesDelete={onEdgesDelete}
      nodeTypes={nodeTypes}
      fitView
    >
      <Background />
      <MiniMap />
      <Controls />
      <MapPersistenceManager />
    </ReactFlow>
  );
};

interface ProjectMapProps {
  issues: z.infer<typeof IssuesListSchema>;
}

const ProjectMap = (props: ProjectMapProps) => {
  const { issues } = props;
  const initialNodes: Node<IssueNodeData>[] = issues.map((issue, index) => {
    return {
      id: issue.id,
      data: issue,
      position: { x: index * 400, y: 100 },
      type: 'issue',
    };
  });

  return <IssuesMap initialNodes={initialNodes} />;
};

export default ProjectMap;
