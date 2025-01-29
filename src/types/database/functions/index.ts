export interface DatabaseFunctions {
  get_organization_user_emails: {
    Args: { org_id: string }
    Returns: Array<{
      user_id: string
      email: string
    }>
  }
}