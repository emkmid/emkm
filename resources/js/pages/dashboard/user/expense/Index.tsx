import { Link, usePage } from '@inertiajs/react';
import React from 'react';

interface Expense {
    id: number;
    description: string;
    amount: number;
    date: string;
    expense_category: {
        name: string;
    };
}

interface PageProps {
    expenses: Expense[];
}

const MyExpenses: React.FC = () => {
    const { expenses } = usePage<PageProps>().props;

    return (
        <div>
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Pengeluaran Saya</h3>
                <Link href={route('expense.create')} className="button bg-blue-600 text-white hover:bg-blue-700">
                    Tambah Pengeluaran
                </Link>
            </div>

            <div className="card">
                <div className="w-full overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-y border-gray-100 dark:border-gray-800">
                                {['Kategori', 'Deskripsi', 'Jumlah', 'Tanggal', 'Aksi'].map((heading) => (
                                    <th className="py-3" key={heading}>
                                        <div className="flex items-center">
                                            <p className="text-theme-xs font-medium text-gray-500 dark:text-gray-400">{heading}</p>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {expenses.length > 0 ? (
                                expenses.map((expense) => (
                                    <tr key={expense.id}>
                                        <td className="py-3">
                                            <p className="text-theme-sm text-gray-500 dark:text-gray-400">{expense.expense_category.name}</p>
                                        </td>
                                        <td className="py-3">
                                            <p className="text-theme-sm text-gray-500 dark:text-gray-400">{expense.description}</p>
                                        </td>
                                        <td className="py-3">
                                            <p className="text-theme-sm text-gray-500 dark:text-gray-400">
                                                Rp{Number(expense.amount).toLocaleString('id-ID')}
                                            </p>
                                        </td>
                                        <td className="py-3">
                                            <p className="text-theme-sm text-gray-500 dark:text-gray-400">{expense.date}</p>
                                        </td>
                                        <td className="py-3">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={route('expense.edit', { expense: expense.id })}
                                                    className="button button-sm bg-blue-600 text-white hover:bg-blue-700"
                                                >
                                                    Edit
                                                </Link>
                                                <form
                                                    method="POST"
                                                    action={route('expense.destroy', { expense: expense.id })}
                                                    onSubmit={(e) => {
                                                        if (!confirm('Yakin ingin menghapus?')) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                >
                                                    <input type="hidden" name="_method" value="DELETE" />
                                                    <button type="submit" className="button button-sm bg-red-600 text-white hover:bg-red-700">
                                                        Hapus
                                                    </button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-4 text-center text-gray-600 dark:text-white">
                                        Belum ada pengeluaran
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MyExpenses;
