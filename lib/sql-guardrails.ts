export function validateQuery(sql: string): boolean {
  const normalizedSql = sql.trim().toLowerCase();
  
  // Must ensure it selects
  if (!normalizedSql.startsWith('select') && !normalizedSql.startsWith('with')) {
    return false;
  }

  // Forbidden keywords
  const forbidden = ['insert', 'update', 'delete', 'drop', 'alter', 'truncate', 'create', 'grant', 'revoke'];
  
  if (forbidden.some(keyword => normalizedSql.includes(keyword + ' '))) {
      return false;
  }

  // No multiple statements
  if (normalizedSql.includes(';')) {
      // Allow ending semicolon
      if (normalizedSql.split(';').filter(s => s.trim().length > 0).length > 1) {
          return false;
      }
  }

  return true;
}
