import React from 'react'

type Props = { params: { id: string } }

export const metadata = {
  title: 'Detail Usulan - SIBAD'
}

export default function Page({ params }: Props) {
  return (
    <main style={{ padding: 24 }}>
      <h1>Detail Usulan</h1>
      <p>ID: {params.id}</p>
      <p>Placeholder untuk halaman detail usulan.</p>
    </main>
  )
}
