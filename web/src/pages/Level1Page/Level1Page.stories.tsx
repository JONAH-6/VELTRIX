import type { Meta, StoryObj } from '@storybook/react'

import Level1Page from './Level1Page'

const meta: Meta<typeof Level1Page> = {
  component: Level1Page,
}

export default meta

type Story = StoryObj<typeof Level1Page>

export const Primary: Story = {}
