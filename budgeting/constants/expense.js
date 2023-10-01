import { getNextDate } from "./payments-utility";
import { dateToString } from "./dates";

export default class Expense {
  constructor(props, paid, nextPayDate, progress) {
    const {
      id, expenditure,
      type, fixed,
      amount,
      minimum, maximum,
      frequency, frequency_value
    } = props;
    this.expenditure = expenditure;
    this.paid = paid || false;
    this.fixed = fixed;
    this.progress = progress || 0;
    this.amount = amount;
    this.minimum = minimum;
    this.maximum = maximum;
    this.frequency = frequency;
    this.frequencyValue = this.parseFrequencyValue(frequency, frequency_value);
    this.nextPayDate = nextPayDate ? new Date(nextPayDate) : undefined;
  }

  parseFrequencyValue(frequency, frequency_value) {
    if (frequency_value === null) {
      return null;
    }
    switch (frequency) {
      case "yearly":
        return;
      case "monthly":
        return parseInt(frequency_value);
      case "fortnightly":
      case "weekly":
        return frequency_value;
      case "daily":
      default:
        return null;
    }
  }

  reset() {
    this.progress = 0;
    this.paid = false;
  }

  setPaid() {
    this.paid = true;
  }
  
  getAmount() {
    if (this.fixed) {
      return this.amount - this.progress;
    }
    return (this.maximum || this.minimum) - this.progress;
  }

  setNextDate(skipReset) {
    const strDate = dateToString(this.nextPayDate);
    getNextDate(strDate, this.frequency);
    if (skipReset) {
      return;
    }
    this.reset();
  }
};