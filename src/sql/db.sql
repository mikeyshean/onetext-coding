/*
  3. Database Tables

  At OneText, we use our database to store payments/transactions, and later derive statistics about those payments.

  Please design a 'payment' sql database table to track individual credit card payments:
  
  - Track the date, sender, receiver, currency, amount, and status of the payment (initiated, success, error)
  - Write a query which can be used against the table to track the percentage of successful payments per day
  - Write a query which shows the total sum of different amounts in different currencies for transactions which
    failed with an error
  - Write a query which shows the average number of payments made to each individual receiver
*/

/*

For the purpose of this exercise I'm defining all values in this one table, but I suppose 
sender, receiver, and currency could potentially be FK references to another entity.

Payment Table Schema:
id: PK
sender: string
receiver: string
currency: string
amount: decimal
status: string(enum)
payment_date: datetime
*/

CREATE TABLE payments (
  id serial PRIMARY KEY,
  sender VARCHAR ( 50 ),
  receiver VARCHAR ( 50 ),
  currency VARCHAR ( 10 ),
  amount NUMERIC(8, 2),
  status VARCHAR(20),
  payment_date DATE
);

INSERT INTO payments (sender, receiver, currency, amount, status, payment_date) VALUES
  ('send1', 'rec1', 'USD', 19.99, 'initiated', '2023-01-22'),
  ('send2', 'rec2', 'USD', 5.00, 'success', '2023-01-22'),
  ('send3', 'rec3', 'EUR', 19.99, 'error', '2023-01-23'),
  ('send4', 'rec4', 'USD', 5.00, 'success', '2023-01-23'),
  ('send4', 'rec4', 'JPY', 15.00, 'error', '2023-01-23'),
  ('send5', 'rec5', 'USD', 19.99, 'initiated', '2023-01-24'),
  ('send6', 'rec6', 'USD', 10.00, 'initiated', '2023-01-24'),
  ('send6', 'rec6', 'USD', 20.00, 'success', '2023-01-24'),
  ('send7', 'rec7', 'USD', 19.99, 'success', '2023-01-25'),
  ('send8', 'rec8', 'USD', 19.99, 'success', '2023-01-25'),
  ('send9', 'rec9', 'USD', 19.99, 'error', '2023-01-26'),
  ('send10', 'rec10', 'USD', 19.99, 'success', '2023-01-26'),
  ('send9', 'rec9', 'GBP', 19.99, 'error', '2023-01-26'),
  ('send9', 'rec9', 'GBP', 19.99, 'error', '2023-01-26'),


-- Write a query which can be used against the table to track the percentage of successful payments per day
SELECT 
  date_trunc('day', payment_date) as day, 
  TRUNC(100.0 * SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) / COUNT(*), 2) as pct
FROM payments
GROUP BY day
ORDER BY day


-- Write a query which shows the total sum of different amounts in different currencies for transactions which failed with an error
SELECT 
  currency, 
  SUM(amount) as total
FROM payments
WHERE status = 'error'
GROUP BY currency 
ORDER BY total



-- Write a query which shows the average number of payments made to each individual receiver

-- I was a little confused by this statement, so I'm providing some reasonable assumptions like 
-- average # of payments for a receiver/day or average payment amount for a given receiver

-- Average payment (amount) made to each receiver
SELECT receiver, TRUNC(AVG(amount), 2) as avg
FROM payments
-- WHERE status = 'success' -- add filter if we only want to consider certain statuses
GROUP BY receiver
ORDER BY avg



-- Average # of payments for a receiver/day
-- First version using subquery in select

SELECT receiver, TRUNC(SUM(count_transactions)::decimal / (SELECT max(payment_date) - min(payment_date) + 1.0 FROM payments), 2) as avg_transaction_per_day
FROM (
  SELECT payment_date, receiver, count(*) count_transactions
  FROM payments
  GROUP BY payment_date, receiver
  ORDER BY payment_date
) as daily_transactions
GROUP BY receiver
ORDER BY avg_transaction_per_day;

-- Tried another version using variables to store reference to min/max date so we don't need to run that sub-query for each receiver.
-- Didn't quite get it working, but this is the direction I was heading in:
DO
  DECLARE min_date date,
  DECLARE max_date date;

BEGIN
	SELECT MIN(payment_date)
  INTO min_date
  FROM payments;
  
  SELECT MAX(payment_date)
  INTO max_date
  FROM payments;

  SELECT receiver, TRUNC(SUM(count_transactions)::decimal / (max_date - min_date + 1.0), 2) as avg_transaction_per_day
  FROM (
    SELECT date, receiver, count(*) count_transactions
    FROM payments
    GROUP BY payment_date, receiver
    ORDER BY payment_date
  ) as daily_transactions
  GROUP BY receiver
  ORDER BY avg_transaction_per_day;
END;
