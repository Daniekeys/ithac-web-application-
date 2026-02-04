"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { adminService } from "@/services/admin.service";
import { Transaction } from "@/types/transaction.types";
import { useToast } from "@/hooks/use-toast";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const data = await adminService.getTransactions();
        // Handle both array response or object with data property
        // @ts-ignore - The service type returns Transaction[] but API might wrap it
        const list = Array.isArray(data) ? data : data.data || [];
        setTransactions(list);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
        toast({
          title: "Error",
          description: "Failed to load transactions",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [toast]);

  const filteredTransactions = transactions.filter((tx) =>
    tx._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            View and manage all system transactions.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Transactions</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID, email or name..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <CardDescription>
            {isLoading
              ? "Loading..."
              : `Total ${filteredTransactions.length} transactions`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="ml-2">Loading transactions...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx) => (
                    <TableRow key={tx._id}>
                      <TableCell className="font-mono text-xs">
                        {tx._id}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {tx.user?.name || "Unknown User"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {tx.user?.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: tx.currency || "USD",
                        }).format(tx.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            tx.status === "completed"
                              ? "default" // default is usually primary/dark in shadcn
                              : tx.status === "pending"
                              ? "secondary" // secondary is usually gray/muted
                              : "destructive" // destructive is red
                          }
                          className={
                             tx.status === "completed" 
                             ? "bg-green-600 hover:bg-green-700" 
                             : ""
                          }
                        >
                          {tx.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(tx.createdAt).toLocaleDateString()}
                        <span className="text-xs text-muted-foreground block">
                          {new Date(tx.createdAt).toLocaleTimeString()}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No transactions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
