import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { dateToString } from '@/constants/dates';

const BasicDatePicker = props => {
  const { label, defaultDate, setDate } = props;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker
          format='YYYY-MM-DD'
          defaultValue={defaultDate ? dayjs(defaultDate) : undefined}
          label={label}
          onChange={djs => dateToString(djs)}
          sx={{
            color: "white",
            "&.MuiTextField-root": { minWidth: "unset" },
            "& label": { color: "white", font: "unset" },
            "& label.Mui-focused": { color: "unset" },
            "& .MuiOutlinedInput-root": {
              width: "160px",
              color: "white",
              fontFamily: "unset",
              "& fieldset": { borderColor: "white" },
              "&.Mui-focused fieldset": { borderColor: "unset" }
            },
            "& .MuiOutlinedInput-root:hover": {
              "& fieldset": { borderColor: "unset" }
            },
            "& svg": { color: "white" }
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  )
}

export default BasicDatePicker;