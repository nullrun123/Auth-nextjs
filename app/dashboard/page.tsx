import React from 'react'
import { auth } from '@/auth';
async function DashboardPage() {
    const session = await auth();
    // console.log(session)
  return (
    <div>
      DashB
    </div>
  )
}

export default DashboardPage
