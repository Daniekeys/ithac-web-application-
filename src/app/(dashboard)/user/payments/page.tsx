"use client";

import { useState } from "react";
import { usePaymentHistory } from "@/hooks/useUserCourse";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, AlertCircle, Copy } from "lucide-react";

export default function PaymentHistoryPage() {
  const { data: historyData, isLoading, isError } = usePaymentHistory();
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);

  // Assuming response structure: { success: true, data: [...] }
  const payments = historyData?.data || [];

  const prioritizedPayments = [...payments].sort((a: any, b: any) => {
    const aCount = a.packages?.length ?? 0;
    const bCount = b.packages?.length ?? 0;
    if (aCount !== bCount) return bCount - aCount;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount: any) => {
    // amount can be a number or object {$numberDecimal: "..."}
    const val =
      typeof amount === "object" && amount?.$numberDecimal
        ? parseFloat(amount.$numberDecimal)
        : Number(amount);
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(val);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "success":
      case "successful":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCourseSummary = (packages: any[]) => {
    if (!packages?.length) return "No course info";
    const [first, second, ...rest] = packages;
    const lines = [
      `${first?.course?.title ?? "Unknown course"} (${first?.course?.level ?? "N/A"})`,
      ...(second
        ? [
            `${second?.course?.title ?? "Unknown course"} (${second?.course?.level ?? "N/A"})`,
          ]
        : []),
    ];
    if (rest.length) lines.push(`+${rest.length} more`);
    return lines.join(" · ");
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-10 w-1/4 mb-6" />
        <Skeleton className="h-64 w-full rounded-md" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center bg-red-50 rounded-lg text-red-600">
        <AlertCircle className="h-10 w-10 mx-auto mb-2" />
        <p>Failed to load payment history. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
        <p className="text-gray-500">View and track your transaction history</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>No transactions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Courses</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prioritizedPayments.map((payment: any) => (
                    <TableRow
                      key={payment._id}
                      className="cursor-pointer hover:bg-slate-50"
                      onClick={() => {
                        setSelectedPayment(payment);
                        setCopiedRef(false);
                        setIsModalOpen(true);
                      }}
                    >
                      <TableCell className="whitespace-nowrap text-xs text-gray-700">
                        <div>{formatDate(payment.createdAt)}</div>
                        <div className="text-gray-500 text-[11px]">
                          {new Date(payment.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-xs">
                          {payment.packages?.length > 0 ? (
                            payment.packages.slice(0, 2).map((pkg: any) => (
                              <div
                                key={pkg._id}
                                className="rounded-md border border-slate-200 p-2 bg-slate-50"
                              >
                                <div className="font-medium text-slate-700">
                                  {pkg.course?.title ?? "Untitled course"}
                                </div>
                                <div className="text-[11px] text-slate-500">
                                  {pkg.course?.level
                                    ? `${pkg.course.level} · `
                                    : ""}
                                  Expires{" "}
                                  {new Date(pkg.expire).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    },
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-slate-500">
                              No course details
                            </div>
                          )}
                          {payment.packages?.length > 2 && (
                            <div className="text-xs text-indigo-600">
                              +{payment.packages.length - 2} more course(s)
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-slate-700">
                        {formatAmount(payment.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatusColor(payment.status)}
                        >
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-right">
                        <div>{payment.transaction_id || payment._id}</div>
                        {payment.paymentRef && (
                          <div className="text-gray-500 text-[11px]">
                            {payment.paymentRef}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transaction details</DialogTitle>
            <p className="text-sm text-slate-500">
              Tap outside or close to return to your payment history.
            </p>
          </DialogHeader>

          {selectedPayment ? (
            <div className="mt-4 space-y-4 text-sm text-slate-700">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-slate-500">
                      Status
                    </div>
                    <Badge
                      variant="outline"
                      className={getStatusColor(selectedPayment.status)}
                    >
                      {selectedPayment.status}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-xs uppercase tracking-wide text-slate-500">
                      Paid
                    </div>
                    <div className="text-lg font-semibold">
                      {formatAmount(selectedPayment.amount)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-3">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Included courses
                </div>
                <div className="mt-2 space-y-2">
                  {selectedPayment.packages?.length > 0 ? (
                    selectedPayment.packages.map((pkg: any) => (
                      <div
                        key={pkg._id}
                        className="rounded-md border border-slate-200 p-2 bg-white"
                      >
                        <div className="font-medium text-slate-800">
                          {pkg.course?.title ?? "Untitled course"}
                        </div>
                        <div className="text-[12px] text-slate-500">
                          {pkg.course?.tagline ?? "No tagline"}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Level: {pkg.course?.level ?? "N/A"} · Expires{" "}
                          {new Date(pkg.expire).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-500">
                      No course packages found.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-3 bg-slate-50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-slate-500">
                      Reference ID
                    </div>
                    <div className="font-mono text-xs text-slate-700">
                      {selectedPayment.transaction_id || selectedPayment._id}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      navigator.clipboard.writeText(
                        selectedPayment.transaction_id || selectedPayment._id,
                      );
                      setCopiedRef(true);
                    }}
                    className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    {copiedRef ? "Copied" : "Copy"}
                  </button>
                </div>
                {selectedPayment.paymentRef && (
                  <div className="mt-1 text-xs text-slate-500">
                    Payment ref: {selectedPayment.paymentRef}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500 py-6">
              No transaction selected.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
