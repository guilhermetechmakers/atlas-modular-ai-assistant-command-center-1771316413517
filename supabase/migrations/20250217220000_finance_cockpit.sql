-- finance_cockpit table (scope/settings)
CREATE TABLE IF NOT EXISTS finance_cockpit (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE finance_cockpit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "finance_cockpit_read_own" ON finance_cockpit
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "finance_cockpit_insert_own" ON finance_cockpit
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "finance_cockpit_update_own" ON finance_cockpit
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "finance_cockpit_delete_own" ON finance_cockpit
  FOR DELETE USING (auth.uid() = user_id);

-- finance_transactions for ledger (import CSV, manual add, categorize, filter by project/client)
CREATE TABLE IF NOT EXISTS finance_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT NOT NULL,
  amount_cents BIGINT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT,
  project_client TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE finance_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "finance_transactions_read_own" ON finance_transactions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "finance_transactions_insert_own" ON finance_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "finance_transactions_update_own" ON finance_transactions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "finance_transactions_delete_own" ON finance_transactions
  FOR DELETE USING (auth.uid() = user_id);

-- finance_invoices for invoices panel (entries with manual status updates)
CREATE TABLE IF NOT EXISTS finance_invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reference TEXT NOT NULL,
  client_name TEXT,
  amount_cents BIGINT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  due_date DATE,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE finance_invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "finance_invoices_read_own" ON finance_invoices
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "finance_invoices_insert_own" ON finance_invoices
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "finance_invoices_update_own" ON finance_invoices
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "finance_invoices_delete_own" ON finance_invoices
  FOR DELETE USING (auth.uid() = user_id);
