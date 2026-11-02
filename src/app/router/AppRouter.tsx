import { BrowserRouter, Navigate, Route, Routes } from 'react-router'

import { Main } from '@/pages/Main'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
