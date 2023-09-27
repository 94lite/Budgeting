import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const BasicDatePicker = props => {
  const { label, defaultDate, setDate } = props;

  const toDate = djs => {
    const year = djs.get("year");
    const month = djs.get("month") + 1;
    const day = djs.get("date");
    setDate(`${year}-${month > 9 ? month : `0${month}`}-${day > 9 ? day : `0${day}`}`)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker
          format='YYYY-MM-DD'
          defaultValue={defaultDate ? dayjs(defaultDate) : undefined}
          label={label}
          onChange={djs => toDate(djs)}
          sx={{
            color: "white",
            "& label": { color: "white", font: "unset" },
            "& label.Mui-focused": { color: "unset" },
            "& .MuiOutlinedInput-root": {
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