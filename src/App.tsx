import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { RootLayout } from './components/layout/RootLayout'
import { Home } from './pages/Home'
import { Projects } from './pages/Projects'
import { Education } from './pages/Education'
import { Skills } from './pages/Skills'
import { Activities } from './pages/Activities'
import { Languages } from './pages/Languages'
import ImagesPage from './pages/Images'
import { Contact } from './pages/Contact'
import { Resume } from './pages/Resume'
import { NotFound } from './pages/NotFound'

function App() {
  return (
    <RootLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/education" element={<Education />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/languages" element={<Languages />} />
        <Route path="/images" element={<ImagesPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </RootLayout>
  )
}

export default App
