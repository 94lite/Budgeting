import React, { useState } from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  background: "red",
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  textAlign: "center"
};

const BudgetSubmitter = props => {
  const { budget } = props;
  const [open, setOpen] = useState(false);
  if (open) {
    console.log(budget);
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <Box sx={style}>
          <div>Set Amount Remaining</div>
          <div>
            <Input />
          </div>
          <div>
            <Button
              variant="contained"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
            >
              Submit
            </Button>
          </div>
        </Box>
      </Modal>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
      >
        Submit
      </Button>
    </div>
  )
};

export default BudgetSubmitter;