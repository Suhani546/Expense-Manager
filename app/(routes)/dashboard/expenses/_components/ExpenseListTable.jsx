import { Trash } from 'lucide-react'
import React from 'react'
import moment from 'moment'
import { Expenses } from '@/utils/schema'
import { toast } from 'sonner'
import { db } from '@/utils/dbConfig'
import { eq } from 'drizzle-orm'


function ExpenseListTable({expenseList, refreshData}) {
  const deleteExpense = async(expenses) => {
    const result = await db.delete(Expenses)
    .where(eq(Expenses.id, expenses.id))
    .returning();

    if(result){
      toast('Expense Deleted!');
      refreshData();
    }
  }

  // if (!expenseList) {
  //   return <div>Loading...</div>; // Handle loading state or return early if data is not ready
  // }

  return (
    <div className='mt-3'>
    <h2 className='font-bold text-lg mt-3 mb-6'>Latest Expense</h2>
    {expenseList.length > 0 ? (
      <div>
        <div className='grid grid-cols-4 bg-slate-200 p-2'>
          <h2 className='font-bold'>Name</h2>
          <h2 className='font-bold'>Amount</h2>
          <h2 className='font-bold'>Date</h2>
          <h2 className='font-bold'>Action</h2>
        </div>
        {expenseList.map((expenses, index) => (
          <div key={index} className='grid grid-cols-4 bg-slate-50 p-2'>
            <h2>{expenses.name}</h2>
            <h2>{expenses.amount}</h2>
            <h2>{expenses.createdAt ? moment(expenses.createdAt).format('DD/MM/YYYY') : ''}</h2>
            <h2 className='ml-5'>
              {expenses.id && (
                <Trash
                  className='text-red-600 cursor-pointer'
                  onClick={() => deleteExpense(expenses)}
                />
              )}
            </h2>
          </div>
        ))}
      </div>
    ) : (
      <p>No expenses available.</p>
    )}
  </div>
  )
}

export default ExpenseListTable
