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

export default function Table2D({ data }: Table2DProps) {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            {data[0].map((_, colIndex) => (
              <TableHead key={colIndex} className="text-center">
                Column {colIndex + 1}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex} className="text-center">
                  {typeof cell === "number" ? cell.toFixed(4) : cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
