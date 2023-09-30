export default class Income {
  constructor(props, paid) {
    const {
      id, income,
      type, fixed,
      progress,
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

  setPaid(status, resetProgress) {
    this.paid = status;
    if (resetProgress) {
      this.progress = 0;
    }
  }
  
  getAmount() {
    if (this.fixed) {
      return this.amount;
    }
    return this.maximum || this.minimum;
  }
};