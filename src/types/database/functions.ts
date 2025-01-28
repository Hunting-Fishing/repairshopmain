export interface DatabaseFunctions {
  get_organization_user_emails: {
    Args: {
      org_id: string;
    };
    Returns: {
      user_id: string;
      email: string;
    }[];
  };
}