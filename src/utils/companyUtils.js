export function isOwner(companyUser) {
  return companyUser.roleCompany === 'OWNER'
}

export function isConfirmed(companyUser) {
  return companyUser.company.status === 'CONFIRMED'
}