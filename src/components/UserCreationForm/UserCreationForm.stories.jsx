import UserCreationForm from './UserCreationForm';

export default {
  title: 'UserCreationForm',
  component: UserCreationForm,
  parameters: {
    layout: 'centered',
  },
};

export const Default = {
  args: {},
};

export const WithValidationErrors = {
  args: {},
  play: async ({ canvasElement }) => {
    // This would be extended to show validation states
  },
};