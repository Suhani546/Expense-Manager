"use client"
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { sql, eq, getTableColumns, desc } from 'drizzle-orm';
import { db } from '@/utils/dbConfig';
import { Budgets, Expenses } from '@/utils/schema';
import ExpenseListTable from './_components/ExpenseListTable';
import { ProtectedRoute } from '@/app/_components/ProtectedRoute';

function ExpensePage() {

  const [budgetList, setBudgetList] = useState([]);
  const [expenseList, setExpensesList] = useState([]);
  const {user} = useUser();

  useEffect(() => {
      user&&getBudgetList();
  },[user])

  const getBudgetList=async()=>{

      const result = await db.select({
          ...getTableColumns(Budgets),
          totalSpend:sql`sum(${Expenses.amount}::numeric)`,
          totalItem:sql `count(${Expenses.id}::int)`
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy,user?.primaryEmailAddress?.emailAddress))
      .groupBy(Budgets.id)
      .orderBy(desc(Budgets.id));
      setBudgetList(result);
      getAllExpenses();
  }

// Used to get all expenses belong to users 
const getAllExpenses = async () => {
  const result = await db.select({
      id: Expenses.id,
      name: Expenses.name,
      amount: Expenses.amount,
      createdAt: Expenses.createdAt
    })
    .from(Budgets)
    .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
    .where(eq(Budgets.createdBy, user?.primaryEmailAddress.emailAddress))
    .orderBy(desc(Expenses.id));

    setExpensesList(result);
    console.log(result);
}
  return (
    <ProtectedRoute>
    <div className='p-6'>
      <ExpenseListTable
        expenseList= {expenseList}
        refreshData={() => getBudgetList}
        />
    </div>
    </ProtectedRoute>
  )
}

export default ExpensePage
