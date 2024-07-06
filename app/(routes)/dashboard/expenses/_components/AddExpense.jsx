import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button';
import { Expenses } from '@/utils/schema';
import { db } from '@/utils/dbConfig';
import { toast } from 'sonner';
import { Budgets} from '@/utils/schema';
import moment from 'moment';
import { Loader } from 'lucide-react';


function AddExpense({ budgetId, user, refreshData }) {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false)

    // used to add new expenses
    const addNewExpense = async () => {
        try {
            console.log('Adding new expense with values:', {
                name,
                amount,
                budgetId,
                createdBy: user?.id,
            });

            setLoading(true)
            const result = await db.insert(Expenses).values({
                name: name,
                amount: parseFloat(amount),
                budgetId: budgetId,
                createdBy: user?.primaryEmailAddress?.emailAddress, 
            }).returning({ insertedId: Budgets.id });

            console.log('Insert result:', result);
            setAmount('');
            setName('');

            if (result) {
                setLoading(false)
                refreshData();
                toast('New Expense Added!');
            } else {
                toast.error('Failed to add expense');
            }
            setLoading(false);
        } catch (error) {
            console.error('Error adding expense:', error);
            toast.error(`Failed to add expense: ${error.message}`);
        }
    };

    

  return (
    <div className='border p-5 rounded-lg'>
      <h2 className='font-bold text-lg'>Add Expense</h2>
      <div className='mt-2'>
            <h2 className='text-black font-medium my-1'>Expense Name</h2>
            <Input placeholder="e.g Bedroom decor"
            value={name}
            onChange={(e)=> setName(e.target.value)}
            />
      </div>
      <div className='mt-2'>
            <h2 className='text-black font-medium my-1'>Expense Amount</h2>
            <Input placeholder="e.g 1000"
            value={amount}
            onChange={(e)=> setAmount(e.target.value)}
            />
      </div>   
      <Button disabled={!(name && amount) || loading}
      onClick = {() => addNewExpense()} 
      className = "mt-3 w-full">
      {loading?
      <Loader className='animate-spin'/>:'Add New Expense'
      }
      </Button>  
    </div>
  )
}

export default AddExpense
