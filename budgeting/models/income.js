import { getNextDate } from "@/utility/payments";
import { dateToString } from "@/utility/dates";

export default class Income {
  constructor(props, paid, nextPayDate, progress) {
    const {
      id, income,
      type, fixed,
      amount,
      minimum, maximum,
      frequency, frequency_value
    } = props;
    this.income = income;
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
        const [month, day] = frequency_value.split("-");
        return [parseInt(month) - 1, parseInt(day)];
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

  setPaid(override) {
    if (override !== undefined) {
      this.paid = override;
      return;
    }
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
    this.nextPayDate = getNextDate(strDate, this.frequency);
    if (skipReset) {
      return;
    }
    this.reset();
  }
};