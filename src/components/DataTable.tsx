import { DataRecord } from "@/types/data";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps {
  data: DataRecord[];
  title: string;
  showDescription?: boolean;
}

export function DataTable({ data, title, showDescription = false }: DataTableProps) {
  if (data.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <p className="text-muted-foreground">No valid data to display</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product ID</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Category</TableHead>
              {showDescription && <TableHead>Description</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{row.product_id}</TableCell>
                <TableCell>{row.product_name}</TableCell>
                <TableCell>${row.price.toFixed(2)}</TableCell>
                <TableCell>{row.category}</TableCell>
                {showDescription && (
                  <TableCell className="max-w-xs">
                    {row.description || (
                      <span className="text-muted-foreground italic">
                        Description will be generated...
                      </span>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}