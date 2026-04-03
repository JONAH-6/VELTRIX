import type { Meta, StoryObj } from '@storybook/react'

import GamePage from './GamePage'

const meta: Meta<typeof GamePage> = {
  component: GamePage,
}

export default meta

type Story = StoryObj<typeof GamePage>

export const Primary: Story = {}
