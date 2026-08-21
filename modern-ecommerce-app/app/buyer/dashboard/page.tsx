import BuyersDashboardShell from '@/components/buyer/BuyersDashboardShell'
import { Suspense } from 'react'

const BuyersDashboard = () => {



  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <BuyersDashboardShell />
    </Suspense>
  )
}

export default BuyersDashboard
