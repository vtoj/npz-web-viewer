"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { downloadCSV } from "@/utils/csv-utils";
import Table2D from "./Table2d";
import MultiDimensionalArray from "./MultiDimensionalArray";
import { Button } from "@/components/ui/button";
import { ChevronsDown, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LineChart from "../charts/chart";
import ScatterPlot from "../charts/scatterplot";
import GrayscaleImage from "../charts/greyscale";
import Scatter3D from "../charts/scatter3d";
import Surface3D from "../charts/surface3d";

interface ArrayData {
  size: any;
  ndim: number;
  data: any[];
}

interface DataTableProps {
  data: Record<string, Record<string, ArrayData>>; // Adjusted for multiple files
}

function ChartRenderer({
  arrayData,
  chartType,
}: {
  arrayData: ArrayData;
  chartType: string | null;
}) {
  if (!chartType) return null;

  switch (chartType) {
    case "scatter":
      return <ScatterPlot data={arrayData.data} />;
    case "line":
      return <LineChart data={arrayData.data} />;
    case "grayscale":
      return <GrayscaleImage data={arrayData.data} />;
    case "scatter3d":
      return <Scatter3D data={arrayData.data} />;
    case "surface3d":
      return <Surface3D data={arrayData.data} />;
    default:
      return null;
  }
}

export default function DataTable({ data }: DataTableProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const downloadRefs = useRef<HTMLButtonElement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0); // Tracks the current download button index

  const [chartType, setChartType] = useState<string | null>(null);

  useEffect(() => {
    const lenis = new Lenis();
    lenisRef.current = lenis;

    function raf(time: any) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const scrollToNextDownload = () => {
    if (lenisRef.current && downloadRefs.current.length > 0) {
      const target = downloadRefs.current[currentIndex];

      if (target) {
        lenisRef.current.scrollTo(target, { duration: 2.5, offset: -500 });
        setCurrentIndex(
          (prevIndex) => (prevIndex + 1) % downloadRefs.current.length,
        );
      }
    }
  };

  function ArrayCopyBtn({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Copied to clipboard");
    };

    return (
      <Button
        variant="outline"
        size="icon"
        onClick={copyToClipboard}
        aria-label={copied ? "Copied" : "Copy to clipboard"}
      >
        <span className="sr-only">{copied ? "Copied" : "Copy"}</span>
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    );
  }

  return (
    <div className="relative space-y-8">
      {/* Scroll to Download Button */}
      <button
        onClick={scrollToNextDownload}
        className="fixed bottom-8 right-8 z-50 bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:bg-indigo-700 transition"
        aria-label="Scroll to Next Download"
      >
        <ChevronsDown className="h-6 w-6" />
      </button>

      {Object.entries(data).map(([fileName, arrays], fileIndex) => (
        <div key={fileName} className="border rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            File: {fileName}
          </h2>
          {Object.entries(arrays).map(([arrayName, arrayData], arrayIndex) => {
            const formattedText =
              arrayData.ndim === 2
                ? arrayData.data.map((row: any) => row.join(", ")).join("\n")
                : JSON.stringify(arrayData.data, null, 2);

            const downloadIndex = fileIndex + arrayIndex;
            return (
              <div key={arrayName} className="border rounded-lg p-4 mb-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  {arrayName}{" "}
                  <span className="text-gray-500 text-xs">
                    ({arrayData.ndim}D Array)
                  </span>
                </h3>
                {arrayData.ndim === 2 ? (
                  <div>
                    <Table2D
                      data={arrayData.data}
                      fileName={`${fileName}-${arrayName}`}
                    />
                    {/* Flex container for the buttons */}
                    <div className="flex w-full items-center justify-between mt-4">
                      {/* Left column: Download CSV and Chart Select */}
                      <div className="flex space-x-2">
                        <Button
                          ref={(el) => {
                            if (el)
                              downloadRefs.current[downloadIndex] = el;
                          }}
                          onClick={() =>
                            downloadCSV(
                              arrayData.data,
                              `${fileName}-${arrayName}`,
                            )
                          }
                        >
                          Download CSV
                        </Button>
                        <div className="flex items-center space-x-2">
                          <Select
                            onValueChange={(value) => setChartType(value)}
                            value={chartType || ""}
                          >
                            <SelectTrigger className="w-fit">
                              <SelectValue placeholder="Select Chart Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="scatter">
                                Scatter Plot
                              </SelectItem>
                              <SelectItem value="line">
                                Line Chart
                              </SelectItem>
                              <SelectItem value="grayscale">
                                Grayscale Image
                              </SelectItem>
                              <SelectItem value="scatter3d">
                                Scatter3D
                              </SelectItem>
                              <SelectItem value="surface3d">
                                Surface3D
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          {chartType && (
                            <Button
                              onClick={() => setChartType(null)}
                              className="ml-2"
                            >
                              Hide Chart
                            </Button>
                          )}
                        </div>
                      </div>
                      {/* Right column: Copy Button */}
                      <div>
                        <ArrayCopyBtn text={formattedText} />
                      </div>
                    </div>
                    {/* Chart appears below all buttons */}
                    {chartType && (
                      <div className="mt-4">
                        <ChartRenderer
                          arrayData={arrayData}
                          chartType={chartType}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-end mb-2">
                      <ArrayCopyBtn text={formattedText} />
                    </div>
                    <MultiDimensionalArray data={arrayData.data} depth={0} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
