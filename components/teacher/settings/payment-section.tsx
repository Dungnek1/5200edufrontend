"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Info, Wallet, Clock, Coins, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

export function PaymentSettings() {
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, accountName: "Alexandra Chen", bankName: "Techcombank", accountNumber: "•••• •••• •••• 5725", isDefault: true },
    { id: 2, accountName: "Alexandra Chen", bankName: "VCB", accountNumber: "•••• •••• •••• 4829", isDefault: false },
  ]);
  const [showInfo, setShowInfo] = useState(true);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<string>("1");
  const availableBalance = 5000000;
  const t = useTranslations("teacher.settings.payment");

  const transactions = [
    { date: "10/12/2025", status: "Hoàn thành", description: "Rút tiền về tài khỏan *** 4829 - VCB", amount: "- 3,500,000", type: "withdrawal" },
    { date: "10/12/2025", status: "Hoàn thành", description: "HV thanh toán KH abc", amount: "+ 2,000,000", type: "income" },
    { date: "10/12/2025", status: "Đang xử lý", description: "Rút tiền về tài khỏan *** 4829 - VCB", amount: "- 3,500,000", type: "withdrawal" },
    { date: "10/12/2025", status: "Hoàn thành", description: "Rút tiền về tài khỏan *** 4829 - VCB", amount: "- 3,500,000", type: "withdrawal" },
    { date: "10/12/2025", status: "Hoàn thành", description: "HV thanh toán KH abc", amount: "+ 2,000,000", type: "income" },
    { date: "10/12/2025", status: "Hoàn thành", description: "HV thanh toán KH abc", amount: "+ 2,000,000", type: "income" },
    { date: "10/12/2025", status: "Hoàn thành", description: "HV thanh toán KH abc", amount: "+ 2,000,000", type: "income" },
    { date: "10/12/2025", status: "Hoàn thành", description: "HV thanh toán KH abc", amount: "+ 2,000,000", type: "income" },
  ];

  const getStatusBadge = (status: string) => {
    if (status === "Hoàn thành") {
      return <span className="px-2 py-1 text-xs font-medium bg-[#d1fae5] text-[#065f46] rounded">{t("status.completed")}</span>;
    }
    if (status === "Đang xử lý") {
      return <span className="px-2 py-1 text-xs font-medium bg-[#fef3c7] text-[#92400e] rounded">{t("status.processing")}</span>;
    }
      return <span className="px-2 py-1 text-xs font-medium bg-[#fee2e2] text-[#991b1b] rounded">{t("status.failed")}</span>;
  };

  const handleWithdrawalSubmit = () => {
    setShowWithdrawalModal(false);
    setShowSuccessModal(true);
    setWithdrawalAmount("");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  useEffect(() => {
    if (showWithdrawalModal || showSuccessModal) {
      const overlay = document.querySelector('[data-radix-dialog-overlay]');
      if (overlay) {
        (overlay as HTMLElement).style.backgroundColor = 'rgba(59, 61, 72, 0.8)';
      }
    }
  }, [showWithdrawalModal, showSuccessModal]);

  return (
    <div className="space-y-[20px] px-[12px] py-[20px]">
      <header className="mb-[12px]">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-[4px]">
            <h2 className="text-[24px] font-medium leading-[32px] text-[#0f172a]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>
              {t("title")}
            </h2>
            <p className="text-[16px] leading-[24px] text-[#8c92ac]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>
              {t("subtitle")}
            </p>
          </div>
          <Button onClick={() => setShowWithdrawalModal(true)} className="h-[44px] bg-[#4162e7] text-[#fafafa] hover:bg-[#4162e7]/90 px-[16px] py-[8px] rounded-[6px] cursor-pointer">
            <span className="text-[14px] font-medium leading-[20px]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>
              {t("withdrawRequest")}
            </span>
          </Button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="flex gap-[12px]">
        <div className="bg-white border border-[#c4cef8] rounded-[8px] p-[16px] flex flex-col gap-[12px] flex-1">
          <div className="bg-[#eceffd] rounded-full w-[32px] h-[32px] flex items-center justify-center shrink-0">
            <Wallet className="h-4 w-4 text-[#8c92ac]" />
          </div>
          <div className="flex flex-col gap-[4px]">
            <p className="text-[14px] leading-[20px] text-[#7f859d]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>{t("stats.available")}</p>
            <p className="text-[24px] font-medium leading-[32px] text-[#3b3d48]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>2,845,000</p>
          </div>
        </div>
        <div className="bg-white border border-[#c4cef8] rounded-[8px] p-[16px] flex flex-col gap-[12px] flex-1">
          <div className="bg-[#eceffd] rounded-full w-[32px] h-[32px] flex items-center justify-center shrink-0">
            <Clock className="h-4 w-4 text-[#8c92ac]" />
          </div>
          <div className="flex flex-col gap-[4px]">
            <p className="text-[14px] leading-[20px] text-[#7f859d]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>{t("stats.pending")}</p>
            <p className="text-[24px] font-medium leading-[32px] text-[#3b3d48]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>2,845,000</p>
          </div>
        </div>
        <div className="bg-white border border-[#c4cef8] rounded-[8px] p-[16px] flex flex-col gap-[12px] flex-1">
          <div className="bg-[#eceffd] rounded-full w-[32px] h-[32px] flex items-center justify-center shrink-0">
            <Coins className="h-4 w-4 text-[#8c92ac]" />
          </div>
          <div className="flex flex-col gap-[4px]">
            <p className="text-[14px] leading-[20px] text-[#7f859d]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>{t("stats.totalEarnings")}</p>
            <p className="text-[24px] font-medium leading-[32px] text-[#3b3d48]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>2,845,000</p>
          </div>
        </div>
      </div>

      {/* Course Earnings Table */}
      <div className="space-y-[12px]">
        <div className="flex flex-col gap-[4px]">
          <p className="text-[16px] font-medium leading-[24px] text-[#3b3d48]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>{t("courseEarnings")}</p>
          <p className="text-[14px] leading-[20px] text-[#7f859d]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>{t("courseEarningsDescription")}</p>
        </div>
        <div className="bg-white rounded-[12px] overflow-hidden border border-[#f4f4f7] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.05)]">
          <table className="w-full">
            <thead className="bg-[#fafafa] border-b border-[#f4f4f7]">
              <tr>
                <th className="px-[16px] py-[12px] text-left text-[14px] font-medium leading-[20px] text-[#3b3d48]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>{t("courseEarningsTable.course")}</th>
                <th className="px-[16px] py-[12px] text-left text-[14px] font-medium leading-[20px] text-[#3b3d48]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>{t("courseEarningsTable.students")}</th>
                <th className="px-[16px] py-[12px] text-left text-[14px] font-medium leading-[20px] text-[#3b3d48]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>{t("courseEarningsTable.grossRevenue")}</th>
                <th className="px-[16px] py-[12px] text-left text-[14px] font-medium leading-[20px] text-[#3b3d48]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>{t("courseEarningsTable.platformFee")}</th>
                <th className="px-[16px] py-[12px] text-left text-[14px] font-medium leading-[20px] text-[#3b3d48]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>{t("courseEarningsTable.yourEarnings")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f4f7]">
              <tr className="hover:bg-[#eceffd] transition-colors">
                <td className="px-[16px] py-[12px] text-[14px] leading-[20px] text-[#3b3d48]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>Khóa học ABC</td>
                <td className="px-[16px] py-[12px] text-[14px] leading-[20px] text-[#3b3d48]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>25</td>
                <td className="px-[16px] py-[12px] text-[14px] leading-[20px] text-[#3b3d48]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>5,000,000₫</td>
                <td className="px-[16px] py-[12px] text-[14px] leading-[20px] text-[#3b3d48]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>1,000,000₫</td>
                <td className="px-[16px] py-[12px] text-[14px] font-medium leading-[20px] text-[#0f172a]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>4,000,000₫</td>
              </tr>
              <tr className="hover:bg-[#eceffd] transition-colors">
                <td className="px-[16px] py-[12px] text-[14px] leading-[20px] text-[#3b3d48]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>Khóa học XYZ</td>
                <td className="px-[16px] py-[12px] text-[14px] leading-[20px] text-[#3b3d48]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>15</td>
                <td className="px-[16px] py-[12px] text-[14px] leading-[20px] text-[#3b3d48]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>3,000,000₫</td>
                <td className="px-[16px] py-[12px] text-[14px] leading-[20px] text-[#3b3d48]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>600,000₫</td>
                <td className="px-[16px] py-[12px] text-[14px] font-medium leading-[20px] text-[#0f172a]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>2,400,000₫</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="space-y-[12px]">
        <div className="flex flex-col gap-[4px]">
          <p className="text-[16px] font-medium leading-[24px] text-[#3b3d48]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>{t("paymentMethods")}</p>
          <p className="text-[14px] leading-[20px] text-[#7f859d]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>{t("paymentMethodsDescription")}</p>
        </div>
        <div className="space-y-[8px]">
          {paymentMethods.map((method) => (
            <div key={method.id} className="bg-white rounded-[8px] p-[12px] flex items-center gap-[12px]">
              <div className="flex-1 grid grid-cols-3 gap-[12px]">
                <div className="flex flex-col gap-[4px]">
                  <div className="flex items-center gap-[8px]">
                    <p className="text-[14px] leading-[20px] text-[#7f859d]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>{t("accountOwner")}</p>
                    {method.isDefault && (
                      <span className="px-[8px] py-[2px] text-[12px] font-medium bg-[#dbeafe] text-[#1e40af] rounded" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>{t("defaultLabel")}</span>
                    )}
                  </div>
                  <p className="text-[16px] font-medium leading-[24px] text-[#0f172a]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>{method.accountName}</p>
                </div>
                <div className="flex flex-col gap-[4px]">
                  <p className="text-[14px] leading-[20px] text-[#7f859d]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>{t("bankName")}</p>
                  <p className="text-[16px] font-medium leading-[24px] text-[#0f172a]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>{method.bankName}</p>
                </div>
                <div className="flex flex-col gap-[4px]">
                  <p className="text-[14px] leading-[20px] text-[#7f859d]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>{t("accountNumber")}</p>
                  <p className="text-[16px] font-medium leading-[24px] text-[#0f172a]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>{method.accountNumber}</p>
                </div>
              </div>
              <button className="w-[32px] h-[32px] flex items-center justify-center text-[#dc2626] bg-white hover:bg-[#dc2626] hover:text-white rounded-[6px] transition-colors cursor-pointer">
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
        {showInfo && (
          <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-[8px] p-[8px] flex items-start gap-[8px] relative">
            <Info className="h-5 w-5 text-[#3b82f6] flex-shrink-0 mt-[2px]" />
            <div className="flex-1 flex flex-col gap-[4px]">
              <p className="text-[14px] font-medium leading-[20px] text-[#1e40af]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>{t("importantTitle")}</p>
              <p className="text-[14px] leading-[20px] text-[#1e40af]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>
                {t("importantDescription")}
              </p>
            </div>
            <button onClick={() => setShowInfo(false)} className="text-[#3b82f6] hover:text-[#1e40af] flex-shrink-0 w-[20px] h-[20px] flex items-center justify-center cursor-pointer">
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Transaction History */}
      <div className="space-y-[12px]">
        <div className="flex flex-col gap-[4px]">
          <p className="text-[16px] font-medium leading-[24px] text-[#3b3d48]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>{t("transactionHistory")}</p>
          <p className="text-[14px] leading-[20px] text-[#7f859d]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>{t("transactionHistoryDescription")}</p>
        </div>
        <div className="bg-white rounded-[12px] overflow-hidden border border-[#f4f4f7] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.05)]">
          <table className="w-full">
            <thead className="bg-[#fafafa] border-b border-[#f4f4f7]">
              <tr>
                <th className="px-[16px] py-[12px] text-left text-[14px] font-medium leading-[20px] text-[#3b3d48]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>{t("transactionTable.date")}</th>
                <th className="px-[16px] py-[12px] text-left text-[14px] font-medium leading-[20px] text-[#3b3d48]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>{t("transactionTable.status")}</th>
                <th className="px-[16px] py-[12px] text-left text-[14px] font-medium leading-[20px] text-[#3b3d48]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>{t("transactionTable.description")}</th>
                <th className="px-[16px] py-[12px] text-right text-[14px] font-medium leading-[20px] text-[#3b3d48]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>{t("transactionTable.amount")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f4f7]">
              {transactions.map((tx, index) => (
                <tr key={index} className="hover:bg-[#eceffd] transition-colors">
                  <td className="px-[16px] py-[12px] text-[14px] leading-[20px] text-[#3b3d48]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>{tx.date}</td>
                  <td className="px-[16px] py-[12px]">{getStatusBadge(tx.status)}</td>
                  <td className="px-[16px] py-[12px] text-[14px] leading-[20px] text-[#3b3d48]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>{tx.description}</td>
                  <td className={`px-[16px] py-[12px] text-[14px] font-medium text-right leading-[20px] ${tx.type === 'income' ? 'text-[#059669]' : 'text-[#dc2626]'}`} style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>
                    {tx.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination */}
          <div className="px-[16px] py-[12px] border-t border-[#f4f4f7] flex items-center justify-center">
            <div className="flex items-center gap-[8px]">
              <button className="px-[12px] py-[4px] text-[14px] leading-[20px] text-[#3b3d48] hover:bg-[#eceffd] rounded-[6px] transition-colors" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>1</button>
              <button className="px-[12px] py-[4px] text-[14px] leading-[20px] text-[#3b3d48] hover:bg-[#eceffd] rounded-[6px] transition-colors" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>2</button>
              <button className="px-[12px] py-[4px] text-[14px] leading-[20px] text-[#3b3d48] hover:bg-[#eceffd] rounded-[6px] transition-colors" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>3</button>
            </div>
          </div>
        </div>
      </div>

      {/* Withdrawal Request Modal */}
      <Dialog open={showWithdrawalModal} onOpenChange={setShowWithdrawalModal}>
        <DialogContent className="max-w-[600px] p-[40px] rounded-[16px] bg-white [&>button]:hidden">
          <button onClick={() => setShowWithdrawalModal(false)} className="absolute right-[24px] top-[24px] w-[24px] h-[24px] flex items-center justify-center cursor-pointer">
            <X className="h-6 w-6 text-[#3b3d48]" />
          </button>
          <div className="flex flex-col gap-[20px]">
            <h2 className="text-[30px] font-medium leading-[40px] text-[#0f172a]" style={{ fontFamily: "Be Vietnam Pro, sans-serif", fontWeight: 500 }}>
              Yêu cầu rút tiền
            </h2>
            <div className="flex flex-col gap-[24px]">
              <div className="flex flex-col gap-[4px]">
                <label className="text-[14px] leading-[20px] text-[#7f859d]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>{t("withdrawModal.amount")}</label>
                <Input
                  type="number"
                  placeholder={t("withdrawModal.amountPlaceholder")}
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  className="h-[40px] px-[12px] py-[4px] bg-[#fafafa] border border-[#f4f4f7] rounded-[8px] text-[14px] leading-[20px] text-[#7f859d]"
                  style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                />
                <p className="text-[12px] leading-[16px] text-[#8c92ac]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>
                  {t("withdrawModal.availableBalanceLabel")}:{" "}
                  <span className="font-medium text-[#4d505f]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>
                    {formatCurrency(availableBalance)} vnđ
                  </span>
                </p>
              </div>
              <div className="flex flex-col gap-[4px]">
                <label className="text-[14px] leading-[20px] text-[#7f859d]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>{t("withdrawModal.method")}</label>
                <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                  <SelectTrigger className="h-[40px] px-[12px] py-[4px] bg-[#fafafa] border border-[#f4f4f7] rounded-[8px]">
                    <SelectValue>
                      {paymentMethods.find(m => m.id.toString() === selectedAccount) && (
                        <span className="text-[14px] leading-[20px] text-[#3b3d48]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>
                          {paymentMethods.find(m => m.id.toString() === selectedAccount)?.accountNumber} - {paymentMethods.find(m => m.id.toString() === selectedAccount)?.bankName}
                        </span>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.id} value={method.id.toString()}>
                        {method.accountNumber} - {method.bankName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between gap-[12px]">
              <Button variant="outline" onClick={() => setShowWithdrawalModal(false)} className="h-[44px] border border-[#4162e7] bg-white text-[#4162e7] hover:bg-[#4162e7] hover:text-white px-[16px] py-[8px] rounded-[6px] cursor-pointer">
                <span className="text-[14px] font-medium leading-[20px]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>{t("withdrawModal.cancel")}</span>
              </Button>
              <Button onClick={handleWithdrawalSubmit} disabled={!withdrawalAmount || parseFloat(withdrawalAmount) < 200000} className="h-[44px] bg-[#4162e7] text-[#fafafa] hover:bg-[#4162e7]/90 px-[16px] py-[8px] rounded-[6px] cursor-pointer disabled:cursor-not-allowed">
                <span className="text-[14px] font-medium leading-[20px]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>{t("withdrawModal.submit")}</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success/Processing Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-[500px] p-[24px] rounded-[16px] bg-[#fafafa] [&>button]:hidden">
          <div className="flex flex-col gap-[28px] items-end">
            <div className="flex flex-col gap-[12px] items-start w-full">
              <div className="h-[150px] w-full rounded-[8px] bg-gradient-to-br from-[#4162e7] to-[#5b7cff] flex items-center justify-center">
                <div className="text-white text-[48px]">✓</div>
              </div>
              <h2 className="text-[20px] font-bold leading-[28px] text-[#3b3d48] text-center w-full" style={{ fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
                {t("successModal.processingTitle")}
              </h2>
              <div className="flex flex-col gap-[4px] items-start w-full">
                <p className="text-[16px] leading-[24px] text-[#4d505f] text-center w-full" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>
                  {t("successModal.processingLine1")}
                </p>
                <p className="text-[16px] leading-[24px] text-[#4d505f] text-center w-full" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>
                  {t("successModal.processingLine2")}
                </p>
              </div>
            </div>
            <Button onClick={() => setShowSuccessModal(false)} className="w-full h-[44px] bg-[#4162e7] text-[#fafafa] hover:bg-[#4162e7]/90 px-[16px] py-[8px] rounded-[6px] cursor-pointer">
              <span className="text-[14px] font-medium leading-[20px]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>{t("successModal.close")}</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
