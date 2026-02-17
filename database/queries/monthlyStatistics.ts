import dataSource from "../data-source";
import { Bill } from "../entities/bills.entities";
import { Expense } from "../entities/expense.entities";import { MONTHES_NAMES } from "src/constants/months.constants";

export const getMonthlyBillsSum = async() => {
    const year = new Date().getFullYear();
    const start = `${year}-01-01`;
    const end = `${year + 1}-01-01`;

    const rows = await dataSource
        .getRepository(Bill)
        .createQueryBuilder('b')
        .select("TO_CHAR(DATE_TRUNC('month', b.dueDate), 'Mon')", 'month') 
        .addSelect('SUM(b.amount)', 'total')
        .where('b.dueDate >= :start AND b.dueDate < :end', { start, end })
        .groupBy("DATE_TRUNC('month', b.dueDate)")
        .orderBy("DATE_TRUNC('month', b.dueDate)", 'ASC')
        .getRawMany<{ month: string; total: string }>();

    return rows.map((r) => ({
        month: r.month,
        total: Number(r.total) || 0,
    }));
}

export const getMonthlyExpensesSum = async() => {
    const year = new Date().getFullYear();
    const start = new Date(Date.UTC(year, 0, 1));
    const end = new Date(Date.UTC(year + 1, 0, 1));

    const rows = await dataSource
        .getRepository(Expense)
        .createQueryBuilder('e')
        .select("TO_CHAR(DATE_TRUNC('month', e.createdAt), 'Mon')", 'month') // Jan, Feb...
        .addSelect('SUM(e.amount)', 'total')
        .where('e.createdAt >= :start AND e.createdAt < :end', { start, end })
        .groupBy("DATE_TRUNC('month', e.createdAt)")
        .orderBy("DATE_TRUNC('month', e.createdAt)", 'ASC')
        .getRawMany<{ month: string; total: string }>();

    return rows.map((r) => ({
        month: r.month,
        total: Number(r.total) || 0,
    }));
}