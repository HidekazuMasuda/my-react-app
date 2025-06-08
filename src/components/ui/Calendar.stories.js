import React, { useState } from 'react';
import Calendar from './Calendar';

const meta = {
  title: 'UI Components/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'text' },
      description: 'YYYY-MM-DD形式の選択済み日付',
    },
    minDate: {
      control: { type: 'text' },
      description: '選択可能な最小日付（YYYY-MM-DD形式）',
    },
    maxDate: {
      control: { type: 'text' },
      description: '選択可能な最大日付（YYYY-MM-DD形式）',
    },
    disabled: {
      control: { type: 'boolean' },
    },
    required: {
      control: { type: 'boolean' },
    },
    onChange: { action: 'date changed' },
  },
};

export default meta;

const CalendarWithState = props => {
  const [value, setValue] = useState(props.value || '');
  return React.createElement(Calendar, {
    ...props,
    value: value,
    onChange: date => {
      setValue(date);
      props.onChange && props.onChange(date);
    },
  });
};

export const Default = {
  render: () =>
    React.createElement(CalendarWithState, {
      placeholder: '日付を選択してください',
    }),
};

export const WithLabel = {
  render: () =>
    React.createElement(CalendarWithState, {
      label: '期限日',
      placeholder: '期限日を選択してください',
    }),
};

export const Required = {
  render: () =>
    React.createElement(CalendarWithState, {
      label: '必須の日付',
      required: true,
      placeholder: '日付を選択してください',
    }),
};

export const WithError = {
  render: () =>
    React.createElement(CalendarWithState, {
      label: '日付',
      error: '過去の日付は選択できません',
      placeholder: '日付を選択してください',
    }),
};

export const Disabled = {
  render: () =>
    React.createElement(CalendarWithState, {
      label: '無効な日付選択',
      disabled: true,
      value: '2025-12-25',
    }),
};

export const WithMinDate = {
  render: () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    return React.createElement(CalendarWithState, {
      label: '明日以降の日付',
      minDate: tomorrowStr,
      placeholder: '明日以降を選択してください',
    });
  },
};

export const WithMaxDate = {
  render: () => {
    const today = new Date();
    const oneMonthLater = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate()
    );
    const maxDateStr = oneMonthLater.toISOString().split('T')[0];

    return React.createElement(CalendarWithState, {
      label: '1ヶ月以内の日付',
      maxDate: maxDateStr,
      placeholder: '1ヶ月以内を選択してください',
    });
  },
};

export const WithDateRange = {
  render: () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const minDateStr = tomorrow.toISOString().split('T')[0];
    const maxDateStr = nextWeek.toISOString().split('T')[0];

    return React.createElement(CalendarWithState, {
      label: '明日から1週間以内',
      minDate: minDateStr,
      maxDate: maxDateStr,
      placeholder: '期間内の日付を選択してください',
    });
  },
};

export const PreSelected = {
  render: () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    return React.createElement(CalendarWithState, {
      label: '事前選択済み',
      value: tomorrowStr,
      placeholder: '日付を選択してください',
    });
  },
};

export const AllStates = {
  render: () =>
    React.createElement(
      'div',
      {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          minWidth: '300px',
        },
      },
      React.createElement(CalendarWithState, {
        label: 'デフォルト',
        placeholder: '日付を選択してください',
      }),
      React.createElement(CalendarWithState, {
        label: '必須項目',
        required: true,
        placeholder: '必須の日付',
      }),
      React.createElement(CalendarWithState, {
        label: 'エラー状態',
        error: '過去の日付は選択できません',
        placeholder: '日付を選択してください',
      }),
      React.createElement(CalendarWithState, {
        label: '無効状態',
        disabled: true,
        value: '2025-12-25',
      })
    ),
};
