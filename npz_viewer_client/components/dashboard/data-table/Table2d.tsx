import React, { useMemo, memo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Table2DProps {
  data: number[][];
  fileName: string;
}

// A memoized row component to avoid unnecessary re-renders when its props do not change
const MemoizedTableRow: React.FC<{ row: number[] }> = memo(({ row }) => {
  return (
    <TableRow>
      {row.map((cell, cellIndex) => (
        <TableCell key={cellIndex} className="text-center">
          {typeof cell === "number" ? cell.toFixed(4) : cell}
        </TableCell>
      ))}
    </TableRow>
  );
});

const Table2D: React.FC<Table2DProps> = ({ data }) => {
  // Memoize header cells so they are only recalculated if the data changes
  const headerCells = useMemo(
    () =>
      data[0].map((_, colIndex) => (
        <TableHead key={colIndex} className="text-center">
          Column {colIndex + 1}
        </TableHead>
      )),
    [data]
  );

  // Memoize table rows
  const tableRows = useMemo(
    () =>
      data.map((row, rowIndex) => (
        <MemoizedTableRow key={rowIndex} row={row} />
      )),
    [data]
  );

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>{headerCells}</TableRow>
        </TableHeader>
        <TableBody>{tableRows}</TableBody>
      </Table>
    </div>
  );
};

export default memo(Table2D);
