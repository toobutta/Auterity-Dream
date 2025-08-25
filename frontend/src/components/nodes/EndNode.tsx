import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { NodeData } from "../../types/workflow";

export const EndNode: React.FC<NodeProps<NodeData>> = ({
  data,
  isConnectable,
}) => {
  return (
    <div className="bg-red-100 border-2 border-red-300 rounded-lg p-3 shadow-md min-w-[120px]">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-red-500"
      />

      <div className="text-center">
        <div className="w-8 h-8 bg-red-500 rounded-full mx-auto mb-2 flex items-center justify-center">
          <span className="text-white text-sm font-bold">■</span>
        </div>
        <h3 className="font-bold text-red-800">{data.label}</h3>
        {data.description && (
          <p className="text-xs text-red-600 mt-1">{data.description}</p>
        )}
      </div>
    </div>
  );
};
