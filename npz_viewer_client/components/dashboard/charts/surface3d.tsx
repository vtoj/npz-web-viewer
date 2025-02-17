"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => <SurfaceSkeleton />,
});

interface Surface3DProps {
  data: number[][];
}

const SurfaceSkeleton = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">3D Surface Plot Skeleton</h2>
      <div className="w-full h-64 bg-gray-100 rounded-lg p-4 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3/4 h-3/4 bg-gray-200 rounded-lg transform rotate-45 skew-x-12 animate-pulse"></div>
        </div>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-gray-300 h-px w-full left-0 animate-pulse"
            style={{ top: `${20 + i * 15}%` }}
          ></div>
        ))}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-gray-300 w-px h-full top-0 animate-pulse"
            style={{ left: `${20 + i * 15}%` }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default function Surface3D({ data }: Surface3DProps) {
  if (!data || data.length === 0) {
    return <div>No data available for 3D Surface Plot.</div>;
  }

  return (
    <>
      <Plot
        data={[
          {
            z: data,
            type: "surface",
            colorscale: "Viridis",
            showscale: true,
          },
        ]}
        layout={{
          title: "3D Surface Plot",
          scene: {
            xaxis: { title: "Columns" },
            yaxis: { title: "Rows" },
            zaxis: { title: "Values" },
          },
          height: 600,
          width: 800,
        }}
      />
    </>
  );
}
