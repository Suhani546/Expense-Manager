"use client"
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import CardInfo from './_components/CardInfo';
import { sql, eq, getTableColumns, desc } from 'drizzle-orm';
import { db } from '@/utils/dbConfig';
import { Budgets, Expenses } from '@/utils/schema';
import BarChartDashboard from './_components/BarChartDashboard';
import Budgetitem from './budgets/_components/Budgetitem';
import ExpenseListTable from './expenses/_components/ExpenseListTable';
import { ProtectedRoute } from '@/app/_components/ProtectedRoute';

function Dashboard() {

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
    <div className='p-8'>
      <h2 className='font-bold text-3xl mb-2'>Hi, {user?.fullName} ✌🏻</h2>
      <p className='text-gray-500 '>Here's what happening with your money, Lets Manage your expense</p>
      <CardInfo budgetList= {budgetList}/>
      <div className='grid grid-cols-1 md:grid-cols-3 mt-6 gap-5'>
        <div className='md:col-span-2'>
        <BarChartDashboard
          budgetList = {budgetList}
        />
        <ExpenseListTable
        expenseList= {expenseList}
        refreshData={() => getBudgetList}
        />
        </div>
        <div className='grid gap-5'>
        <h2 className='font-bold text-lg'>Latest Budgets</h2>
          {budgetList.map((budget,index) => (
            <Budgetitem budget={budget} key={index}/>
          ))}
        </div>
      </div>
    </div>
    </ProtectedRoute>
  )
}

export default Dashboard
