import React from 'react';
import Button from './Button';

const meta = {
  title: 'UI Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'danger'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
    onClick: { action: 'clicked' },
  },
};

export default meta;

export const Primary = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
};

export const Secondary = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
};

export const Danger = {
  args: {
    children: 'Danger Button',
    variant: 'danger',
  },
};

export const Small = {
  args: {
    children: 'Small Button',
    size: 'small',
  },
};

export const Medium = {
  args: {
    children: 'Medium Button',
    size: 'medium',
  },
};

export const Large = {
  args: {
    children: 'Large Button',
    size: 'large',
  },
};

export const Disabled = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
};

export const AllVariants = {
  render: () => {
    return React.createElement(
      'div',
      { style: { display: 'flex', gap: '1rem', flexWrap: 'wrap' } },
      React.createElement(Button, { variant: 'primary' }, 'Primary'),
      React.createElement(Button, { variant: 'secondary' }, 'Secondary'),
      React.createElement(Button, { variant: 'danger' }, 'Danger')
    );
  },
};

export const AllSizes = {
  render: () => {
    return React.createElement(
      'div',
      { style: { display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' } },
      React.createElement(Button, { size: 'small' }, 'Small'),
      React.createElement(Button, { size: 'medium' }, 'Medium'),
      React.createElement(Button, { size: 'large' }, 'Large')
    );
  },
};