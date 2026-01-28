import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import App from '../App'
import { TestProviders } from '../test/TestProviders'

describe('App smoke', () => {
  it('renders tabs', () => {
    const { getByText } = render(
      <TestProviders>
        <App />
      </TestProviders>,
    )
    expect(getByText('资产')).toBeDefined()
    expect(getByText('转账')).toBeDefined()
    expect(getByText('批准')).toBeDefined()
    expect(getByText('签名')).toBeDefined()
    expect(getByText('多链')).toBeDefined()
  })
})