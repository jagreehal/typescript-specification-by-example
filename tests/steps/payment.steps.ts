import { DataTable, setWorldConstructor, Given, Then, When, World } from '@cucumber/cucumber';
import assert from 'node:assert/strict';

import { z } from 'zod';

const EmployeeSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});
const DaysWorkedSchema = z.object({
  email: z.string().email(),
  days: z.number().nonnegative(),
});
const PaymentSchema = z.object({
  email: z.string().email(),
  amount: z.number().nonnegative(),
});

type Employee = z.infer<typeof EmployeeSchema>;
type DaysWorked = z.infer<typeof DaysWorkedSchema>;
type Payment = z.infer<typeof PaymentSchema>;

class PaymentsContext extends World {
  employees: Employee[] = [];
  daysWorked: DaysWorked[] = [];
  payments: Payment[] = [];
  paymentPerDay: number = 0;
}

setWorldConstructor(PaymentsContext);

Given('the following people are employed', function (this: PaymentsContext, table: DataTable) {
  const dataTable = table.hashes();
  this.employees = z.array(EmployeeSchema).parse(
    dataTable.map((row) => ({      
      email: row['Email'],
      name: row['Name'],
    }))
  );
});

Given('they spent this time on the project', function (this: PaymentsContext, table: DataTable) {
  const dataTable = table.hashes();
  this.daysWorked = z.array(DaysWorkedSchema).parse(
    dataTable.map((row) => ({
      email: row['Email'],
      days: Number.parseInt(row['Days'], 10),
    }))
  );
});

Given('they each gets paid £{int} a day', function (this: PaymentsContext, paymentPerDay: number) {
  this.paymentPerDay = paymentPerDay;
});

When('I do the payrun', function (this: PaymentsContext) {
  this.payments = this.daysWorked.map((work) => ({
    email: work.email,
    amount: work.days * this.paymentPerDay,
  }));
});

Then('the payments should be', function (this: PaymentsContext, table: DataTable) {
  const expectedPayments = z.array(PaymentSchema).parse(table.hashes().map((row) => ({
    email: row['Email'],
    amount: Number.parseInt(row['Amount'], 10),
  })));

  for (const expected of expectedPayments) {
    const actual = this.payments.find(payment => payment.email === expected.email);
    assert.ok(actual, `Payment record not found for ${expected.email}`);
    assert.strictEqual(actual.amount, expected.amount, `Payment amount mismatch for ${expected.email}`);
  }
});