CREATE OR REPLACE FUNCTION get_organization_user_emails(org_id UUID)
RETURNS TABLE (
    user_id UUID,
    email TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        au.id as user_id,
        au.email
    FROM auth.users au
    INNER JOIN profiles p ON p.id = au.id
    WHERE p.organization_id = org_id
    AND EXISTS (
        SELECT 1 
        FROM profiles 
        WHERE id = auth.uid() 
        AND organization_id = org_id
    );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_organization_user_emails TO authenticated;