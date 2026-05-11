"use client";

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '16px' }}>{title}</h1>
      <p style={{ color: 'var(--on-surface-variant)' }}>This module is currently under development. Stay tuned!</p>
      <div style={{ fontSize: '64px', marginTop: '40px' }}>🚧</div>
    </div>
  );
}
