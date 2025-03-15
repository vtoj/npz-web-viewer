"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface DimensionalityVisualizationProps {
  reducedData: number[][];
  algorithm: string;
}

export default function DimensionalityVisualization({
  reducedData,
  algorithm,
}: DimensionalityVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !reducedData || reducedData.length === 0) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll("*").remove();

    // Set up dimensions
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const xExtent = d3.extent(reducedData, (d: number[]) => d[0]) as [
      number,
      number
    ];
    const yExtent = d3.extent(reducedData, (d: number[]) => d[1]) as [
      number,
      number
    ];

    // Add padding to the extents
    const xPadding = (xExtent[1] - xExtent[0]) * 0.05;
    const yPadding = (yExtent[1] - yExtent[0]) * 0.05;

    const xScale = d3
      .scaleLinear()
      .domain([xExtent[0] - xPadding, xExtent[1] + xPadding])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([yExtent[0] - yPadding, yExtent[1] + yPadding])
      .range([height, 0]);

    // Add axes
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .append("text")
      .attr("x", width / 2)
      .attr("y", 30)
      .attr("fill", "#000")
      .style("text-anchor", "middle")
      .text("Component 1");

    svg
      .append("g")
      .call(d3.axisLeft(yScale))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -30)
      .attr("x", -height / 2)
      .attr("fill", "#000")
      .style("text-anchor", "middle")
      .text("Component 2");

    // Add data points
    svg
      .selectAll("circle")
      .data(reducedData)
      .enter()
      .append("circle")
      .attr("cx", (d: number[]) => xScale(d[0]))
      .attr("cy", (d: number[]) => yScale(d[1]))
      .attr("r", 4)
      .style("fill", "#4f46e5")
      .style("opacity", 0.7)
      .style("stroke", "#fff")
      .style("stroke-width", 1);

    // Add title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -5)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text(`${algorithm.toUpperCase()} Visualization`);
  }, [reducedData, algorithm]);

  return (
    <div className="flex justify-center overflow-x-auto">
      <svg ref={svgRef}></svg>
    </div>
  );
}
