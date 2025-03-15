"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface ClusteringVisualizationProps {
  data: number[][];
  labels: number[];
  centroids?: number[][];
  algorithm: string;
}

export default function ClusteringVisualization({
  data,
  labels,
  centroids,
  algorithm,
}: ClusteringVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

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

    // Get unique cluster labels
    const uniqueLabels = Array.from(new Set(labels));

    // Create color scale
    const colorScale = d3
      .scaleOrdinal<string>()
      .domain(uniqueLabels.map(String))
      .range(d3.schemeCategory10);

    // Create scales
    const xExtent = d3.extent(data, (d: number[]) => d[0]) as [number, number];
    const yExtent = d3.extent(data, (d: number[]) => d[1]) as [number, number];

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
      .call(d3.axisBottom(xScale));

    svg.append("g").call(d3.axisLeft(yScale));

    // Add data points
    svg
      .selectAll("circle.data-point")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "data-point")
      .attr("cx", (d: number[]) => xScale(d[0]))
      .attr("cy", (d: number[]) => yScale(d[1]))
      .attr("r", 4)
      .style("fill", (_: number[], i: number) =>
        colorScale(labels[i].toString())
      )
      .style("opacity", 0.7)
      .style("stroke", "#fff")
      .style("stroke-width", 1);

    // Add centroids if K-means
    if (algorithm === "kmeans" && centroids) {
      svg
        .selectAll("circle.centroid")
        .data(centroids)
        .enter()
        .append("circle")
        .attr("class", "centroid")
        .attr("cx", (d: number[]) => xScale(d[0]))
        .attr("cy", (d: number[]) => yScale(d[1]))
        .attr("r", 8)
        .style("fill", (_: number[], i: number) => colorScale(i.toString()))
        .style("stroke", "#000")
        .style("stroke-width", 2)
        .style("opacity", 0.9);
    }

    // Add legend
    const legend = svg
      .append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width - 100}, 0)`);

    uniqueLabels.forEach((label, i) => {
      const legendRow = legend
        .append("g")
        .attr("transform", `translate(0, ${i * 20})`);

      legendRow
        .append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", colorScale(label.toString()));

      legendRow
        .append("text")
        .attr("x", 20)
        .attr("y", 10)
        .attr("text-anchor", "start")
        .style("font-size", "12px")
        .text(label === -1 ? "Noise" : `Cluster ${label}`);
    });
  }, [data, labels, centroids, algorithm]);

  return (
    <div className="flex justify-center overflow-x-auto">
      <svg ref={svgRef}></svg>
    </div>
  );
}
