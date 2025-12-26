'use client';

import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Handle,
  Position,
  NodeProps,
} from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';
import { Database } from 'lucide-react';

// Custom Node Component
const TableNode = ({ data }: NodeProps) => {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-xl min-w-[150px] overflow-hidden">
      <div className="bg-slate-800 p-2 border-b border-slate-700 flex items-center gap-2">
        <Database size={14} className="text-indigo-400" />
        <span className="font-bold text-xs text-slate-200 uppercase tracking-wider">{data.label}</span>
      </div>
      <div className="p-2 space-y-1">
        {data.columns.slice(0, 5).map((col: string) => (
          <div key={col} className="text-[10px] text-slate-400 font-mono">
            {col}
          </div>
        ))}
        {data.columns.length > 5 && (
          <div className="text-[10px] text-slate-500 italic">
            + {data.columns.length - 5} more...
          </div>
        )}
      </div>
      <Handle type="target" position={Position.Top} className="!bg-slate-500" />
      <Handle type="source" position={Position.Bottom} className="!bg-indigo-500" />
    </div>
  );
};

const nodeTypes = {
  table: TableNode,
};

// Layout Logic
const getLayoutedElements = (nodes: any[], edges: any[], direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 180;
  const nodeHeight = 150;

  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = direction === 'TB' ? 'top' : 'left';
    node.sourcePosition = direction === 'TB' ? 'bottom' : 'right';
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };
    return node;
  });

  return { nodes, edges };
};

// Initial Data (Pagila)
const initialNodesRaw = [
  { id: 'actor', label: 'actor', columns: ['actor_id', 'first_name', 'last_name', 'last_update'] },
  { id: 'address', label: 'address', columns: ['address_id', 'address', 'district', 'city_id', 'postal_code'] },
  { id: 'category', label: 'category', columns: ['category_id', 'name', 'last_update'] },
  { id: 'city', label: 'city', columns: ['city_id', 'city', 'country_id', 'last_update'] },
  { id: 'country', label: 'country', columns: ['country_id', 'country', 'last_update'] },
  { id: 'customer', label: 'customer', columns: ['customer_id', 'store_id', 'first_name', 'last_name', 'email', 'address_id'] },
  { id: 'film', label: 'film', columns: ['film_id', 'title', 'description', 'release_year', 'language_id', 'rental_rate'] },
  { id: 'film_actor', label: 'film_actor', columns: ['actor_id', 'film_id', 'last_update'] },
  { id: 'film_category', label: 'film_category', columns: ['film_id', 'category_id', 'last_update'] },
  { id: 'inventory', label: 'inventory', columns: ['inventory_id', 'film_id', 'store_id', 'last_update'] },
  { id: 'language', label: 'language', columns: ['language_id', 'name', 'last_update'] },
  { id: 'payment', label: 'payment', columns: ['payment_id', 'customer_id', 'staff_id', 'rental_id', 'amount'] },
  { id: 'rental', label: 'rental', columns: ['rental_id', 'rental_date', 'inventory_id', 'customer_id', 'return_date'] },
  { id: 'staff', label: 'staff', columns: ['staff_id', 'first_name', 'last_name', 'address_id', 'store_id'] },
  { id: 'store', label: 'store', columns: ['store_id', 'manager_staff_id', 'address_id', 'last_update'] },
];

const nodesWithData = initialNodesRaw.map(n => ({
  id: n.id,
  type: 'table',
  data: { label: n.label, columns: n.columns },
  position: { x: 0, y: 0 }
}));

const initialEdgesRaw = [
  { id: 'e1', source: 'country', target: 'city' },
  { id: 'e2', source: 'city', target: 'address' },
  { id: 'e3', source: 'address', target: 'customer' },
  { id: 'e4', source: 'address', target: 'staff' },
  { id: 'e5', source: 'address', target: 'store' },
  { id: 'e6', source: 'store', target: 'customer' },
  { id: 'e7', source: 'store', target: 'staff' },
  { id: 'e8', source: 'store', target: 'inventory' },
  { id: 'e9', source: 'language', target: 'film' },
  { id: 'e10', source: 'film', target: 'film_actor' },
  { id: 'e11', source: 'actor', target: 'film_actor' },
  { id: 'e12', source: 'film', target: 'film_category' },
  { id: 'e13', source: 'category', target: 'film_category' },
  { id: 'e14', source: 'film', target: 'inventory' },
  { id: 'e15', source: 'inventory', target: 'rental' },
  { id: 'e16', source: 'customer', target: 'rental' },
  { id: 'e17', source: 'staff', target: 'rental' },
  { id: 'e18', source: 'rental', target: 'payment' },
  { id: 'e19', source: 'customer', target: 'payment' },
  { id: 'e20', source: 'staff', target: 'payment' },
];

// Perform Layout
const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
  nodesWithData,
  initialEdgesRaw
);

export default function SchemaGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="w-full h-[600px] bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-right"
      >
        <Background gap={12} size={1} color="#334155" />
        <Controls 
            className="!bg-slate-800 !border-slate-700 shadow-xl" 
            style={{ 
                fill: 'white', 
                color: 'white',
                '--xy-controls-button-background-color': '#1e293b',
                '--xy-controls-button-background-color-hover': '#334155',
                '--xy-controls-button-color': 'white',
                '--xy-controls-button-border-color': '#334155'
            } as React.CSSProperties} 
        />
        <MiniMap 
            nodeColor="#6366f1" 
            maskColor="rgba(15, 23, 42, 0.7)" 
            className="!bg-slate-900 border border-slate-800" 
        />
      </ReactFlow>
    </div>
  );
}
