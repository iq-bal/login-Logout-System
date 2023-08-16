const mongoose = require('mongoose');

const PeriodSchema = new mongoose.Schema({
  course_code: String,
  course_title: String,
  course_teacher: String,
  duration: String,
});

const DaySchema = new mongoose.Schema({
  period_1: PeriodSchema,
  period_2: PeriodSchema,
  period_3: PeriodSchema,
  period_4: PeriodSchema,
  period_5: PeriodSchema,
  period_6: PeriodSchema,
  period_7: PeriodSchema,
  period_8: PeriodSchema,
  period_9: PeriodSchema,
});

const SectionRoutineSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
  },
  sunday: DaySchema,
  monday: DaySchema,
  tuesday: DaySchema,
  wednesday: DaySchema,
  thursday: DaySchema,
});

const Routine = mongoose.model('Routine', SectionRoutineSchema);

module.exports = Routine;
