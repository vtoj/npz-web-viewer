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
import MLPanel from "../ml/MLPanel";

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
  const downloadButtonRefs = useRef<Record<string, HTMLButtonElement | null>>(
    {}
  );
  const [chartType, setChartType] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [selectedArrayKey, setSelectedArrayKey] = useState<string | null>(null);
  const [currentDownloadIndex, setCurrentDownloadIndex] = useState(0);
  const [downloadButtons, setDownloadButtons] = useState<string[]>([]);

  // Set initial selections when data is loaded
  useEffect(() => {
    if (Object.keys(data).length > 0) {
      const firstFile = Object.keys(data)[0];
      setSelectedFile(firstFile);

      if (Object.keys(data[firstFile]).length > 0) {
        const firstArray = Object.keys(data[firstFile])[0];
        setSelectedArrayKey(firstArray);
      }
    }
  }, [data]);

  // Build a list of all download button IDs
  useEffect(() => {
    const buttons: string[] = [];
    Object.entries(data).forEach(([fileName, arrays]) => {
      Object.entries(arrays).forEach(([arrayName, arrayData]) => {
        if (arrayData.ndim === 2) {
          buttons.push(`${fileName}-${arrayName}`);
        }
      });
    });
    setDownloadButtons(buttons);
  }, [data]);

  useEffect(() => {
    const lenis = new Lenis();

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
    if (downloadButtons.length === 0) return;

    // Move to the next download button
    const nextIndex = (currentDownloadIndex + 1) % downloadButtons.length;
    setCurrentDownloadIndex(nextIndex);

    const buttonId = downloadButtons[nextIndex];
    const buttonElement = downloadButtonRefs.current[buttonId];

    if (buttonElement) {
      buttonElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  function ArrayCopyBtn({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
      navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Array copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <Button
        variant="outline"
        size="sm"
        onClick={copyToClipboard}
        className="flex items-center space-x-1"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        <span>{copied ? "Copied!" : "Copy"}</span>
      </Button>
    );
  }

  return (
    <div className="space-y-6">
      {/* Scroll to Download Button */}
      <button
        onClick={scrollToNextDownload}
        className="fixed bottom-4 right-4 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition-colors z-10"
        aria-label="Scroll to next download"
      >
        <ChevronsDown className="h-6 w-6" />
      </button>

      <div>
        {Object.entries(data).map(([fileName, arrays]) => (
          <div key={fileName} className="mb-8">
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
              {fileName}
            </h3>
            {Object.entries(arrays).map(([arrayName, arrayData]) => {
              const formattedText = JSON.stringify(arrayData.data);
              const buttonId = `${fileName}-${arrayName}`;

              return (
                <div
                  key={buttonId}
                  className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  onClick={() => {
                    setSelectedFile(fileName);
                    setSelectedArrayKey(arrayName);
                  }}
                >
                  <h4 className="text-md font-medium mb-2 text-gray-900 dark:text-white">
                    {arrayName}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Shape: {JSON.stringify(arrayData.size)} | Dimensions:{" "}
                    {arrayData.ndim}
                  </p>

                  {arrayData.ndim === 2 ? (
                    <div>
                      <Table2D data={arrayData.data} fileName={buttonId} />

                      <div className="flex w-full items-center justify-between mt-4">
                        <div className="flex space-x-2">
                          <Button
                            ref={(el) => {
                              downloadButtonRefs.current[buttonId] = el;
                            }}
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              downloadCSV(arrayData.data, buttonId);
                            }}
                          >
                            Download CSV
                          </Button>

                          <Select
                            value={chartType || ""}
                            onValueChange={(value) =>
                              setChartType(value || null)
                            }
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select chart type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="line">Line Chart</SelectItem>
                              <SelectItem value="scatter">
                                Scatter Plot
                              </SelectItem>
                              <SelectItem value="grayscale">
                                Grayscale Image
                              </SelectItem>
                              <SelectItem value="scatter3d">
                                3D Scatter
                              </SelectItem>
                              <SelectItem value="surface3d">
                                3D Surface
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <ArrayCopyBtn text={formattedText} />
                        </div>
                      </div>

                      {chartType && (
                        <div className="mt-4">
                          <ChartRenderer
                            arrayData={arrayData}
                            chartType={chartType}
                          />
                        </div>
                      )}

                      {/* ML Panel for each 2D array */}
                      <div className="mt-6">
                        <MLPanel
                          arrayData={arrayData}
                          fileName={fileName}
                          arrayName={arrayName}
                        />
                      </div>
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
    </div>
  );
}
