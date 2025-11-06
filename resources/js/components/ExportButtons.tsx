import { FileSpreadsheet, FileText } from 'lucide-react';
import { useState } from 'react';

interface ExportButtonsProps {
    summary: {
        cash: number;
        income: number;
        expense: number;
        profit: number;
    };
}

export default function ExportButtons({ summary }: ExportButtonsProps) {
    const [isExporting, setIsExporting] = useState(false);

    const exportToPDF = async () => {
        setIsExporting(true);
        try {
            // Lazy load jsPDF only when needed
            const { default: jsPDF } = await import('jspdf');
            
            const doc = new jsPDF();
            doc.text('Dashboard Report', 20, 20);
            doc.text(`Saldo Kas: Rp ${(summary.cash || 0).toLocaleString()}`, 20, 40);
            doc.text(`Pendapatan (Bulan): Rp ${(summary.income || 0).toLocaleString()}`, 20, 50);
            doc.text(`Biaya (Bulan): Rp ${(summary.expense || 0).toLocaleString()}`, 20, 60);
            doc.text(`Laba (Bulan): Rp ${(summary.profit || 0).toLocaleString()}`, 20, 70);
            doc.save(`dashboard-report-${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error('PDF export error:', error);
            alert('Gagal mengekspor PDF');
        } finally {
            setIsExporting(false);
        }
    };

    const exportToExcel = async () => {
        setIsExporting(true);
        try {
            // Lazy load XLSX only when needed
            const XLSX = await import('xlsx');
            
            const data = [
                ['Metric', 'Value'],
                ['Saldo Kas', summary.cash || 0],
                ['Pendapatan (Bulan)', summary.income || 0],
                ['Biaya (Bulan)', summary.expense || 0],
                ['Laba (Bulan)', summary.profit || 0],
            ];
            const ws = XLSX.utils.aoa_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Dashboard');
            XLSX.writeFile(wb, `dashboard-report-${new Date().toISOString().split('T')[0]}.xlsx`);
        } catch (error) {
            console.error('Excel export error:', error);
            alert('Gagal mengekspor Excel');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="flex gap-2">
            <button
                onClick={exportToPDF}
                disabled={isExporting}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <FileText className="h-4 w-4" />
                {isExporting ? 'Exporting...' : 'PDF'}
            </button>
            <button
                onClick={exportToExcel}
                disabled={isExporting}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <FileSpreadsheet className="h-4 w-4" />
                {isExporting ? 'Exporting...' : 'Excel'}
            </button>
        </div>
    );
}
