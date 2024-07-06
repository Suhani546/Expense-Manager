import React from 'react'
import BudgetList from './_components/BudgetList'
import { ProtectedRoute } from '@/app/_components/ProtectedRoute'

function Budget() {
  return (
    <ProtectedRoute>
    <div className='p-10'>
    <h2 className='font-bold text-3xl' >My Budgets</h2>
      <BudgetList/>
    </div>
    </ProtectedRoute>
  )
}

export default Budget
