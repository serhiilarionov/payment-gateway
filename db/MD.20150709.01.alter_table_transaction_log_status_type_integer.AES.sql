ALTER TABLE public.transaction_log
ALTER COLUMN status TYPE INTEGER USING status::INTEGER;