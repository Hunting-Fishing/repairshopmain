
CREATE OR REPLACE FUNCTION set_staff_password(token text, new_password text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  token_record auth_tokens%ROWTYPE;
  user_id uuid;
BEGIN
  -- Get and validate token
  SELECT * INTO token_record
  FROM auth_tokens
  WHERE auth_tokens.token = set_staff_password.token
  AND type = 'password_reset'
  AND used_at IS NULL
  AND expires_at > NOW();

  IF token_record.id IS NULL THEN
    RAISE EXCEPTION 'Invalid or expired token';
  END IF;

  -- Get user ID
  user_id := token_record.user_id;

  -- Update user's password
  UPDATE auth.users
  SET encrypted_password = crypt(new_password, gen_salt('bf'))
  WHERE id = user_id;

  -- Mark token as used
  UPDATE auth_tokens
  SET used_at = NOW()
  WHERE id = token_record.id;

  -- Return success
END;
$$;
