'use client'
import { db } from '@/utils/dbConfig';
import { Budgets, Expenses } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { getTableColumns, eq, sql, desc } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import Budgetitem from '../../budgets/_components/Budgetitem';
import AddExpense from '../_components/AddExpense';
import ExpenseListTable from '../_components/ExpenseListTable';
import { PenBox, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import EditBudget from '../_components/EditBudget';
import { ProtectedRoute } from '@/app/_components/ProtectedRoute';


function ExpensesScreen({params}) {
  const {user} = useUser();
  const [budgetInfo, setbudgetInfo]=useState();
  const router =useRouter();
  const [expensesList, setExpensesList] = useState([]);
  useEffect(() => {
    user&&getBudgetInfo();
  },[user]);

  const getBudgetInfo = async() => {
    const result = await db.select({
      ...getTableColumns(Budgets),
      totalSpend:sql`sum(${Expenses.amount}::numeric)`,
      totalItem:sql `count(${Expenses.id}::int)`
  })
  .from(Budgets)
  .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
  .where(eq(Budgets.createdBy,user?.primaryEmailAddress?.emailAddress))
  .where(eq(Budgets.id,params.id))
  .groupBy(Budgets.id);
  setbudgetInfo(result[0]);
  getExpensesList();

  }

  // get latest information
  const getExpensesList = async() => {
    const result = await db.select().from(Expenses)
    .where(eq(Expenses.budgetId, params.id))
    .orderBy(desc(Expenses.id));
    setExpensesList(result);
    console.log(result);

  }

  // used to delete budget
  const deleteBudget=async()=> {
    const deleteExpenseResult = await db.delete(Expenses)
    .where(eq(Expenses.budgetId, params.id))
    .returning();

    if(deleteExpenseResult){
      const result = await db.delete(Budgets)
      .where(eq(Budgets.id, params.id))
      .returning();
    }
    toast('Budget Deleted! ');
    router.replace('/dashboard/budgets');
  }
  

  return (
    <ProtectedRoute>
    <div className='p-10'>
      <h2 className='text-2xl font-bold mb-5 flex justify-between cursor-pointer' onClick={() => router.back()}>
      🡠 My Expenses
       <div className='flex gap-2 items-center'>
       <EditBudget budgetInfo = {budgetInfo}
        refreshData={() => getBudgetInfo()}
       />
        <AlertDialog>
          <AlertDialogTrigger asChild>
          <Button className='flex gap-2' variant = 'destructive'> 
          <Trash/> Delete</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your current budget along with expenses
                and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick = {() => deleteBudget()}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
       </div>

      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        {budgetInfo? <Budgetitem
        budget={budgetInfo}
        />:
        <div className='h-[150px] w-full bg-slate-200 rounded-lg animate-pulse'></div>}
        <AddExpense budgetId={params.id}
          user= {user}
          refreshData={() => getBudgetInfo()}
        />
      </div>
      <div className='mt-4'>
        <ExpenseListTable expenseList={expensesList}
          refreshData={() => getBudgetInfo()}
        />
      </div>
    </div>
    </ProtectedRoute>
  )
}

export default ExpensesScreen

